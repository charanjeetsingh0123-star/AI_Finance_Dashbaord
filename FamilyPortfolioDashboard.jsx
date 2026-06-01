import { useState, useEffect, useCallback } from "react";
import {
  TrendingDown, RefreshCw, AlertCircle, BarChart3,
  Shield, Wallet, ChevronUp, ChevronDown, Users,
  Database, Coins, Clock, Activity, ArrowUpRight,
  ArrowDownRight, Landmark
} from "lucide-react";
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — Replace with your published Google Sheet CSV link
// File → Share → Publish to web → CSV → Copy link
// ─────────────────────────────────────────────────────────────────────────────
const CSV_URL = "INSERT_PUBLISHED_GOOGLE_SHEET_CSV_LINK_HERE";

// Expected CSV columns:
// member, asset_name, category, broker, invested, current, liability_name, liability_amount

// ─────────────────────────────────────────────────────────────────────────────
// STATIC RATIO DATA  (May 2024 → Apr 2026)
// gs  = Gold / Silver ratio
// ng  = Nifty50 / Gold  (index points per gram of gold in INR)
// ─────────────────────────────────────────────────────────────────────────────
const RATIO_DATA = [
  { date:"May'24", gs:86.2, ng:3.59 }, { date:"Jun'24", gs:82.1, ng:3.65 },
  { date:"Jul'24", gs:88.3, ng:3.48 }, { date:"Aug'24", gs:89.7, ng:3.41 },
  { date:"Sep'24", gs:82.4, ng:3.52 }, { date:"Oct'24", gs:87.1, ng:3.38 },
  { date:"Nov'24", gs:89.2, ng:3.21 }, { date:"Dec'24", gs:84.5, ng:3.66 },
  { date:"Jan'25", gs:90.2, ng:3.28 }, { date:"Feb'25", gs:89.5, ng:3.11 },
  { date:"Mar'25", gs:91.3, ng:2.96 }, { date:"Apr'25", gs:82.8, ng:2.74 },
  { date:"May'25", gs:80.1, ng:2.65 }, { date:"Jun'25", gs:77.4, ng:2.52 },
  { date:"Jul'25", gs:78.9, ng:2.41 }, { date:"Aug'25", gs:73.2, ng:2.28 },
  { date:"Sep'25", gs:78.8, ng:2.31 }, { date:"Oct'25", gs:74.1, ng:2.19 },
  { date:"Nov'25", gs:69.3, ng:2.08 }, { date:"Dec'25", gs:65.8, ng:1.92 },
  { date:"Jan'26", gs:63.4, ng:1.85 }, { date:"Feb'26", gs:67.1, ng:2.11 },
  { date:"Mar'26", gs:62.1, ng:1.98 }, { date:"Apr'26", gs:58.9, ng:1.93 },
];

