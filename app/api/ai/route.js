import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 60;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-4-6";

export async function POST(req) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({ error: "ANTHROPIC_API_KEY ontbreekt" }, { status: 500 });
    }
    const { system, user, max_tokens } = await req.json();
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: Math.min(max_tokens || 1000, 2000),
      system,
      messages: [{ role: "user", content: user }],
    });
    const text = (msg.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
    return Response.json({ text });
  } catch (e) {
    return Response.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
