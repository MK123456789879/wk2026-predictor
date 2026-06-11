'use client';
// WK 2026 Predictor — Next.js client component
import React, { useState, useMemo, useEffect } from "react";
import Papa from "papaparse";
import { Sparkles, ClipboardCopy, Check, Trophy, ListChecks, GitFork, BarChart3, X, Trash2 } from "lucide-react";

/* ===== groepen (Engelse dataset-schrijfwijze) ===== */
const GROEPEN = {
  A: ["Mexico","South Africa","South Korea","Czech Republic"], B: ["Canada","Bosnia and Herzegovina","Qatar","Switzerland"],
  C: ["Brazil","Morocco","Haiti","Scotland"], D: ["United States","Paraguay","Australia","Turkey"],
  E: ["Germany","Curacao","Ivory Coast","Ecuador"], F: ["Netherlands","Japan","Sweden","Tunisia"],
  G: ["Belgium","Egypt","Iran","New Zealand"], H: ["Spain","Cape Verde","Saudi Arabia","Uruguay"],
  I: ["France","Senegal","Iraq","Norway"], J: ["Argentina","Algeria","Austria","Jordan"],
  K: ["Portugal","DR Congo","Uzbekistan","Colombia"], L: ["England","Croatia","Ghana","Panama"],
};
const LETTERS = Object.keys(GROEPEN);
const FLAG = { "Mexico":"mx","South Africa":"za","South Korea":"kr","Czech Republic":"cz","Canada":"ca","Bosnia and Herzegovina":"ba","Qatar":"qa","Switzerland":"ch","Brazil":"br","Morocco":"ma","Haiti":"ht","Scotland":"gb-sct","United States":"us","Paraguay":"py","Australia":"au","Turkey":"tr","Germany":"de","Curacao":"cw","Ivory Coast":"ci","Ecuador":"ec","Netherlands":"nl","Japan":"jp","Sweden":"se","Tunisia":"tn","Belgium":"be","Egypt":"eg","Iran":"ir","New Zealand":"nz","Spain":"es","Cape Verde":"cv","Saudi Arabia":"sa","Uruguay":"uy","France":"fr","Senegal":"sn","Iraq":"iq","Norway":"no","Argentina":"ar","Algeria":"dz","Austria":"at","Jordan":"jo","Portugal":"pt","DR Congo":"cd","Uzbekistan":"uz","Colombia":"co","England":"gb-eng","Croatia":"hr","Ghana":"gh","Panama":"pa" };

const GROEP_MATCHES = [
  [1,"A","Mexico","South Africa"],[2,"A","South Korea","Czech Republic"],[3,"B","Canada","Bosnia and Herzegovina"],[4,"D","United States","Paraguay"],[5,"B","Qatar","Switzerland"],[6,"C","Brazil","Morocco"],[7,"C","Haiti","Scotland"],[8,"D","Australia","Turkey"],[9,"E","Germany","Curacao"],[10,"F","Netherlands","Japan"],[11,"E","Ivory Coast","Ecuador"],[12,"F","Sweden","Tunisia"],[13,"H","Spain","Cape Verde"],[14,"G","Belgium","Egypt"],[15,"H","Saudi Arabia","Uruguay"],[16,"G","Iran","New Zealand"],[17,"I","France","Senegal"],[18,"I","Iraq","Norway"],[19,"J","Argentina","Algeria"],[20,"J","Austria","Jordan"],[21,"K","Portugal","DR Congo"],[22,"L","England","Croatia"],[23,"L","Ghana","Panama"],[24,"K","Uzbekistan","Colombia"],
  [25,"A","Czech Republic","South Africa"],[26,"B","Switzerland","Bosnia and Herzegovina"],[27,"B","Canada","Qatar"],[28,"A","Mexico","South Korea"],[29,"D","United States","Australia"],[30,"C","Scotland","Morocco"],[31,"C","Brazil","Haiti"],[32,"D","Turkey","Paraguay"],[33,"F","Netherlands","Sweden"],[34,"E","Germany","Ivory Coast"],[35,"E","Ecuador","Curacao"],[36,"F","Tunisia","Japan"],[37,"H","Spain","Saudi Arabia"],[38,"G","Belgium","Iran"],[39,"H","Uruguay","Cape Verde"],[40,"G","New Zealand","Egypt"],[41,"J","Argentina","Austria"],[42,"I","France","Iraq"],[43,"I","Norway","Senegal"],[44,"J","Jordan","Algeria"],[45,"K","Portugal","Uzbekistan"],[46,"L","England","Ghana"],[47,"L","Panama","Croatia"],[48,"K","Colombia","DR Congo"],
  [49,"B","Switzerland","Canada"],[50,"B","Bosnia and Herzegovina","Qatar"],[51,"C","Morocco","Haiti"],[52,"C","Scotland","Brazil"],[53,"A","South Africa","South Korea"],[54,"A","Czech Republic","Mexico"],[55,"E","Curacao","Ivory Coast"],[56,"E","Ecuador","Germany"],[57,"F","Japan","Sweden"],[58,"F","Tunisia","Netherlands"],[59,"D","Paraguay","Australia"],[60,"D","Turkey","United States"],[61,"I","Norway","France"],[62,"I","Senegal","Iraq"],[63,"H","Cape Verde","Saudi Arabia"],[64,"H","Uruguay","Spain"],[65,"G","Egypt","Iran"],[66,"G","New Zealand","Belgium"],[67,"L","Croatia","Ghana"],[68,"L","Panama","England"],[69,"K","Colombia","Portugal"],[70,"K","DR Congo","Uzbekistan"],[71,"J","Algeria","Austria"],[72,"J","Jordan","Argentina"],
];
const W=(g)=>({k:"W",g}),R=(g)=>({k:"R",g}),D=(g)=>({k:"D",g}),WD=(n)=>({k:"WD",n}),LD=(n)=>({k:"LD",n});
const KO_MATCHES = [
  {nr:73,ronde:"Zestiende finales",a:R("A"),b:R("B")},{nr:74,ronde:"Zestiende finales",a:W("C"),b:R("F")},{nr:75,ronde:"Zestiende finales",a:W("E"),b:D(["A","B","C","D","F"])},{nr:76,ronde:"Zestiende finales",a:W("F"),b:R("C")},{nr:77,ronde:"Zestiende finales",a:R("E"),b:R("I")},{nr:78,ronde:"Zestiende finales",a:W("I"),b:D(["C","D","F","G","H"])},{nr:79,ronde:"Zestiende finales",a:W("A"),b:D(["C","E","F","H","I"])},{nr:80,ronde:"Zestiende finales",a:W("L"),b:D(["E","H","I","J","K"])},{nr:81,ronde:"Zestiende finales",a:W("G"),b:D(["A","E","H","I","J"])},{nr:82,ronde:"Zestiende finales",a:W("D"),b:D(["B","E","F","I","J"])},{nr:83,ronde:"Zestiende finales",a:W("H"),b:R("J")},{nr:84,ronde:"Zestiende finales",a:R("K"),b:R("L")},{nr:85,ronde:"Zestiende finales",a:W("B"),b:D(["E","F","G","I","J"])},{nr:86,ronde:"Zestiende finales",a:R("D"),b:R("G")},{nr:87,ronde:"Zestiende finales",a:W("J"),b:R("H")},{nr:88,ronde:"Zestiende finales",a:W("K"),b:D(["D","E","I","J","L"])},
  {nr:89,ronde:"Achtste finales",a:WD(73),b:WD(75)},{nr:90,ronde:"Achtste finales",a:WD(74),b:WD(77)},{nr:91,ronde:"Achtste finales",a:WD(76),b:WD(78)},{nr:92,ronde:"Achtste finales",a:WD(79),b:WD(80)},{nr:93,ronde:"Achtste finales",a:WD(83),b:WD(84)},{nr:94,ronde:"Achtste finales",a:WD(81),b:WD(82)},{nr:95,ronde:"Achtste finales",a:WD(86),b:WD(88)},{nr:96,ronde:"Achtste finales",a:WD(85),b:WD(87)},
  {nr:97,ronde:"Kwartfinales",a:WD(89),b:WD(90)},{nr:98,ronde:"Kwartfinales",a:WD(93),b:WD(94)},{nr:99,ronde:"Kwartfinales",a:WD(91),b:WD(92)},{nr:100,ronde:"Kwartfinales",a:WD(95),b:WD(96)},
  {nr:101,ronde:"Halve finales",a:WD(97),b:WD(98)},{nr:102,ronde:"Halve finales",a:WD(99),b:WD(100)},
  {nr:103,ronde:"Troostfinale",a:LD(101),b:LD(102)},{nr:104,ronde:"Finale",a:WD(101),b:WD(102)},
];
const KO_RONDES = ["Zestiende finales","Achtste finales","Kwartfinales","Halve finales","Troostfinale","Finale"];

