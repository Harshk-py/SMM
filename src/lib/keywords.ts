// /src/lib/keywords.ts
export const KEYWORDS: Record<string, string> = {
  pricing: "Here is our pricing page: https://yourdomain.com/pricing",
  price: "Here is our pricing page: https://yourdomain.com/pricing",
  demo: "I'd love to show you a demo. What's your email?",
  hello: "Hey! Thanks for reaching out 👋 How can I help today?",
  hi: "Hey! Thanks for reaching out 👋 How can I help today?",
};

export function matchKeyword(text: string): string | null {
  const t = (text || "").toLowerCase();
  for (const k of Object.keys(KEYWORDS)) {
    if (t.includes(k)) return k;
  }
  return null;
}
