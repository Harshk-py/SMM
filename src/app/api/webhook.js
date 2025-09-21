import fetch from "node-fetch";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper: Send a DM back to the user
async function sendDM(userId, message) {
  try {
    const url = `https://graph.facebook.com/v20.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: userId },
        message: { text: message },
      }),
    });
    const data = await res.json();
    console.log("✅ Sent DM:", data);
    return data;
  } catch (err) {
    console.error("❌ Failed to send DM:", err);
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token && mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verified ✅");
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send("Verification failed ❌");
    }
  }

  if (req.method === "POST") {
    const body = req.body;

    if (body.object === "instagram") {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.field === "messages") {
            const msg = change.value.text; // use "text" instead of "message"
            const userId = change.value.from.id;

            console.log("📩 Incoming message:", msg);

            let reply = "Thanks for reaching out!";

            try {
              // 🔹 Keyword-based reply
              if (msg && msg.toLowerCase().includes("pricing")) {
                reply = "Our pricing starts at $99/month. Do you want me to send full details?";
              } else if (msg) {
                // 🔹 AI fallback reply
                const completion = await openai.chat.completions.create({
                  model: "gpt-4o-mini",
                  messages: [
                    { role: "system", content: "You are a helpful Instagram assistant for a business." },
                    { role: "user", content: msg },
                  ],
                });
                reply = completion.choices[0].message.content;
              }
            } catch (err) {
              console.error("❌ OpenAI error:", err);
              reply = "Sorry, I'm having trouble replying right now.";
            }

            // Send reply DM
            await sendDM(userId, reply);
          }
        }
      }
      return res.status(200).send("EVENT_RECEIVED");
    }

    return res.status(404).send("Not an Instagram event");
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