/* ===== CSV + model ===== */
function herstelMoji(s){ if(s && s.indexOf("Ã")>=0){ try{ return decodeURIComponent(escape(s)); }catch(e){ return s; } } return s; }
function schoon(t){ t=t.replace(/^\uFEFF/,""); return t.split(/\r?\n/).map((r)=>{ r=r.trim(); if(r.startsWith('"')&&r.endsWith('"')&&r.length>1)r=r.slice(1,-1); return r.replace(/""/g,'"'); }).join("\n"); }
const ALIAS={date:["date","datum"],home_team:["home_team","home","thuis"],away_team:["away_team","away","uit"],home_score:["home_score","homescore","thuisscore"],away_score:["away_score","awayscore","uitscore"],tournament:["tournament","toernooi"],neutral:["neutral","neutraal"]};
function kmap(v){const n={};v.forEach((x)=>(n[x.toLowerCase().trim()]=x));const m={};for(const[d,al]of Object.entries(ALIAS))for(const a of al)if(n[a]){m[d]=n[a];break;}return m;}
function isScore(w){if(w==null)return false;const s=String(w).trim();return s!==""&&Number.isFinite(Number(s));}
function parse(t){const res=Papa.parse(schoon(t),{header:true,skipEmptyLines:true});const m=kmap(res.meta.fields||[]);const rijen=res.data.map((r)=>{const ds=m.date?r[m.date]:"";const d=ds?new Date(ds):null;return{datum:d&&!isNaN(d)?d:null,thuis:herstelMoji(m.home_team?String(r[m.home_team]??"").trim():""),uit:herstelMoji(m.away_team?String(r[m.away_team]??"").trim():""),thuisScore:m.home_score?r[m.home_score]:"",uitScore:m.away_score?r[m.away_score]:"",toernooi:m.tournament?String(r[m.tournament]??"").trim():"",neutraal:m.neutral?(String(r[m.neutral]??"").toLowerCase().startsWith("t")||String(r[m.neutral]??"")==="1"):false};}).filter((r)=>r.thuis&&r.uit);return{rijen,m};}
function norm(s){return s.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z]/g,"");}
const ALIASES={turkey:["turkiye"],southkorea:["koreareplic","korearepublic","korea","republicofkorea"],unitedstates:["usa","unitedstatesofamerica"],drcongo:["congodr","democraticrepublicofthecongo","congokinshasa"],ivorycoast:["cotedivoire"],capeverde:["capeverdeislands","caboverde"],bosniaandherzegovina:["bosniaherzegovina","bosnia"]};
function fac(n){let f=1;for(let i=2;i<=n;i++)f*=i;return f;}
function pmf(k,l){return l<=0?(k===0?1:0):(Math.exp(-l)*l**k)/fac(k);}
const MG=8;
function cgew(t,w){t=(t||"").toLowerCase();if(!w)return 1;if(t.includes("friendly"))return .5;if(t.includes("qualif"))return 1;if(["world cup","euro","copa","nations","asian cup","african"].some((k)=>t.includes(k)))return 1.3;return 1;}
function bouwModel(train,{halvering,weeg}){const nu=Date.now(),T={};let tg=0,tw=0,nt=0,nu_=0,nw=0;for(const r of train){if(!isScore(r.thuisScore)||!isScore(r.uitScore))continue;const hs=+r.thuisScore,as=+r.uitScore;let w=cgew(r.toernooi,weeg);if(r.datum){const lj=(nu-r.datum.getTime())/(365.25*864e5);if(lj>=0)w*=.5**(lj/halvering);}if(w<=0)continue;for(const t of[r.thuis,r.uit])if(!T[t])T[t]={w:0,vo:0,te:0};T[r.thuis].w+=w;T[r.thuis].vo+=w*hs;T[r.thuis].te+=w*as;T[r.uit].w+=w;T[r.uit].vo+=w*as;T[r.uit].te+=w*hs;tg+=w*(hs+as);tw+=w*2;if(!r.neutraal){nt+=w*hs;nu_+=w*as;nw+=w;}}const league=tw>0?tg/tw:1.3;let thuisv=1.1;if(nw>0&&nu_>0)thuisv=Math.min(1.4,Math.max(1,Math.sqrt((nt/nw)/(nu_/nw))));const rating={},normIdx={};for(const[t,d]of Object.entries(T))rating[t]={aanval:d.w>0?d.vo/d.w:league,verdediging:d.w>0?d.te/d.w:league};Object.keys(rating).forEach((k)=>(normIdx[norm(k)]=k));return{rating,normIdx,league,thuisv};}
function getRating(model,team){if(!model)return null;if(model.rating[team])return model.rating[team];const n=norm(team);if(model.normIdx[n])return model.rating[model.normIdx[n]];for(const[canon,vars]of Object.entries(ALIASES)){if(canon===n||vars.includes(n)){if(model.normIdx[canon])return model.rating[model.normIdx[canon]];for(const v of vars)if(model.normIdx[v])return model.rating[model.normIdx[v]];}}return null;}
function voorspel(model,A,B){const league=model.league;const ra=getRating(model,A)||{aanval:league,verdediging:league};const rb=getRating(model,B)||{aanval:league,verdediging:league};let xa=Math.max(.05,(ra.aanval*rb.verdediging)/league),xb=Math.max(.05,(rb.aanval*ra.verdediging)/league);let pa=0,pg=0,pb=0,best=0,sc=[0,0];const a=[],b=[];for(let i=0;i<=MG;i++){a.push(pmf(i,xa));b.push(pmf(i,xb));}for(let i=0;i<=MG;i++)for(let j=0;j<=MG;j++){const p=a[i]*b[j];if(i>j)pa+=p;else if(i===j)pg+=p;else pb+=p;if(p>best){best=p;sc=[i,j];}}const s=pa+pg+pb||1;return{xa,xb,pa:pa/s,pg:pg/s,pb:pb/s,sa:sc[0],sb:sc[1],bekend:!!getRating(model,A)&&!!getRating(model,B)};}
function vorm(train,team,n=6){const ms=train.filter((r)=>(r.thuis===team||r.uit===team)&&isScore(r.thuisScore)&&isScore(r.uitScore)).sort((x,y)=>(y.datum?.getTime()||0)-(x.datum?.getTime()||0)).slice(0,n);let w=0,g=0,l=0,gf=0,ga=0;for(const r of ms){const vo=r.thuis===team?+r.thuisScore:+r.uitScore,te=r.thuis===team?+r.uitScore:+r.thuisScore;gf+=vo;ga+=te;if(vo>te)w++;else if(vo===te)g++;else l++;}return `${w}W-${g}G-${l}V (${gf}-${ga})`;}
const cmpStand=(x,y)=>y.pt-x.pt||y.gs-x.gs||y.gv-x.gv;
function matchThirds(slots,thirds){const matchTo=Array(thirds.length).fill(-1);function tryS(s,seen){for(let t=0;t<thirds.length;t++){if(slots[s].allowed.has(thirds[t].groep)&&!seen[t]){seen[t]=true;if(matchTo[t]===-1||tryS(matchTo[t],seen)){matchTo[t]=s;return true;}}}return false;}for(let s=0;s<slots.length;s++)tryS(s,Array(thirds.length).fill(false));const r={};matchTo.forEach((s,t)=>{if(s!==-1)r[s]=t;});return r;}
const roundOf=(nr)=>(nr<=24?1:nr<=48?2:3);
const odds=(p)=>(p>0?Math.max(1.01,1/p):99).toFixed(2);
async function vraagClaude(sys, user, maxTokens = 1000) {
  const resp = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ system: sys, user, max_tokens: maxTokens }) });
  if (!resp.ok) { let m = "status " + resp.status; try { m = (await resp.json()).error || m; } catch {} throw new Error(m); }
  const data = await resp.json();
  return data.text || "";
}
function parseJsonArray(txt){const s=txt.replace(/```json|```/g,"").trim();try{return JSON.parse(s);}catch{return JSON.parse(s.slice(s.indexOf("["),s.lastIndexOf("]")+1));}}

