export async function pinToken(pin) {
  const data = new TextEncoder().encode(`${pin}:wk2026-predictor`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
