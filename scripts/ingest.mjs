// scripts/ingest.mjs
import { load } from "cheerio";
import { Client } from "pg";
import dotenv from "dotenv";
import process from "process";

dotenv.config();

// ---------- config ----------
// prefer NEXT_PUBLIC_BASE_URL (useful for Vercel), then SITE_URL, otherwise default to empty string
const envUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.SITE_URL || "";
export const SITE_URL = envUrl.replace(/\/$/, "") || ""; // "" means use relative paths

const PAGES = (process.env.PAGES ?? "/,/pricing,/free-audit,/contact")
  .split(",")
  .map((p) => p.trim())
  .filter(Boolean);

const OPENAI_KEY = process.env.OPENAI_API_KEY ?? null;
const PG_CONN = process.env.PG_CONNECTION ?? process.env.DATABASE_URL ?? null;
const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIM = 1536; // for text-embedding-3-small
// ----------------------------

// small helpers
function now() {
  return new Date().toISOString();
}

function log(...args) {
  console.log(now(), ...args);
}
function warn(...args) {
  console.warn(now(), "WARN:", ...args);
}
function error(...args) {
  console.error(now(), "ERROR:", ...args);
}

if (!PG_CONN) {
  error("No Postgres connection string found. Set PG_CONNECTION or DATABASE_URL in your .env");
  process.exit(1);
}

const pg = new Client({
  connectionString: PG_CONN,
});

await pg.connect();
log("Connected to Postgres.");

// Ensure documents table exists (best-effort)
await pg
  .query(`
CREATE TABLE IF NOT EXISTS documents (
  id bigserial PRIMARY KEY,
  url text NOT NULL UNIQUE,
  title text,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  embedding vector(${EMBEDDING_DIM})
);
`)
  .catch((err) => {
    // if vector extension not present, tell user but continue (we'll still insert rows without embeddings)
    warn(
      "Could not ensure documents table or vector column. If vector extension missing, you can still insert content but embeddings will fail on insert. Details:",
      err.message
    );
  });

// Retry helper for transient errors (429 etc)
async function retryWithBackoff(fn, { retries = 5, baseMs = 800 } = {}) {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      const status = err?.status || err?.response?.status || null;
      // don't retry for client errors that are not 429
      if (status && status < 429) throw err;
      if (attempt > retries) throw err;
      const waitMs = Math.round(baseMs * Math.pow(2, attempt - 1) + Math.random() * 300);
      warn(`Attempt ${attempt} failed${status ? ` (status ${status})` : ""}. Retrying in ${waitMs}ms — ${err?.message ?? err}`);
      await new Promise((res) => setTimeout(res, waitMs));
    }
  }
}

async function fetchPage(path) {
  const url = path.startsWith("http") ? path : SITE_URL + (path.startsWith("/") ? path : "/" + path);
  log("Fetching", url || "(relative) " + path);
  const res = await fetch(url || path, { headers: { "User-Agent": "nextfunnel-ingest/1.0" } });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} - ${text.slice(0, 200)}`);
  }
  const html = await res.text();
  return { url: url || path, html };
}

function extractTextAndTitle(html, url) {
  const $ = load(html);
  // Try to find main content: common tags
  let main = $("main");
  if (!main.length) {
    // try typical content containers
    main = $("#__next, #root, .content, main, article").first();
  }
  let text = "";
  if (main && main.length) {
    text = main.text();
  }
  if (!text || text.trim().length < 50) {
    // fallback to body text
    text = $("body").text();
  }
  // normalize whitespace
  text = text.replace(/\s+/g, " ").trim();
  // title
  let title = $("title").text().trim();
  if (!title) {
    title = $("h1").first().text().trim() || url;
  }
  return { title, text };
}

async function createEmbedding(text) {
  if (!OPENAI_KEY) throw new Error("OPENAI_API_KEY not set");
  // call OpenAI embeddings API
  const payload = { model: EMBEDDING_MODEL, input: text };
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const err = new Error(`OpenAI error ${res.status}: ${body}`);
    err.status = res.status;
    throw err;
  }
  const json = await res.json();
  const emb = json?.data?.[0]?.embedding;
  if (!emb || !Array.isArray(emb)) throw new Error("Invalid embedding response");
  return emb;
}

async function saveDocument({ url, title, content, embedding }) {
  // embedding: if provided, pass it as a string like '[0.1,0.2,...]' and cast to vector.
  if (embedding && Array.isArray(embedding)) {
    const embStr = `[${embedding.map((x) => Number(x).toFixed(8)).join(",")}]`;
    // Upsert
    const q = `
      INSERT INTO documents (url, title, content, embedding)
      VALUES ($1, $2, $3, $4::vector)
      ON CONFLICT (url) DO UPDATE
        SET title = EXCLUDED.title,
            content = EXCLUDED.content,
            embedding = EXCLUDED.embedding,
            created_at = now()
      RETURNING id;
    `;
    const r = await pg.query(q, [url, title, content, embStr]);
    return r.rows[0]?.id ?? null;
  } else {
    // no embedding available: insert/update without embedding (embedding remains NULL)
    const q = `
      INSERT INTO documents (url, title, content)
      VALUES ($1, $2, $3)
      ON CONFLICT (url) DO UPDATE
        SET title = EXCLUDED.title,
            content = EXCLUDED.content,
            created_at = now()
      RETURNING id;
    `;
    const r = await pg.query(q, [url, title, content]);
    return r.rows[0]?.id ?? null;
  }
}

async function main() {
  log("Starting ingest for", PAGES.length, "pages from", SITE_URL || "(relative)");
  let count = 0;
  for (const path of PAGES) {
    try {
      const { url, html } = await fetchPage(path);
      const { title, text } = extractTextAndTitle(html, url);
      log(`  text length: ${text.length} title: ${title}`);

      // If text is very short, warn and skip embedding but still save content
      if (!text || text.length < 20) {
        warn(`Page ${url} yielded very short content; saving but skipping embedding.`);
        await saveDocument({ url, title, content: text, embedding: null });
        continue;
      }

      // create embedding with retries
      let embedding = null;
      if (OPENAI_KEY) {
        try {
          const embJson = await retryWithBackoff(() => createEmbedding(text), { retries: 4, baseMs: 800 });
          embedding = embJson;
        } catch (err) {
          warn(`Embedding failed for ${path}: ${err?.message ?? err}. Will save page without embedding and continue.`);
          embedding = null;
        }
      } else {
        warn("OPENAI_API_KEY not set — skipping embedding and saving text only.");
      }

      const id = await saveDocument({ url, title, content: text, embedding });
      log(`Saved ${url} as id=${id} ${embedding ? "(with embedding)" : "(no embedding)"}`);
      count++;
    } catch (err) {
      error(`Error processing ${path}: ${err?.message ?? err}`);
      // Continue to next page rather than exit
      continue;
    }
  }

  log(`Ingest complete: ${count} pages processed.`);
}

try {
  await main();
} catch (err) {
  error("Fatal error during ingest:", err?.message ?? err);
} finally {
  await pg.end().catch(() => {});
  log("Postgres connection closed. Exiting.");
  process.exit(0);
}