/* ===== styling (bookmaker) ===== */
const css=`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
.bk{--bg:#0a0e12;--s:#121821;--s2:#19212c;--ln:#26313f;--tx:#eef2f6;--mut:#8b97a5;--gr:#16c66a;--grd:#0f7a42;--gel:#f2b53a;--ver:#ee6352;background:var(--bg);color:var(--tx);font-family:'Inter',system-ui,sans-serif;min-height:100vh;}
.bk *{box-sizing:border-box;}
.wrap{max-width:780px;margin:0 auto;padding:0 14px 110px;}
.top{position:sticky;top:0;z-index:30;background:rgba(10,14,18,.92);backdrop-filter:blur(8px);border-bottom:1px solid var(--ln);margin:0 -14px;padding:12px 14px;}
.brand{display:flex;align-items:center;gap:9px;font-weight:800;font-size:18px;letter-spacing:-.02em;}
.brand .dot{width:9px;height:9px;border-radius:50%;background:var(--gr);box-shadow:0 0 12px var(--gr);}
.dash{display:flex;gap:8px;margin-top:10px;}
.kpi{flex:1;background:var(--s);border:1px solid var(--ln);border-radius:11px;padding:9px 11px;}
.kpi .lab{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--mut);margin-bottom:3px;}
.kpi .val{font-weight:700;font-size:15px;display:flex;align-items:center;gap:6px;}
.kpi .val.gr{color:var(--gr);}
.progress{height:5px;background:#0c1118;border-radius:4px;margin-top:7px;overflow:hidden;}
.progress i{display:block;height:100%;background:var(--gr);}
.tabs{display:flex;gap:6px;margin:14px 0;}
.tab{flex:1;display:inline-flex;justify-content:center;align-items:center;gap:6px;padding:10px;border-radius:11px;border:1px solid var(--ln);background:var(--s);color:var(--mut);font-size:13px;font-weight:600;cursor:pointer;}
.tab.on{background:var(--gr);color:#04130a;border-color:var(--gr);}
.subtabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;}
.subtab{padding:7px 13px;border-radius:9px;border:1px solid var(--ln);background:var(--s);color:var(--mut);font-size:12px;font-weight:600;cursor:pointer;}
.subtab.on{color:var(--gr);border-color:var(--gr);background:var(--s2);}
.gkop{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--mut);margin:18px 0 8px;display:flex;align-items:center;gap:8px;}
.gkop::before{content:'';width:14px;height:2px;background:var(--gr);}
.fx{background:var(--s);border:1px solid var(--ln);border-radius:13px;padding:12px;margin-bottom:9px;}
.fx-top{display:flex;justify-content:space-between;font-size:10px;color:var(--mut);font-family:'Space Mono',monospace;text-transform:uppercase;letter-spacing:.05em;margin-bottom:9px;}
.tm{display:flex;align-items:center;gap:9px;justify-content:space-between;}
.side{display:flex;align-items:center;gap:8px;min-width:0;flex:1;}
.side.r{flex-direction:row-reverse;text-align:right;}
.flag{width:24px;height:18px;border-radius:3px;object-fit:cover;flex-shrink:0;background:#222;}
.nm{font-weight:700;font-size:15px;line-height:1.1;}
.nm.win{color:var(--gr);}
.scbox{display:flex;align-items:center;gap:6px;flex-shrink:0;}
.sc{width:40px;height:44px;text-align:center;font-family:'Space Mono',monospace;font-weight:700;font-size:22px;background:#0c1118;color:var(--tx);border:1px solid var(--ln);border-radius:8px;outline:none;}
.sc:focus{border-color:var(--gr);}.sc.ed{color:var(--gr);border-color:var(--grd);}
.kos{font-family:'Space Mono',monospace;font-weight:700;font-size:20px;min-width:48px;text-align:center;}
.odds{display:flex;gap:6px;margin-top:11px;}
.odd{flex:1;background:#0c1118;border:1px solid var(--ln);border-radius:9px;padding:7px 4px;text-align:center;cursor:pointer;transition:.12s;}
.odd:hover{border-color:var(--mut);}
.odd.on{background:var(--gr);border-color:var(--gr);}
.odd .o-l{font-size:10px;color:var(--mut);font-weight:700;}
.odd.on .o-l{color:#04130a;}
.odd .o-v{font-family:'Space Mono',monospace;font-weight:700;font-size:14px;margin-top:1px;}
.odd.on .o-v{color:#04130a;}
.ai{margin-top:10px;padding:9px 11px;border-radius:9px;background:var(--s2);border:1px solid var(--ln);font-size:13px;display:flex;gap:8px;align-items:flex-start;color:var(--tx);}
.ai .adv{font-family:'Space Mono',monospace;color:var(--gr);font-weight:700;}
.unk{color:var(--ver);font-size:11px;font-family:'Space Mono',monospace;}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;background:var(--s);border:1px solid var(--ln);color:var(--tx);border-radius:10px;padding:10px 14px;font-size:13px;font-weight:600;cursor:pointer;}
.btn:hover{border-color:var(--gr);}.btn:disabled{opacity:.5;}
.btn.gr{background:var(--gr);color:#04130a;border-color:var(--gr);}
.btn.ai-b{border-color:var(--grd);color:var(--gr);}
.row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:12px;}
.card{background:var(--s);border:1px solid var(--ln);border-radius:13px;padding:15px;margin-bottom:13px;}
.lbl{font-size:13px;color:var(--mut);margin:0 0 6px;}
textarea.paste{width:100%;background:#0c1118;border:1px solid var(--ln);border-radius:10px;color:var(--tx);font-family:'Space Mono',monospace;font-size:12px;padding:10px;min-height:92px;resize:vertical;outline:none;}
textarea.paste:focus{border-color:var(--gr);}
.ctrl{font-size:13px;color:var(--mut);display:flex;justify-content:space-between;margin-bottom:6px;}
.ctrl b{color:var(--tx);font-family:'Space Mono',monospace;}
input[type=range]{width:100%;accent-color:var(--gr);}
.chk{display:flex;align-items:center;gap:10px;font-size:14px;cursor:pointer;margin-top:10px;}
.chk input{width:18px;height:18px;accent-color:var(--gr);}
.note{display:flex;gap:8px;align-items:flex-start;color:var(--mut);font-size:12px;background:var(--s);border:1px solid var(--ln);border-radius:10px;padding:10px 12px;margin-top:8px;}
.sv{background:linear-gradient(135deg,#15212a,#121821);border:1px solid var(--grd);border-radius:12px;padding:13px;margin-bottom:13px;font-size:14px;line-height:1.5;}
.sv .k{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--gr);margin:0 0 6px;display:flex;align-items:center;gap:7px;font-weight:700;}
.tabel{width:100%;border-collapse:collapse;font-size:13px;}
.tabel th{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--mut);text-align:right;padding:6px 7px;border-bottom:1px solid var(--ln);}
.tabel th.l,.tabel td.l{text-align:left;}
.tabel td{padding:7px;border-bottom:1px solid #161d26;font-family:'Space Mono',monospace;}
.tabel td.nm2{font-family:'Inter';font-weight:600;}
.tabel tr.q td.nm2{color:var(--gr);}.tabel tr.q3 td.nm2{color:var(--gel);}.tabel tr.out td{color:var(--mut);}
.brk{display:flex;gap:12px;overflow-x:auto;padding-bottom:10px;}
.brk-col{min-width:172px;flex-shrink:0;}
.brk-col h4{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--mut);margin:0 0 8px;}
.brk-m{background:var(--s);border:1px solid var(--ln);border-radius:9px;padding:8px;margin-bottom:8px;}
.brk-r{display:flex;align-items:center;gap:6px;padding:2px 0;font-size:12px;}
.brk-r.win{font-weight:700;color:var(--gr);}
.brk-r .f{width:18px;height:13px;border-radius:2px;object-fit:cover;}
.brk-r .s{margin-left:auto;font-family:'Space Mono',monospace;font-size:11px;color:var(--mut);}
.champ{background:linear-gradient(135deg,var(--grd),#0a0e12);border:1px solid var(--gr);border-radius:13px;padding:16px;margin-bottom:14px;display:flex;align-items:center;gap:14px;}
.champ .f{width:44px;height:33px;border-radius:4px;object-fit:cover;}
.champ .t{font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--gr);font-weight:700;}
.champ .n{font-size:24px;font-weight:800;}
.empty{text-align:center;color:var(--mut);padding:36px 16px;font-size:14px;}
/* invulstaat drawer */
.slipbtn{position:fixed;bottom:18px;left:50%;transform:translateX(-50%);z-index:40;background:var(--gr);color:#04130a;border:none;border-radius:30px;padding:13px 22px;font-weight:700;font-size:14px;box-shadow:0 6px 24px rgba(0,0,0,.5);cursor:pointer;display:flex;align-items:center;gap:8px;}
.drawer{position:fixed;inset:0;z-index:50;background:rgba(0,0,0,.55);display:flex;align-items:flex-end;}
.sheet{background:var(--s);border-top:1px solid var(--ln);border-radius:18px 18px 0 0;width:100%;max-width:780px;margin:0 auto;max-height:80vh;overflow-y:auto;padding:16px 16px 30px;}
.sheet h3{margin:0 0 4px;font-size:17px;}
.slip-row{display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid #161d26;font-size:13px;}
.slip-row .s{margin-left:auto;font-family:'Space Mono',monospace;font-weight:700;color:var(--gr);}
`;

