"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const css = `
.bk{--bg:#0a0e12;--s:#121821;--ln:#26313f;--tx:#eef2f6;--mut:#8b97a5;--gr:#16c66a;--ver:#ee6352;background:var(--bg);color:var(--tx);font-family:'Inter',system-ui,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;}
.card{background:var(--s);border:1px solid var(--ln);border-radius:14px;padding:28px 24px;max-width:360px;width:100%;}
h1{font-size:20px;margin:0 0 6px;}
p{color:var(--mut);font-size:14px;margin:0 0 20px;line-height:1.45;}
input{width:100%;background:#0c1118;border:1px solid var(--ln);border-radius:10px;color:var(--tx);font-size:18px;letter-spacing:.25em;text-align:center;padding:12px;outline:none;}
input:focus{border-color:var(--gr);}
button{margin-top:14px;width:100%;background:var(--gr);color:#04130a;border:none;border-radius:10px;padding:12px;font-size:15px;font-weight:700;cursor:pointer;}
button:disabled{opacity:.5;}
.err{color:var(--ver);font-size:13px;margin-top:10px;}
`;

export default function PinPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [fout, setFout] = useState("");
  const [busy, setBusy] = useState(false);

  async function verstuur(e) {
    e.preventDefault();
    setFout("");
    setBusy(true);
    try {
      const r = await fetch("/api/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Pin geweigerd");
      router.replace("/");
      router.refresh();
    } catch (err) {
      setFout(err.message);
    }
    setBusy(false);
  }

  return (
    <div className="bk">
      <style>{css}</style>
      <form className="card" onSubmit={verstuur}>
        <h1>Toegang vereist</h1>
        <p>Deze site is niet openbaar. Voer de pin in om verder te gaan.</p>
        <input
          type="password"
          inputMode="numeric"
          autoComplete="off"
          autoFocus
          placeholder="••••"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        <button type="submit" disabled={busy || !pin}>
          {busy ? "Controleren…" : "Ga verder"}
        </button>
        {fout && <div className="err">{fout}</div>}
      </form>
    </div>
  );
}
