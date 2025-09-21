// /src/lib/ai.ts
import OpenAI from "openai";

const hasKey = !!process.env.OPENAI_API_KEY;
const client = hasKey ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

/**
 * Create a short, helpful reply when no keyword matched.
 */
export async function smartReply(context: {
  username?: string;
  message: string;
  history?: { role: "user" | "assistant"; content: string }[];
}) {
  if (!hasKey) {
    // Safe fallback to avoid crashes during setup
    return "Thanks for your message! A human will follow up shortly. Meanwhile, you can check pricing here: https://yourdomain.com/pricing";
  }

  const messages: any[] = [
    {
      role: "system",
      content:
        "You are a concise, friendly Instagram DM assistant for a small business. Keep replies under 80 words and end with one call to action.",
    },
  ];

  if (context.history?.length) messages.push(...context.history);
  messages.push({ role: "user", content: context.message });

  const chat = await client!.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0.5,
  });

  return chat.choices[0]?.message?.content ?? "Thanks for reaching out! How can I help today?";
}