function Flag({ name, cls }) {
  const iso = FLAG[name];
  if (!iso) return <span className={"flag " + (cls || "")} style={{ display: "inline-block" }} />;
  return <img className={"flag " + (cls || "")} src={`https://flagcdn.com/w40/${iso}.png`} alt="" onError={(e) => (e.target.style.visibility = "hidden")} />;
}

export default function WK() {
  const [histTekst, setHistTekst] = useState("");
  const [historie, setHistorie] = useState([]);
  const [fout, setFout] = useState("");
  const [halvering, setHalvering] = useState(2);
  const [weeg, setWeeg] = useState(true);
  const [tab, setTab] = useState("wedstrijden");
  const [ronde, setRonde] = useState(1);
  const [koRonde, setKoRonde] = useState(0);
  const [overrides, setOverrides] = useState({});
  const [ai, setAi] = useState({});
  const [sv, setSv] = useState({});
  const [busy, setBusy] = useState("");
  const [aiFout, setAiFout] = useState("");
  const [slip, setSlip] = useState(false);
  const [kopOk, setKopOk] = useState(false);
  const [laadt, setLaadt] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/resultsfifa.csv");
        if (r.ok) { const t = await r.text(); const h = parse(t); if (h.m.home_team && h.m.away_team) setHistorie(h.rijen); }
      } catch (e) { /* val terug op handmatig plakken */ }
      setLaadt(false);
    })();
  }, []);

  function verwerk() {
    setFout("");
    if (!histTekst.trim()) { setFout("Plak eerst je historische uitslagen."); return; }
    try { const h = parse(histTekst); if (!h.m.home_team || !h.m.away_team) { setFout("Geen thuis/uit-kolommen herkend."); return; } setHistorie(h.rijen); }
    catch (e) { setFout("Kon de data niet lezen: " + e.message); }
  }
  const train = useMemo(() => historie.filter((r) => isScore(r.thuisScore) && isScore(r.uitScore)), [historie]);
  const model = useMemo(() => (train.length ? bouwModel(train, { halvering, weeg }) : null), [train, halvering, weeg]);
  const groepMatches = useMemo(() => (model ? GROEP_MATCHES.map(([nr, g, A, B]) => ({ nr, groep: g, A, B, key: "G|" + nr, ...voorspel(model, A, B) })) : []), [model]);
  const byNr = useMemo(() => { const m = {}; groepMatches.forEach((p) => (m[p.nr] = p)); return m; }, [groepMatches]);

  const scoreVan = (nr, sa, sb) => { const ov = overrides[nr]; return [ov?.a ?? sa, ov?.b ?? sb]; };
  function zet(nr, kant, w) { const n = w === "" ? undefined : Math.max(0, Math.min(20, parseInt(w, 10) || 0)); setOverrides((o) => ({ ...o, [nr]: { ...o[nr], [kant]: n } })); }
  function kiesUitkomst(p, soort) {
    let a, b;
    if (soort === "1") [a, b] = p.sa > p.sb ? [p.sa, p.sb] : [1, 0];
    else if (soort === "X") [a, b] = p.sa === p.sb ? [p.sa, p.sb] : [1, 1];
    else [a, b] = p.sb > p.sa ? [p.sa, p.sb] : [0, 1];
    setOverrides((o) => ({ ...o, [p.nr]: { a, b } }));
  }

  function standingsNa(maxR) {
    const st = {}; LETTERS.forEach((g) => { st[g] = {}; GROEPEN[g].forEach((t) => (st[g][t] = { team: t, pt: 0, gv: 0, gt: 0, gs: 0 })); });
    groepMatches.forEach((p) => { if (roundOf(p.nr) > maxR) return; const [a, b] = scoreVan(p.nr, p.sa, p.sb), g = p.groep; if (!st[g][p.A] || !st[g][p.B]) return; st[g][p.A].gv += a; st[g][p.A].gt += b; st[g][p.A].gs += a - b; st[g][p.B].gv += b; st[g][p.B].gt += a; st[g][p.B].gs += b - a; if (a > b) st[g][p.A].pt += 3; else if (a < b) st[g][p.B].pt += 3; else { st[g][p.A].pt++; st[g][p.B].pt++; } });
    const out = {}; LETTERS.forEach((g) => (out[g] = Object.values(st[g]).sort(cmpStand))); return out;
  }
  const standingsFinal = useMemo(() => standingsNa(3), [groepMatches, overrides]);

  const knockout = useMemo(() => {
    if (!model || !groepMatches.length) return null; const st = standingsFinal; const Wn = {}, Rn = {}, thirds = [];
    for (const g of LETTERS) { if (!st[g] || st[g].length < 3) return null; Wn[g] = st[g][0]; Rn[g] = st[g][1]; thirds.push({ ...st[g][2], groep: g }); }
    const beste = [...thirds].sort(cmpStand).slice(0, 8);
    const slotDefs = KO_MATCHES.filter((m) => m.a.k === "D" || m.b.k === "D").map((m) => { const d = m.a.k === "D" ? m.a : m.b; return { nr: m.nr, allowed: new Set(d.g) }; });
    const s2t = matchThirds(slotDefs, beste); const toe = {}, gebr = new Set();
    slotDefs.forEach((sl, i) => { const ti = s2t[i]; if (ti != null) { toe[sl.nr] = beste[ti].team; gebr.add(beste[ti].team); } });
    let rest = beste.filter((t) => !gebr.has(t.team)); slotDefs.forEach((sl) => { if (!toe[sl.nr] && rest.length) toe[sl.nr] = rest.shift().team; });
    const res = {}; const rs = (ref, nr) => ref.k === "W" ? Wn[ref.g]?.team : ref.k === "R" ? Rn[ref.g]?.team : ref.k === "D" ? toe[nr] : ref.k === "WD" ? res[ref.n]?.winnaar : res[ref.n]?.verliezer;
    for (const m of KO_MATCHES) { const A = rs(m.a, m.nr), B = rs(m.b, m.nr); if (!A || !B) { res[m.nr] = { nr: m.nr, ronde: m.ronde, A, B, key: "KO|" + m.nr, onbekend: true }; continue; } const v = voorspel(model, A, B); const winnaar = v.pa >= v.pb ? A : B, verliezer = v.pa >= v.pb ? B : A; res[m.nr] = { nr: m.nr, ronde: m.ronde, A, B, key: "KO|" + m.nr, ...v, winnaar, verliezer }; }
    return { res, kampioen: res[104]?.winnaar };
  }, [model, groepMatches, standingsFinal]);

  async function onderbouwRonde(matches, roundKey, context) {
    setBusy(roundKey); setAiFout("");
    const sys = "Je bent een nuchtere voetbalanalist. Per wedstrijd krijg je een Poisson-basisvoorspelling en de recente vorm. Geef een definitieve uitslag (verfijn alleen bij duidelijke reden) en een onderbouwing van max 16 woorden in het Nederlands. Baseer je op de cijfers en algemene voetbalkennis; verzin GEEN actuele blessures. Antwoord UITSLUITEND met JSON-array van {\"key\":string,\"thuis\":int,\"uit\":int,\"reden\":string}.";
    const nieuw = { ...ai };
    try {
      const g = matches.filter((p) => !p.onbekend);
      for (let i = 0; i < g.length; i += 8) {
        const grp = g.slice(i, i + 8).map((p) => ({ key: p.key, wedstrijd: `${p.A} - ${p.B}`, basis: `${p.sa}-${p.sb}`, kansen: `${Math.round(p.pa * 100)}/${Math.round(p.pg * 100)}/${Math.round(p.pb * 100)}`, vorm_thuis: vorm(train, p.A), vorm_uit: vorm(train, p.B) }));
        const txt = await vraagClaude(sys, "Wedstrijden:\n" + JSON.stringify(grp));
        for (const it of parseJsonArray(txt)) if (it && it.key !== undefined) nieuw[it.key] = { t: +it.thuis, u: +it.uit, reden: String(it.reden || "") };
        setAi({ ...nieuw });
      }
      const lijst = g.map((p) => `${p.A}-${p.B}: ${p.sa}-${p.sb}`).join("; ");
      const s = await vraagClaude("Voetbalanalist. Schrijf in het Nederlands een korte samenvatting (max 70 woorden) van deze ronde: wat valt op en welke verrassing is mogelijk. Vlot stukje, geen opsomming.", `${context}\nVoorspeld: ${lijst}`, 400);
      setSv((x) => ({ ...x, [roundKey]: s.trim() }));
    } catch (e) { setAiFout("AI-aanroep mislukt: " + e.message); }
    setBusy("");
  }
  function gebruikAi(nr) { const a = ai["G|" + nr]; if (a) setOverrides((o) => ({ ...o, [nr]: { a: a.t, b: a.u } })); }

  const keuzes = Object.keys(overrides).length;
  function csv() {
    const rows = [];
    groepMatches.forEach((p) => { const [a, b] = scoreVan(p.nr, p.sa, p.sb); rows.push({ duel: p.nr, fase: `Groep ${p.groep} ronde ${roundOf(p.nr)}`, thuis: p.A, uit: p.B, voorspelling: `${a}-${b}`, ai: ai[p.key]?.reden || "" }); });
    if (knockout) KO_MATCHES.forEach((m) => { const r = knockout.res[m.nr]; if (r && !r.onbekend) rows.push({ duel: m.nr, fase: m.ronde, thuis: r.A, uit: r.B, voorspelling: `${r.sa}-${r.sb}`, winnaar: r.winnaar, ai: ai[r.key]?.reden || "" }); });
    return Papa.unparse(rows);
  }
  async function kopieer() { try { await navigator.clipboard.writeText(csv()); setKopOk(true); setTimeout(() => setKopOk(false), 1500); } catch {} }

  function Fixture({ p }) {
    const [sa, sb] = scoreVan(p.nr, p.sa, p.sb);
    const ed = overrides[p.nr] && (overrides[p.nr].a !== undefined || overrides[p.nr].b !== undefined);
    const uit = sa > sb ? "1" : sa === sb ? "X" : "2";
    const a = ai[p.key];
    return (
      <div className="fx">
        <div className="fx-top"><span>Duel {p.nr}</span><span>Groep {p.groep}</span></div>
        <div className="tm">
          <div className="side"><Flag name={p.A} /><span className="nm">{p.A}</span></div>
          <div className="scbox">
            <input className={"sc" + (ed ? " ed" : "")} type="number" min="0" value={sa} onChange={(e) => zet(p.nr, "a", e.target.value)} />
            <input className={"sc" + (ed ? " ed" : "")} type="number" min="0" value={sb} onChange={(e) => zet(p.nr, "b", e.target.value)} />
          </div>
          <div className="side r"><Flag name={p.B} /><span className="nm">{p.B}</span></div>
        </div>
        <div className="odds">
          <div className={"odd" + (uit === "1" ? " on" : "")} onClick={() => kiesUitkomst(p, "1")}><div className="o-l">1</div><div className="o-v">{odds(p.pa)}</div></div>
          <div className={"odd" + (uit === "X" ? " on" : "")} onClick={() => kiesUitkomst(p, "X")}><div className="o-l">X</div><div className="o-v">{odds(p.pg)}</div></div>
          <div className={"odd" + (uit === "2" ? " on" : "")} onClick={() => kiesUitkomst(p, "2")}><div className="o-l">2</div><div className="o-v">{odds(p.pb)}</div></div>
        </div>
        {!p.bekend && <div className="unk" style={{ marginTop: 6 }}>weinig historie — minder betrouwbaar</div>}
        {a && <div className="ai"><Sparkles size={15} color="#16c66a" style={{ flexShrink: 0, marginTop: 1 }} /><span><span className="adv">{a.t}–{a.u}</span> · {a.reden}</span><button className="btn" style={{ marginLeft: "auto", padding: "3px 9px", fontSize: 12 }} onClick={() => gebruikAi(p.nr)}>kies</button></div>}
      </div>
    );
  }

  function StandTabel({ rij }) {
    return (<table className="tabel"><thead><tr><th className="l">#</th><th className="l">Land</th><th>Pt</th><th>+/-</th></tr></thead><tbody>{rij.map((r, i) => (<tr key={r.team} className={i < 2 ? "q" : i === 2 ? "q3" : "out"}><td className="l">{i + 1}</td><td className="nm2 l"><Flag name={r.team} cls="" /> {r.team}</td><td>{r.pt}</td><td>{r.gs >= 0 ? "+" : ""}{r.gs}</td></tr>))}</tbody></table>);
  }

  return (
    <div className="bk">
      <style>{css}</style>
      <div className="wrap">
        <div className="top">
          <div className="brand"><span className="dot" /> WK 2026 · Predictor</div>
          {model && (
            <>
              <div className="dash">
                <div className="kpi"><div className="lab">Jouw keuzes</div><div className="val">{keuzes}<span style={{ color: "var(--mut)", fontWeight: 500, fontSize: 13 }}>/72</span></div><div className="progress"><i style={{ width: (keuzes / 72) * 100 + "%" }} /></div></div>
                <div className="kpi"><div className="lab">Voorspelde kampioen</div><div className="val gr"><Flag name={knockout?.kampioen} /> {knockout?.kampioen || "—"}</div></div>
              </div>
            </>
          )}
        </div>

        {!model && (
          <div className="card" style={{ marginTop: 14 }}>
            <p className="lbl">Plak je historische uitslagen (CSV met kopregel). Het hele speelschema zit al in de app.</p>
            <textarea className="paste" value={histTekst} onChange={(e) => setHistTekst(e.target.value)} placeholder={"date,home_team,away_team,home_score,away_score,tournament,neutral\n2025-09-06,Netherlands,Norway,2,1,FIFA World Cup qualification,False"} />
            <div className="row" style={{ marginTop: 12, marginBottom: 0 }}><button className="btn gr" onClick={verwerk}>Start</button></div>
            {fout && <div className="note" style={{ borderColor: "var(--ver)" }}><span>{fout}</span></div>}
          </div>
        )}

        {model && (
          <>
            <div className="tabs">
              <span className={"tab" + (tab === "wedstrijden" ? " on" : "")} onClick={() => setTab("wedstrijden")}><ListChecks size={15} /> Wedstrijden</span>
              <span className={"tab" + (tab === "bracket" ? " on" : "")} onClick={() => setTab("bracket")}><GitFork size={15} /> Bracket</span>
              <span className={"tab" + (tab === "inzicht" ? " on" : "")} onClick={() => setTab("inzicht")}><BarChart3 size={15} /> Inzicht</span>
            </div>
            {aiFout && <div className="note" style={{ borderColor: "var(--ver)", marginBottom: 12 }}><span>{aiFout}</span></div>}

            {tab === "wedstrijden" && (
              <>
                <div className="subtabs">{[1, 2, 3].map((md) => <span key={md} className={"subtab" + (ronde === md ? " on" : "")} onClick={() => setRonde(md)}>Ronde {md}</span>)}</div>
                {sv["G" + ronde] && <div className="sv"><p className="k"><Sparkles size={13} /> AI · speelronde {ronde}</p>{sv["G" + ronde]}</div>}
                <div className="row"><button className="btn ai-b" disabled={busy === "G" + ronde} onClick={() => onderbouwRonde(groepMatches.filter((p) => roundOf(p.nr) === ronde), "G" + ronde, `Groepsfase, speelronde ${ronde}.`)}><Sparkles size={15} /> {busy === "G" + ronde ? "AI bezig…" : "AI onderbouwt deze ronde"}</button></div>
                {LETTERS.map((g) => { const ms = groepMatches.filter((p) => p.groep === g && roundOf(p.nr) === ronde); return (<div key={g}><div className="gkop">Groep {g}</div>{ms.map((p) => <Fixture key={p.key} p={p} />)}</div>); })}
                <div className="gkop" style={{ marginTop: 22 }}>Tussenstand na ronde {ronde}</div>
                {LETTERS.map((g) => <div key={g} style={{ marginBottom: 10 }}><div style={{ fontSize: 13, fontWeight: 700, margin: "6px 0 4px" }}>Groep {g}</div><StandTabel rij={standingsNa(ronde)[g]} /></div>)}
              </>
            )}

            {tab === "bracket" && knockout && (
              <>
                <div className="champ"><Flag name={knockout.kampioen} cls="f" /><div><div className="t">Voorspelde wereldkampioen</div><div className="n">{knockout.kampioen || "—"}</div></div></div>
                <div className="subtabs">{KO_RONDES.map((r, i) => <span key={i} className={"subtab" + (koRonde === i ? " on" : "")} onClick={() => setKoRonde(i)}>{r}</span>)}</div>
                {sv["KO" + koRonde] && <div className="sv"><p className="k"><Sparkles size={13} /> AI · {KO_RONDES[koRonde]}</p>{sv["KO" + koRonde]}</div>}
                <div className="row"><button className="btn ai-b" disabled={busy === "KO" + koRonde} onClick={() => onderbouwRonde(KO_MATCHES.filter((m) => m.ronde === KO_RONDES[koRonde]).map((m) => knockout.res[m.nr]), "KO" + koRonde, `Knock-out, ${KO_RONDES[koRonde]}.`)}><Sparkles size={15} /> {busy === "KO" + koRonde ? "AI bezig…" : "AI onderbouwt deze ronde"}</button></div>
                {KO_MATCHES.filter((m) => m.ronde === KO_RONDES[koRonde]).map((m) => { const p = knockout.res[m.nr]; if (p.onbekend) return (<div className="fx" key={m.nr}><div className="fx-top"><span>Duel {m.nr}</span><span>{m.ronde}</span></div><div style={{ color: "var(--mut)", fontSize: 13 }}>Nog niet bepaald.</div></div>); const a = ai[p.key]; return (
                  <div className="fx" key={m.nr}>
                    <div className="fx-top"><span>Duel {m.nr}</span><span>{m.ronde}</span></div>
                    <div className="tm">
                      <div className="side"><Flag name={p.A} /><span className={"nm" + (p.winnaar === p.A ? " win" : "")}>{p.A}</span></div>
                      <div className="kos">{p.sa}–{p.sb}</div>
                      <div className="side r"><Flag name={p.B} /><span className={"nm" + (p.winnaar === p.B ? " win" : "")}>{p.B}</span></div>
                    </div>
                    <div className="odds"><div className={"odd" + (p.pa >= p.pb ? " on" : "")}><div className="o-l">1</div><div className="o-v">{odds(p.pa)}</div></div><div className="odd"><div className="o-l">X</div><div className="o-v">{odds(p.pg)}</div></div><div className={"odd" + (p.pb > p.pa ? " on" : "")}><div className="o-l">2</div><div className="o-v">{odds(p.pb)}</div></div></div>
                    {a && <div className="ai"><Sparkles size={15} color="#16c66a" style={{ flexShrink: 0, marginTop: 1 }} /><span><span className="adv">{a.t}–{a.u}</span> · {a.reden}</span></div>}
                  </div>
                ); })}
              </>
            )}

            {tab === "inzicht" && (
              <>
                <div className="card">
                  <div className="ctrl"><span>Recentheid (halveringstijd)</span><b>{halvering.toFixed(1)} jaar</b></div>
                  <input type="range" min="0.5" max="5" step="0.5" value={halvering} onChange={(e) => setHalvering(+e.target.value)} />
                  <label className="chk"><input type="checkbox" checked={weeg} onChange={(e) => setWeeg(e.target.checked)} />Vriendschappelijke wedstrijden lager wegen</label>
                </div>
                <div className="gkop">Krachtenlijst (uit je historie)</div>
                <table className="tabel"><thead><tr><th className="l">#</th><th className="l">Land</th><th>Aanval</th><th>Verded.</th><th>Net</th></tr></thead><tbody>
                  {LETTERS.flatMap((g) => GROEPEN[g]).map((t) => { const r = getRating(model, t); return { t, aan: r ? r.aanval : null, ver: r ? r.verdediging : null, net: r ? r.aanval - r.verdediging : -99 }; }).sort((a, b) => b.net - a.net).map((r, i) => (
                    <tr key={r.t}><td className="l">{i + 1}</td><td className="nm2 l"><Flag name={r.t} /> {r.t}</td><td>{r.aan != null ? r.aan.toFixed(2) : "—"}</td><td>{r.ver != null ? r.ver.toFixed(2) : "—"}</td><td style={{ color: r.net >= 0 ? "var(--gr)" : "var(--ver)" }}>{r.aan != null ? (r.net >= 0 ? "+" : "") + r.net.toFixed(2) : "—"}</td></tr>
                  ))}
                </tbody></table>
              </>
            )}
          </>
        )}
      </div>

      {model && <button className="slipbtn" onClick={() => setSlip(true)}><ListChecks size={17} /> Invulstaat · {keuzes}</button>}
      {slip && (
        <div className="drawer" onClick={() => setSlip(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}><h3>Jouw invulstaat</h3><X size={20} style={{ marginLeft: "auto", cursor: "pointer" }} onClick={() => setSlip(false)} /></div>
            <div className="champ" style={{ marginBottom: 12 }}><Flag name={knockout?.kampioen} cls="f" /><div><div className="t">Kampioen</div><div className="n" style={{ fontSize: 20 }}>{knockout?.kampioen || "—"}</div></div></div>
            {keuzes === 0 && <p style={{ color: "var(--mut)", fontSize: 14 }}>Nog geen eigen keuzes — alles staat op modeladvies. Tik een score of een odds-pill om je eigen voorspelling te zetten.</p>}
            {Object.keys(overrides).map(Number).sort((a, b) => a - b).map((nr) => { const p = byNr[nr]; if (!p) return null; const [a, b] = scoreVan(nr, p.sa, p.sb); return (<div className="slip-row" key={nr}><Flag name={p.A} /><span>{p.A}</span><span className="s">{a}–{b}</span><span style={{ color: "var(--mut)" }}>{p.B}</span><Flag name={p.B} /></div>); })}
            <div className="row" style={{ marginTop: 16 }}>
              <button className="btn gr" style={{ flex: 1 }} onClick={kopieer}>{kopOk ? <Check size={15} /> : <ClipboardCopy size={15} />} {kopOk ? "Gekopieerd" : "Kopieer alles (CSV)"}</button>
              <button className="btn" onClick={() => setOverrides({})}><Trash2 size={15} /> Wis keuzes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
