# WK 2026 Predictor — Next.js + Vercel

Poisson-voorspelmodel + AI-onderbouwing voor het WK 2026, met bookmaker-interface.
De dataset zit al in `public/resultsfifa.csv`, dus de app laadt zonder plakken.

## Architectuur
- `app/page.jsx` — de hele UI (client component). Laadt bij start de CSV uit `/public`,
  bouwt het Poisson-model, vult groepen + knock-out, en toont odds-pills + invulstaat.
- `app/api/ai/route.js` — serverless route die Claude **serverside** aanroept
  (je API-key blijft geheim). De frontend praat alleen met `/api/ai`.

## Lokaal draaien (in Cursor)
1. Open deze map in Cursor.
2. Installeer dependencies:
   ```bash
   npm install
   ```
3. Maak `.env.local` (kopie van `.env.example`) en vul je key:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```
4. Start:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

## Deployen op Vercel
1. Zet dit in een GitHub-repo:
   ```bash
   git init && git add . && git commit -m "WK 2026 predictor"
   git branch -M main
   git remote add origin https://github.com/JOU/wk2026-predictor.git
   git push -u origin main
   ```
2. Ga naar vercel.com → **Add New… → Project** → importeer de repo.
3. Bij **Environment Variables** voeg je toe:
   - `ANTHROPIC_API_KEY` = je key
   - (optioneel) `CLAUDE_MODEL` = `claude-haiku-4-5` voor goedkoper/sneller
4. **Deploy**. Klaar — binnen een minuut staat 'ie live.

## Aanpassen
- Ander model: `CLAUDE_MODEL` env-var (standaard `claude-sonnet-4-6`).
- Andere data: vervang `public/resultsfifa.csv` (zelfde kolommen).
- De AI-route cap't `max_tokens` op 2000 en draait op de Node-runtime (60s).

## Volgende stap
- Voorspellingen bewaren per gebruiker (Supabase) i.p.v. alleen lokaal.
- Graph-inzichten uit Neo4j tonen bij elke pick (tweede API-route die Aura bevraagt).
