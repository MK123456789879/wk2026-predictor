import { cookies } from "next/headers";
import { pinToken } from "../../../lib/pin-auth";
import { env } from "../../../lib/env";

export const runtime = "nodejs";

export async function POST(req) {
  const expected = env("WEB_PIN");
  if (!expected) {
    return Response.json({ error: "WEB_PIN niet geconfigureerd" }, { status: 500 });
  }
  const { pin } = await req.json();
  if (pin !== expected) {
    return Response.json({ error: "Onjuiste pin" }, { status: 401 });
  }
  const store = await cookies();
  store.set("web_pin_auth", await pinToken(expected), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return Response.json({ ok: true });
}
