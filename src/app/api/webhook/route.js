export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    console.log("Webhook verified ✅");
    return new Response(challenge, { status: 200 });
  } else {
    return new Response("Verification failed ❌", { status: 403 });
  }
}

export async function POST(req) {
  const body = await req.json();
  console.log("Webhook event:", JSON.stringify(body, null, 2));
  return new Response("EVENT_RECEIVED", { status: 200 });
}
