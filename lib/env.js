/** Strip optionele aanhalingstekens uit .env-waarden (WEB_PIN="2026" → 2026). */
export function env(key) {
  const v = process.env[key];
  if (v == null || v === "") return undefined;
  return v.replace(/^["']|["']$/g, "");
}
