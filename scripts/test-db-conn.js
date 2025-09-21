// scripts/test-db-conn.js
import "dotenv/config";
import pkg from "pg";
const { Client } = pkg;

(async () => {
  const client = new Client({ connectionString: process.env.PG_CONNECTION });
  try {
    await client.connect();
    const res = await client.query("SELECT count(*) AS cnt FROM documents;");
    console.log("Connected — documents count:", res.rows[0].cnt);
    await client.end();
    process.exit(0);
  } catch (err) {
    console.error("DB connect error:", err);
    process.exit(1);
  }
})();