// ─────────────────────────────────────────────────────────────────────────────
// SEEDED DATA — Charanjeet Singh from IndMoney MCP (verified May 2026)
// Prabhdeep & Surjit load from CSV
// ─────────────────────────────────────────────────────────────────────────────
const SEEDED = {
  charanjeet: {
    name: "Charanjeet Singh", initials: "CS", color: "#3b82f6", csvPending: false,
    holdings: [
      { name:"Physical Gold",          cat:"Gold",           broker:"Physical",        inv:2240000,  cur:4052720 },
      { name:"Real Estate",            cat:"Real Estate",    broker:"Physical",        inv:3000000,  cur:3500000 },
      { name:"Stocks — IndMoney",      cat:"Equity",         broker:"IndMoney",        inv:308764,   cur:529006  },
      { name:"Stocks — Groww",         cat:"Equity",         broker:"Groww",           inv:null,     cur:228283  },
      { name:"Stocks — Motilal Oswal", cat:"Equity",         broker:"Motilal Oswal",   inv:null,     cur:7537    },
      { name:"Mutual Funds (ELSS+)",   cat:"Equity MF",      broker:"Multiple",        inv:283296,   cur:355702  },
      { name:"EPF",                    cat:"Retirement",     broker:"EPFO",            inv:512291,   cur:512291  },
      { name:"Vehicle",                cat:"Fixed Asset",    broker:"—",               inv:420660,   cur:420660  },
      { name:"US Stocks",              cat:"Global Equity",  broker:"IndMoney",        inv:23945,    cur:22701   },
      { name:"Liquid / Cash",          cat:"Liquid",         broker:"Bank + Wallets",  inv:95058,    cur:95058   },
    ],
    liabilities: [
      { name:"HDFC Bank Loan",   amt:1126566 },
      { name:"Bajaj Finance PL", amt:200390  },
      { name:"Credit Cards",     amt:41683   },
    ],
  },
  prabhdeep: {
    name:"Prabhdeep Kaur", initials:"PK", color:"#8b5cf6",
    csvPending:true, holdings:[], liabilities:[],
  },
  surjit: {
    name:"Surjit Kaur", initials:"SK", color:"#ec4899",
    csvPending:true, holdings:[], liabilities:[],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────────────────────
function fmt(v) {
  if (v == null || isNaN(v)) return "—";
  const abs = Math.abs(v), sign = v < 0 ? "-" : "";
  if (abs >= 10000000) return `${sign}₹${(abs/10000000).toFixed(2)}Cr`;
  if (abs >= 100000)   return `${sign}₹${(abs/100000).toFixed(2)}L`;
  if (abs >= 1000)     return `${sign}₹${(abs/1000).toFixed(1)}K`;
  return `${sign}₹${abs.toFixed(0)}`;
}
function gainPct(inv, cur) {
  if (!inv || !cur) return null;
  return ((cur - inv) / inv) * 100;
}
function sentiment(gs) {
  if (gs < 60) return { label:"Risk-On",  color:"text-emerald-400", bg:"bg-emerald-400/10", border:"border-emerald-400/30" };
  if (gs < 75) return { label:"Neutral",  color:"text-amber-400",   bg:"bg-amber-400/10",   border:"border-amber-400/30"   };
  if (gs < 85) return { label:"Cautious", color:"text-orange-400",  bg:"bg-orange-400/10",  border:"border-orange-400/30"  };
  return          { label:"Risk-Off",  color:"text-red-400",     bg:"bg-red-400/10",     border:"border-red-400/30"     };
}

// ─────────────────────────────────────────────────────────────────────────────
// CSV PARSER
// ─────────────────────────────────────────────────────────────────────────────
function parseCSV(text) {
  const lines  = text.trim().split(/\r?\n/);
  const header = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/\s+/g,"_"));
  const parsed = {};

  lines.slice(1).forEach(line => {
    if (!line.trim()) return;
    const cols = line.split(",");
    const row  = header.reduce((o, h, i) => { o[h] = (cols[i]||"").trim(); return o; }, {});
    const key  = (row.member||"").toLowerCase().replace(/\s+/g,"_");
    if (!key) return;
    if (!parsed[key]) parsed[key] = { holdings:[], liabilities:[] };
    if (row.asset_name) {
      parsed[key].holdings.push({
        name:   row.asset_name,
        cat:    row.category  || "Other",
        broker: row.broker    || "—",
        inv:    parseFloat(row.invested) || null,
        cur:    parseFloat(row.current)  || null,
      });
    }
    if (row.liability_name) {
      parsed[key].liabilities.push({
        name: row.liability_name,
        amt:  parseFloat(row.liability_amount) || 0,
      });
    }
  });
  return parsed;
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY BADGE
// ─────────────────────────────────────────────────────────────────────────────
const CAT_STYLES = {
  "Gold":          "bg-amber-400/10  text-amber-400",
  "Real Estate":   "bg-emerald-400/10 text-emerald-400",
  "Equity":        "bg-blue-400/10   text-blue-400",
  "Equity MF":     "bg-violet-400/10 text-violet-400",
  "Global Equity": "bg-cyan-400/10   text-cyan-400",
  "Retirement":    "bg-orange-400/10 text-orange-400",
  "Fixed Asset":   "bg-zinc-400/10   text-zinc-400",
  "Liquid":        "bg-teal-400/10   text-teal-400",
  "Savings":       "bg-sky-400/10    text-sky-400",
  "Debt":          "bg-pink-400/10   text-pink-400",
};
function CatBadge({ cat }) {
  const cls = CAT_STYLES[cat] || "bg-zinc-700/40 text-zinc-500";
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {cat}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// P&L CELL
// ─────────────────────────────────────────────────────────────────────────────
function PnLCell({ inv, cur }) {
  if (cur == null) return <span className="text-zinc-700 text-xs">—</span>;
  if (inv == null) return <span className="text-zinc-600 text-xs italic">Cost N/A</span>;
  const gain = cur - inv;
  const p    = gainPct(inv, cur);
  const pos  = gain >= 0;
  const Icon = pos ? ChevronUp : ChevronDown;
  return (
    <div className={`flex flex-col items-end text-xs font-medium ${pos?"text-emerald-400":"text-red-400"}`}>
      <span className="flex items-center gap-0.5"><Icon size={11}/>{fmt(Math.abs(gain))}</span>
      {p != null && <span className="text-zinc-600 font-normal">{pos?"+":""}{p.toFixed(1)}%</span>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON ROW
// ─────────────────────────────────────────────────────────────────────────────
function SkeletonRows({ n = 5 }) {
  return Array.from({length:n}).map((_,i) => (
    <tr key={i} className="border-b border-zinc-800/50 animate-pulse">
      {[40, 20, 15, 15, 10].map((w, j) => (
        <td key={j} className="py-3 px-3">
          <div className="h-3 bg-zinc-800 rounded" style={{width:`${w}%`}} />
        </td>
      ))}
    </tr>
  ));
}

// ─────────────────────────────────────────────────────────────────────────────
// HOLDINGS TABLE
// ─────────────────────────────────────────────────────────────────────────────
function HoldingsTable({ holdings, liabilities, loading }) {
  const totCur  = holdings.reduce((s, h) => s + (h.cur||0), 0);
  const totInv  = holdings.reduce((s, h) => s + (h.inv||0), 0);
  const totLiab = liabilities.reduce((s, l) => s + l.amt, 0);
  const netWorth = totCur - totLiab;

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[520px]">
          <thead>
            <tr style={{borderBottom:"1px solid #27272a"}}>
              {["Asset","Category","Broker","Invested","Current","P&L"].map((h, i) => (
                <th key={h}
                  className={`py-2.5 px-3 text-xs font-medium text-zinc-500 uppercase tracking-wider
                    ${i >= 3 ? "text-right" : "text-left"}
                    ${i === 2 ? "hidden sm:table-cell" : ""}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? <SkeletonRows /> : holdings.map((h, i) => (
              <tr key={i}
                style={{borderBottom:"1px solid rgba(39,39,42,0.5)"}}
                className="hover:bg-zinc-800/20 transition-colors duration-100">
                <td className="py-2.5 px-3 font-medium text-zinc-200 text-sm whitespace-nowrap">{h.name}</td>
                <td className="py-2.5 px-3 whitespace-nowrap"><CatBadge cat={h.cat}/></td>
                <td className="py-2.5 px-3 text-zinc-500 text-xs hidden sm:table-cell whitespace-nowrap">{h.broker}</td>
                <td className="py-2.5 px-3 text-right text-zinc-400 text-sm tabular-nums">{fmt(h.inv)}</td>
                <td className="py-2.5 px-3 text-right text-zinc-100 font-medium text-sm tabular-nums">{fmt(h.cur)}</td>
                <td className="py-2.5 px-3 text-right"><PnLCell inv={h.inv} cur={h.cur}/></td>
              </tr>
            ))}
          </tbody>
          {!loading && holdings.length > 0 && (
            <tfoot>
              <tr style={{borderTop:"1px solid #3f3f46",background:"rgba(39,39,42,0.4)"}}>
                <td colSpan={3} className="py-2.5 px-3 font-semibold text-zinc-200 text-sm">Total Holdings</td>
                <td className="py-2.5 px-3 text-right font-semibold text-zinc-300 text-sm tabular-nums">{fmt(totInv)}</td>
                <td className="py-2.5 px-3 text-right font-semibold text-zinc-100 text-sm tabular-nums">{fmt(totCur)}</td>
                <td className="py-2.5 px-3 text-right"><PnLCell inv={totInv} cur={totCur}/></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {liabilities.length > 0 && (
        <div style={{borderTop:"1px solid #27272a"}} className="mt-0 pt-0">
          <div style={{background:"rgba(239,68,68,0.04)", borderTop:"1px solid rgba(239,68,68,0.1)"}} className="px-3 py-2">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Liabilities</span>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {liabilities.map((l, i) => (
                <tr key={i} style={{borderBottom:"1px solid rgba(39,39,42,0.5)"}}>
                  <td className="py-2 px-3 text-zinc-400">{l.name}</td>
                  <td className="py-2 px-3 text-right text-red-400 font-medium tabular-nums">{fmt(l.amt)}</td>
                </tr>
              ))}
              <tr style={{borderTop:"1px solid #3f3f46", background:"rgba(39,39,42,0.4)"}}>
                <td className="py-2.5 px-3 font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Landmark size={13} className="text-zinc-500"/> Net Worth
                </td>
                <td className="py-2.5 px-3 text-right font-bold text-emerald-400 tabular-nums text-sm">{fmt(netWorth)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MEMBER SECTION
// ─────────────────────────────────────────────────────────────────────────────
function MemberSection({ member, loading }) {
  const isEmpty = member.holdings.length === 0;
  const totCur  = member.holdings.reduce((s,h) => s+(h.cur||0), 0);
  const totLiab = member.liabilities.reduce((s,l) => s+l.amt, 0);

  return (
    <div style={{border:"1px solid #27272a", borderRadius:12, background:"#111111", overflow:"hidden"}}>
      {/* Member header */}
      <div style={{borderBottom:"1px solid #27272a", background:"rgba(39,39,42,0.3)"}}
        className="flex items-center gap-3 px-5 py-3.5">
        <div style={{
          height:36, width:36, borderRadius:"50%",
          background: member.color + "28",
          border:`1px solid ${member.color}40`,
          display:"flex", alignItems:"center", justifyContent:"center",
          color: member.color, fontSize:12, fontWeight:700, flexShrink:0
        }}>
          {member.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-zinc-100 text-sm">{member.name}</p>
          <p className="text-xs text-zinc-500">
            {loading && member.csvPending ? "Fetching from CSV…"
            : isEmpty && member.csvPending ? "Awaiting CSV data"
            : `${member.holdings.length} asset${member.holdings.length!==1?"s":""} · Net ${fmt(totCur - totLiab)}`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {totCur > 0 && (
            <span style={{background:"rgba(34,197,94,0.1)", color:"#4ade80",
              border:"1px solid rgba(74,222,128,0.2)", borderRadius:20,
              fontSize:11, padding:"2px 10px", fontWeight:500}}>
              {fmt(totCur)}
            </span>
          )}
          {member.csvPending && isEmpty && !loading && (
            <span style={{background:"rgba(245,158,11,0.1)", color:"#fbbf24",
              border:"1px solid rgba(251,191,36,0.2)", borderRadius:20,
              fontSize:10, padding:"2px 8px", display:"flex", alignItems:"center", gap:4}}>
              <Database size={9}/> CSV
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      {isEmpty && !loading ? (
        <div style={{padding:"48px 24px", textAlign:"center"}}>
          <div style={{height:44, width:44, borderRadius:12, background:"#1c1c1c",
            display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px"}}>
            <Database size={20} style={{color:"#3f3f46"}}/>
          </div>
          <p style={{color:"#71717a", fontSize:13, marginBottom:8}}>
            {member.csvPending ? "Portfolio data will load from your published Google Sheet."
            : "No holdings recorded."}
          </p>
          {member.csvPending && (
            <code style={{color:"#a1a1aa", fontSize:11, background:"#1c1c1c",
              padding:"4px 12px", borderRadius:8, display:"inline-block"}}>
              Update CSV_URL → re-deploy
            </code>
          )}
        </div>
      ) : (
        <HoldingsTable
          holdings={member.holdings}
          liabilities={member.liabilities}
          loading={loading && member.csvPending}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// METRIC CARD
// ─────────────────────────────────────────────────────────────────────────────
function MetricCard({ icon:Icon, title, value, sub, valueStyle, pill }) {
  return (
    <div style={{border:"1px solid #27272a", borderRadius:12, background:"#111111", padding:"20px"}}
      className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span style={{fontSize:10, fontWeight:500, color:"#71717a",
          textTransform:"uppercase", letterSpacing:"0.08em"}}>{title}</span>
        <div style={{height:30, width:30, borderRadius:8, background:"#1c1c1c",
          display:"flex", alignItems:"center", justifyContent:"center"}}>
          <Icon size={14} style={{color:"#52525b"}}/>
        </div>
      </div>
      <div>
        <p style={{fontSize:22, fontWeight:600, letterSpacing:"-0.02em", ...valueStyle}}>{value}</p>
        {sub && <p style={{fontSize:11, color:"#52525b", marginTop:3}}>{sub}</p>}
      </div>
      {pill && (
        <span style={{...pill.style, borderRadius:20, fontSize:11, fontWeight:500,
          padding:"3px 10px", width:"fit-content", display:"inline-flex", alignItems:"center", gap:4}}>
          {pill.icon && <pill.icon size={10}/>}
          {pill.label}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHART TOOLTIP
// ─────────────────────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{borderRadius:10, border:"1px solid #3f3f46", background:"#0d0d0d",
      padding:"10px 14px", boxShadow:"0 20px 40px rgba(0,0,0,0.6)"}}>
      <p style={{fontSize:11, fontWeight:600, color:"#d4d4d8", marginBottom:8}}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{display:"flex", alignItems:"center", gap:8, marginBottom:4}}>
          <div style={{width:8, height:8, borderRadius:"50%", background:p.color}}/>
          <span style={{color:"#71717a", fontSize:11}}>{p.name}:</span>
          <span style={{color:"#f4f4f5", fontWeight:600, fontSize:11, fontVariantNumeric:"tabular-nums"}}>
            {p.value?.toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
export default function FamilyPortfolioDashboard() {
  const [data,        setData]        = useState(SEEDED);
  const [csvStatus,   setCsvStatus]   = useState("idle");
  const [error,       setError]       = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [livePrices,  setLivePrices]  = useState(null);

  const fetchCSV = useCallback(async () => {
    if (!CSV_URL || CSV_URL.includes("INSERT")) { setCsvStatus("skipped"); return; }
    setCsvStatus("loading"); setError(null);
    try {
      const res = await fetch(CSV_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status} — ${res.statusText}`);
      const text   = await res.text();
      const parsed = parseCSV(text);

      setData(prev => {
        const next = { ...prev };
        ["prabhdeep","surjit"].forEach(key => {
          const csvKey = Object.keys(parsed).find(k =>
            k.includes(key.slice(0,5)) || k.includes(prev[key].name.split(" ")[0].toLowerCase())
          );
          if (csvKey) {
            next[key] = { ...prev[key], ...parsed[csvKey], csvPending:false };
          }
        });
        return next;
      });

      setLastUpdated(new Date());
      setCsvStatus("success");
    } catch (err) {
      setError(err.message);
      setCsvStatus("error");
    }
  }, []);

  const fetchLocalPortfolio = useCallback(async () => {
    try {
      const res = await (window.smartFetch || fetch)("/api/portfolio");
      if (!res.ok) return;
      const local = await res.json();
      if (local && local.holdings && local.holdings.length > 0) {
        const mapped = local.holdings.map(h => ({
          name: h.name,
          cat: h.category || "Other",
          broker: h.broker || "IndMoney",
          inv: h.invested,
          cur: h.current
        }));
        
        setData(prev => {
          const nonStockHoldings = prev.charanjeet.holdings.filter(h => 
            h.cat !== "Equity" && h.cat !== "Equity MF" && h.cat !== "Global Equity"
          );
          
          return {
            ...prev,
            charanjeet: {
              ...prev.charanjeet,
              holdings: [...nonStockHoldings, ...mapped],
              csvPending: false
            }
          };
        });
        setLastUpdated(new Date());
        setCsvStatus("success");
      }
    } catch (e) {
      console.error("Local portfolio fetch error:", e);
    }
  }, []);

  useEffect(() => {
    fetchCSV();
    fetchLocalPortfolio();
    
    // Fetch live prices
    (window.smartFetch || fetch)("/api/live")
      .then(r => r.json())
      .then(d => {
        if (d && d.prices) setLivePrices(d.prices);
      })
      .catch(() => {});
  }, [fetchCSV, fetchLocalPortfolio]);

  // ── Hero metrics ──────────────────────────────────────────────────────────
  const cs        = data.charanjeet;
  const totCur    = cs.holdings.reduce((s,h) => s+(h.cur||0), 0);
  const totInv    = cs.holdings.reduce((s,h) => s+(h.inv||0), 0);
  const totLiab   = cs.liabilities.reduce((s,l) => s+l.amt, 0);
  const netWorth  = totCur - totLiab;
  const goldCur   = cs.holdings.find(h => h.name==="Physical Gold")?.cur || 0;
  const goldPct   = totCur>0 ? (goldCur/totCur*100).toFixed(1) : 0;
  const overallGain = gainPct(totInv, totCur);

  const latestGS  = livePrices?.gold_silver_ratio?.value || RATIO_DATA[RATIO_DATA.length-1].gs;
  const chartData = useMemo(() => {
    if (!livePrices) return RATIO_DATA;
    const gs = livePrices.gold_silver_ratio?.value;
    const ng = livePrices.nifty_gold_ratio?.value;
    if (!gs || !ng) return RATIO_DATA;
    const last = RATIO_DATA[RATIO_DATA.length - 1];
    if (last.date === "Jun'26") return RATIO_DATA;
    return [...RATIO_DATA, { date: "Jun'26", gs, ng }];
  }, [livePrices]);
  const sent      = sentiment(latestGS);
  const isLoading = csvStatus === "loading";

  // ── Status tag ────────────────────────────────────────────────────────────
  const statusTag = {
    success: { label:"Live",         bg:"rgba(34,197,94,0.1)",  color:"#4ade80",  dot:"#4ade80"  },
    skipped: { label:"CSV Needed",   bg:"rgba(245,158,11,0.1)", color:"#fbbf24",  dot:null       },
    error:   { label:"Fetch Error",  bg:"rgba(239,68,68,0.1)",  color:"#f87171",  dot:null       },
    loading: { label:"Syncing…",     bg:"rgba(113,113,122,0.1)",color:"#a1a1aa",  dot:null       },
    idle:    { label:"Ready",        bg:"rgba(113,113,122,0.1)",color:"#71717a",  dot:null       },
  }[csvStatus];

  return (
    <div style={{minHeight:"100vh", background:"#09090b", color:"#f4f4f5",
      fontFamily:"'Inter',system-ui,-apple-system,sans-serif"}}>

      {/* ── HEADER ── */}
      <header style={{borderBottom:"1px solid #18181b", padding:"0 24px", height:56,
        display:"flex", alignItems:"center", position:"sticky", top:0, zIndex:50,
        background:"rgba(9,9,11,0.85)", backdropFilter:"blur(12px)"}}>
        <div style={{maxWidth:1200, width:"100%", margin:"0 auto",
          display:"flex", alignItems:"center", justifyContent:"space-between"}}>
          {/* Brand */}
          <div style={{display:"flex", alignItems:"center", gap:10}}>
            <div style={{height:30, width:30, borderRadius:8, background:"rgba(245,158,11,0.15)",
              display:"flex", alignItems:"center", justifyContent:"center"}}>
              <Coins size={15} style={{color:"#f59e0b"}}/>
            </div>
            <div>
              <p style={{fontWeight:600, fontSize:13, color:"#f4f4f5", lineHeight:1.2}}>Family Portfolio</p>
              <p style={{fontSize:10, color:"#52525b", lineHeight:1.2}}>Singh · Kaur · Kaur</p>
            </div>
          </div>

          {/* Controls */}
          <div style={{display:"flex", alignItems:"center", gap:10}}>
            <span style={{background:statusTag.bg, color:statusTag.color,
              border:`1px solid ${statusTag.color}30`, borderRadius:20,
              fontSize:10, padding:"3px 10px", display:"flex", alignItems:"center", gap:5}}>
              {statusTag.dot && <span style={{width:6, height:6, borderRadius:"50%",
                background:statusTag.dot, animation: csvStatus==="success" ? "pulse 2s infinite" : "none"}}/>}
              {statusTag.label}
            </span>
            <span style={{fontSize:10, color:"#3f3f46", display:"flex", alignItems:"center", gap:4}}>
              <Clock size={10}/> {lastUpdated.toLocaleTimeString()}
            </span>
            <button onClick={fetchCSV} disabled={isLoading}
              style={{height:30, width:30, borderRadius:8, background:"#1c1c1c",
                border:"1px solid #27272a", display:"flex", alignItems:"center",
                justifyContent:"center", cursor:"pointer", transition:"background 0.15s"}}>
              <RefreshCw size={13} style={{
                color: isLoading ? "#52525b" : "#a1a1aa",
                animation: isLoading ? "spin 1s linear infinite" : "none"
              }}/>
            </button>
          </div>
        </div>
      </header>

      <main style={{maxWidth:1200, margin:"0 auto", padding:"28px 16px 64px"}}>

        {/* ── ERROR BANNER ── */}
        {error && (
          <div style={{borderRadius:10, border:"1px solid rgba(239,68,68,0.2)",
            background:"rgba(239,68,68,0.05)", padding:"12px 16px",
            display:"flex", alignItems:"flex-start", gap:12, marginBottom:24}}>
            <AlertCircle size={16} style={{color:"#f87171", flexShrink:0, marginTop:1}}/>
            <div>
              <p style={{fontSize:13, fontWeight:600, color:"#fca5a5", marginBottom:2}}>CSV Fetch Failed</p>
              <p style={{fontSize:11, color:"#ef4444"}}>{error} — Displaying seeded data. Update CSV_URL in the config.</p>
            </div>
          </div>
        )}

        {/* ── HERO METRICS ── */}
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",
          gap:14, marginBottom:28}}>
          <MetricCard
            icon={Wallet} title="Net Worth (CS)"
            value={fmt(netWorth)}
            sub={`${fmt(totCur)} gross — ${fmt(totLiab)} liabilities`}
            valueStyle={{color:"#f4f4f5"}}
            pill={{label:`${overallGain!=null?(overallGain>=0?"+":"")+overallGain.toFixed(1)+"%":"—"} overall`,
              style:{background:"rgba(74,222,128,0.1)", color:"#4ade80",
                border:"1px solid rgba(74,222,128,0.2)"},
              icon: overallGain >= 0 ? ArrowUpRight : ArrowDownRight}}
          />
          <MetricCard
            icon={Coins} title="Gold Allocation (CS)"
            value={`${goldPct}%`}
            sub={`${fmt(goldCur)} in gold assets`}
            valueStyle={{color:"#fbbf24"}}
            pill={{label:"Overweight — review target",
              style:{background:"rgba(245,158,11,0.1)", color:"#f59e0b",
                border:"1px solid rgba(245,158,11,0.2)"}}}
          />
          <MetricCard
            icon={Activity} title="Monthly SIP Due"
            value="₹22,500"
            sub="Estimated across Mirae, Quant, Tata, DSP, Bandhan, Axis"
            valueStyle={{color:"#c084fc"}}
            pill={{label:"Auto-debit active",
              style:{background:"rgba(192,132,252,0.1)", color:"#c084fc",
                border:"1px solid rgba(192,132,252,0.2)"}}}
          />
          <MetricCard
            icon={Shield} title="Market Risk Sentiment"
            value={sent.label}
            sub={`Gold/Silver ratio: ${latestGS} (Apr '26) — down from 91.3 peak`}
            valueStyle={{color: sent.label==="Risk-On"?"#4ade80":
              sent.label==="Neutral"?"#fbbf24":
              sent.label==="Cautious"?"#fb923c":"#f87171"}}
            pill={{label: latestGS < 65 ? "Silver catching up = bullish markets" : "Elevated safety demand",
              style:{background: sent.label==="Risk-On"?"rgba(74,222,128,0.1)":"rgba(251,146,60,0.1)",
                color: sent.label==="Risk-On"?"#4ade80":"#fb923c",
                border: `1px solid ${sent.label==="Risk-On"?"rgba(74,222,128,0.2)":"rgba(251,146,60,0.2)"}`}}}
          />
        </div>

        {/* ── ALLOCATION TREEMAP ── */}
        <div style={{border:"1px solid #27272a", borderRadius:12, background:"#111111", padding:"20px", marginBottom:28}}>
          <h2 style={{fontSize:13, fontWeight:600, color:"#d4d4d8", marginBottom:16}}>Simply Wall St Allocation (Treemap)</h2>
          <div style={{height: 250}}>
            {typeof Recharts !== 'undefined' && Recharts.Treemap && cs.holdings.length > 0 ? (
              <Recharts.ResponsiveContainer width="100%" height="100%">
                <Recharts.Treemap
                  data={cs.holdings.map(h => ({ name: h.name, size: h.cur || 0 }))}
                  dataKey="size"
                  aspectRatio={4/3}
                  stroke="#09090b"
                  fill="#3b82f6"
                  isAnimationActive={false}
                >
                  <Recharts.Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div style={{background:"#1c1c1c", border:"1px solid #27272a", padding:"8px", borderRadius:6}}>
                            <p style={{fontSize:11, color:"#f4f4f5"}}>{payload[0].payload.name}</p>
                            <p style={{fontSize:10, color:"#a1a1aa"}}>₹{payload[0].value.toLocaleString()}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </Recharts.Treemap>
              </Recharts.ResponsiveContainer>
            ) : (
              <div style={{display:"flex", alignItems:"center", justifyContent:"center", height:"100%", color:"#52525b", fontSize:11}}>
                No data for Treemap
              </div>
            )}
          </div>
        </div>

        {/* ── PORTFOLIO SECTIONS ── */}
        <div style={{marginBottom:28}}>
          <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:16}}>
            <Users size={14} style={{color:"#52525b"}}/>
            <h2 style={{fontSize:13, fontWeight:600, color:"#d4d4d8"}}>Individual Portfolios</h2>
            <span style={{fontSize:11, color:"#3f3f46"}}>3 members</span>
            {csvStatus === "skipped" && (
              <span style={{marginLeft:"auto", fontSize:10, color:"#71717a"}}>
                Set CSV_URL to load Prabhdeep &amp; Surjit data
              </span>
            )}
          </div>
          <div style={{display:"flex", flexDirection:"column", gap:16}}>
            <MemberSection member={data.charanjeet} loading={isLoading}/>
            <MemberSection member={data.prabhdeep}  loading={isLoading}/>
            <MemberSection member={data.surjit}     loading={isLoading}/>
          </div>
        </div>

        {/* ── RATIO CHART ── */}
        <div style={{border:"1px solid #27272a", borderRadius:12,
          background:"#111111", overflow:"hidden", marginBottom:28}}>

          {/* Chart header */}
          <div style={{borderBottom:"1px solid #27272a", padding:"16px 20px",
            display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12}}>
            <div>
              <h2 style={{fontSize:13, fontWeight:600, color:"#e4e4e7"}}>Market Ratio Indicators</h2>
              <p style={{fontSize:11, color:"#52525b", marginTop:2}}>
                Gold/Silver ratio &amp; Nifty50/Gold (pts per gram) — May 2024 → Apr 2026
              </p>
            </div>
            <div style={{display:"flex", alignItems:"center", gap:16}}>
              {[
                {color:"#f59e0b", dash:false, label:"Gold / Silver"},
                {color:"#60a5fa", dash:true,  label:"Nifty / Gold"},
              ].map(({color, dash, label}) => (
                <div key={label} style={{display:"flex", alignItems:"center", gap:6}}>
                  <svg width={20} height={3}>
                    {dash
                      ? <line x1={0} y1={1.5} x2={20} y2={1.5} stroke={color} strokeWidth={2} strokeDasharray="4 2"/>
                      : <line x1={0} y1={1.5} x2={20} y2={1.5} stroke={color} strokeWidth={2}/>}
                  </svg>
                  <span style={{fontSize:11, color:"#71717a"}}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* KPI strip */}
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr",
            borderBottom:"1px solid #27272a"}}>
            {[
              {
                label:"Gold / Silver Ratio",
                value:"58.9",
                color:"#f59e0b",
                delta:"-32.4 from Mar '25 peak",
                sub:"Low = Silver catching up = Risk-On signal",
                positive:true,
              },
              {
                label:"Nifty50 / Gold  (pts per gram ₹)",
                value:"1.93",
                color:"#60a5fa",
                delta:"-47.3% from Dec '24 (3.66)",
                sub:"Nifty getting cheaper vs gold — watch for re-entry",
                positive:false,
              },
            ].map((k, i) => (
              <div key={i}
                style={{
                  padding:"14px 20px",
                  borderRight: i===0 ? "1px solid #27272a" : "none",
                  background:"rgba(17,17,17,0.8)"
                }}>
                <p style={{fontSize:11, color:"#71717a", marginBottom:4}}>{k.label}</p>
                <div style={{display:"flex", alignItems:"baseline", gap:10}}>
                  <span style={{fontSize:24, fontWeight:700, color:k.color, letterSpacing:"-0.02em"}}>
                    {k.value}
                  </span>
                  <div style={{display:"flex", alignItems:"center", gap:4,
                    color: k.positive ? "#4ade80" : "#f87171", fontSize:11}}>
                    <TrendingDown size={12}/>
                    <span>{k.delta}</span>
                  </div>
                </div>
                <p style={{fontSize:10, color:"#3f3f46", marginTop:2}}>{k.sub}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div style={{padding:"20px", height:280}}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{top:4, right:14, left:-16, bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1c" vertical={false}/>
                <XAxis dataKey="date"
                  tick={{fill:"#52525b", fontSize:10}}
                  axisLine={{stroke:"#27272a"}} tickLine={false} interval={2}/>
                <YAxis yAxisId="gs" orientation="left" domain={[50,100]}
                  tick={{fill:"#78716c", fontSize:10}}
                  axisLine={false} tickLine={false}/>
                <YAxis yAxisId="ng" orientation="right" domain={[1.5,4.0]}
                  tick={{fill:"#3b5a7a", fontSize:10}}
                  axisLine={false} tickLine={false}
                  tickFormatter={v=>v.toFixed(1)}/>
                <Tooltip content={<ChartTooltip/>}/>
                <ReferenceLine yAxisId="gs" y={70} stroke="#f59e0b" strokeDasharray="4 4"
                  strokeOpacity={0.3} label={{value:"G/S 70",fill:"#78716c",fontSize:9,position:"right"}}/>
                <ReferenceLine yAxisId="ng" y={2.5} stroke="#60a5fa" strokeDasharray="4 4"
                  strokeOpacity={0.3} label={{value:"N/G 2.5",fill:"#3b5a7a",fontSize:9,position:"left"}}/>
                <Line yAxisId="gs" type="monotone" dataKey="gs" name="Gold/Silver Ratio"
                  stroke="#f59e0b" strokeWidth={2} dot={false}
                  activeDot={{r:5, fill:"#f59e0b", stroke:"#09090b", strokeWidth:2}}/>
                <Line yAxisId="ng" type="monotone" dataKey="ng" name="Nifty/Gold (pts/g)"
                  stroke="#60a5fa" strokeWidth={2} strokeDasharray="6 3" dot={false}
                  activeDot={{r:5, fill:"#60a5fa", stroke:"#09090b", strokeWidth:2}}/>
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Chart insights */}
          <div style={{borderTop:"1px solid #18181b", padding:"12px 20px",
            display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:12}}>
            {[
              {
                icon: BarChart3,
                title:"Gold/Silver < 60 = Metals bull market matures",
                body:"Silver outperforming gold signals risk-on momentum and industrial demand pick-up.",
                color:"#f59e0b",
              },
              {
                icon: Activity,
                title:"Nifty/Gold falling = Equity underperforming gold",
                body:"Nifty needs ~4,800 pts per gram to match historical norm. Consider rebalancing.",
                color:"#60a5fa",
              },
              {
                icon: Shield,
                title:"Your 43.6% gold allocation is well-timed",
                body:"Fiscal dominance era started. Gold's bull case remains intact despite positive real yields.",
                color:"#4ade80",
              },
            ].map(({icon:Icon, title, body, color}, i) => (
              <div key={i} style={{display:"flex", gap:10, alignItems:"flex-start"}}>
                <div style={{height:28, width:28, borderRadius:8, background:color+"15",
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2}}>
                  <Icon size={13} style={{color}}/>
                </div>
                <div>
                  <p style={{fontSize:11, fontWeight:600, color:"#d4d4d8", marginBottom:2}}>{title}</p>
                  <p style={{fontSize:10, color:"#52525b", lineHeight:1.5}}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{textAlign:"center", paddingTop:8}}>
          <p style={{fontSize:11, color:"#3f3f46"}}>
            Family Portfolio Dashboard · IndMoney MCP (May 2026) + Google Sheets CSV · Not financial advice
          </p>
          <p style={{fontSize:10, color:"#27272a", marginTop:4}}>
            React · Recharts · Tailwind CSS · shadcn/ui design system
          </p>
        </div>

      </main>

      {/* ── GLOBAL KEYFRAMES ── */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #09090b; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}</style>
    </div>
  );
}
