import neo4j from "neo4j-driver";

export const runtime = "nodejs";
export const maxDuration = 30;

// Hergebruik 1 driver over warme invocaties
let _driver = null;
function getDriver() {
  if (!_driver) {
    _driver = neo4j.driver(
      process.env.NEO4J_URI,
      neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
    );
  }
  return _driver;
}

// App-naam -> mogelijke schrijfwijzen in de graph (mojibake/accenten)
const VARIANTEN = {
  Curacao: ["Curacao", "Curaçao"],
  Turkey: ["Turkey", "Türkiye"],
};
const kandidaten = (naam) => VARIANTEN[naam] || [naam];

const num = (v) => (v && typeof v.toNumber === "function" ? v.toNumber() : v);

export async function POST(req) {
  try {
    if (!process.env.NEO4J_URI) {
      return Response.json({ error: "NEO4J_URI ontbreekt" }, { status: 500 });
    }
    const { a, b } = await req.json();
    const A = kandidaten(a);
    const B = kandidaten(b);
    const session = getDriver().session();
    try {
      // 1. Tally: winst A, winst B, gelijk
      const tally = await session.run(
        `
        OPTIONAL MATCH (x:Country)-[w:BEAT]->(y:Country) WHERE x.name IN $A AND y.name IN $B
        WITH count(w) AS aWins
        OPTIONAL MATCH (x2:Country)-[w2:BEAT]->(y2:Country) WHERE x2.name IN $B AND y2.name IN $A
        WITH aWins, count(w2) AS bWins
        OPTIONAL MATCH (x3:Country)-[d:DREW]-(y3:Country) WHERE x3.name IN $A AND y3.name IN $B
        RETURN aWins, bWins, count(DISTINCT d) AS draws
        `,
        { A, B }
      );
      const tr = tally.records[0];
      const aWins = num(tr.get("aWins")) || 0;
      const bWins = num(tr.get("bWins")) || 0;
      const draws = num(tr.get("draws")) || 0;

      // 2. Laatste ontmoetingen
      const recent = await session.run(
        `
        MATCH (x:Country)-[r:BEAT|DREW]-(y:Country)
        WHERE x.name IN $A AND y.name IN $B
        RETURN type(r) AS type, startNode(r).name AS winnaar,
               toString(r.date) AS datum, r.hs AS hs, r.as AS as, r.score AS score
        ORDER BY r.date DESC LIMIT 5
        `,
        { A, B }
      );
      const laatste = recent.records.map((rec) => ({
        type: rec.get("type"),
        winnaar: rec.get("winnaar"),
        datum: rec.get("datum"),
        hs: num(rec.get("hs")),
        as: num(rec.get("as")),
        score: rec.get("score"),
      }));

      // 3. Bragging-rights-keten (easter egg): A -> ... -> B via BEAT
      let keten = null;
      try {
        const k = await session.run(
          `
          MATCH p = shortestPath((s:Country)-[:BEAT*1..4]->(t:Country))
          WHERE s.name IN $A AND t.name IN $B
          RETURN [n IN nodes(p) | n.name] AS keten LIMIT 1
          `,
          { A, B }
        );
        if (k.records.length) keten = k.records[0].get("keten");
      } catch (e) {
        /* keten is optioneel */
      }

      return Response.json({ a, b, aWins, bWins, draws, totaal: aWins + bWins + draws, laatste, keten });
    } finally {
      await session.close();
    }
  } catch (e) {
    return Response.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
