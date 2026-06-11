import { NextResponse } from "next/server";
import { pinToken } from "./lib/pin-auth";

const OPEN = ["/pin", "/api/pin"];

export async function middleware(request) {
  const webPin = process.env.WEB_PIN;
  if (!webPin) return NextResponse.next();

  const { pathname } = request.nextUrl;
  const token = await pinToken(webPin);
  const ok = request.cookies.get("web_pin_auth")?.value === token;

  if (OPEN.includes(pathname)) {
    if (ok && pathname === "/pin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!ok) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Pin vereist" }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/pin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/pin|pin).*)",
  ],
};
