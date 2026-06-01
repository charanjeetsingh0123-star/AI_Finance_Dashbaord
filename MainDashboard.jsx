import { useState, useEffect } from "react";

const C = {
  bg: "#09090b", card: "#0f0f0f", card2: "#141414", border: "#1f1f1f",
  t1: "#f4f4f5", t2: "#a1a1aa", t3: "#52525b",
  red: "#ef4444", redbg: "rgba(239,68,68,0.08)",
  amber: "#f59e0b", amberbg: "rgba(245,158,11,0.08)",
  green: "#22c55e", greenbg: "rgba(34,197,94,0.08)",
  blue: "#60a5fa", bluebg: "rgba(96,165,250,0.08)",
  purple: "#a78bfa", purplebg: "rgba(167,139,250,0.08)",
  cyan: "#06b6d4", cyanbg: "rgba(6,182,212,0.08)"
};

const StatCard = ({ title, val, change, trend, sub }) => (
  <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
    <p style={{ fontSize: 10, color: C.t3, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>{title}</p>
    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
      <span style={{ fontSize: 20, fontWeight: 700, color: C.t1 }}>{val}</span>
      {change && <span style={{ fontSize: 10, fontWeight: 600, color: trend === "up" ? C.green : C.red }}>{change}</span>}
    </div>
    {sub && <p style={{ fontSize: 10, color: C.t2, marginTop: 4 }}>{sub}</p>}
  </div>
);

const ProgressBar = ({ label, val, max, color }) => {
  const pct = Math.min((val / max) * 100, 100);
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.t2, marginBottom: 2 }}>
        <span>{label}</span>
        <span style={{ fontWeight: 600 }}>{val}%</span>
      </div>
      <div style={{ height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3 }} />
      </div>
    </div>
  );
};

export default function MainDashboard() {
  const [live, setLive] = useState(null);
  const [news, setNews] = useState([]);
  const [projTab, setProjTab] = useState("Gold");

  const PROJECTIONS = {
    Gold: [
      { h: "1-Week", t: "$4,620", d: "DXY wane", c: "" },
      { h: "1-Month", t: "$4,850", d: "Warsh fear", c: "" },
      { h: "3-Month", t: "$5,100", d: "Stagflation", c: "" },
      { h: "1-Year", t: "$5,500", d: "Rates roll", c: "" },
      { h: "2030 (5-Yr)", t: "$6.5K–8K", d: "Debt Spiral", c: C.gold }
    ],
    Silver: [
      { h: "1-Week", t: "$52", d: "Gold momentum", c: "" },
      { h: "1-Month", t: "$58", d: "Industrial squeeze", c: "" },
      { h: "3-Month", t: "$65", d: "Solar demand", c: "" },
      { h: "1-Year", t: "$80", d: "Deficit peak", c: "" },
      { h: "2030 (5-Yr)", t: "$120–150", d: "Electrification", c: C.blue }
    ],
    Nifty50: [
      { h: "1-Week", t: "23,800", d: "FII buying", c: "" },
      { h: "1-Month", t: "24,500", d: "Earnings growth", c: "" },
      { h: "3-Month", t: "25,200", d: "Rate cut prep", c: "" },
      { h: "1-Year", t: "28,000", d: "Capex cycle", c: "" },
      { h: "2030 (5-Yr)", t: "38K–45K", d: "India Decade", c: C.cyan }
    ],
    Nifty500: [
      { h: "1-Week", t: "22,500", d: "Midcap bounce", c: "" },
      { h: "1-Month", t: "23,100", d: "Domestic flows", c: "" },
      { h: "3-Month", t: "24,000", d: "Retail SIPs", c: "" },
      { h: "1-Year", t: "26,500", d: "Broad recovery", c: "" },
      { h: "2030 (5-Yr)", t: "40K–48K", d: "Formalization", c: C.green }
    ],
    Nasdaq: [
      { h: "1-Week", t: "18,200", d: "Tech earnings", c: "" },
      { h: "1-Month", t: "18,800", d: "AI momentum", c: "" },
      { h: "3-Month", t: "19,500", d: "Soft landing", c: "" },
      { h: "1-Year", t: "21,000", d: "Fed cuts", c: "" },
      { h: "2030 (5-Yr)", t: "28K–35K", d: "AGI adoption", c: C.purple }
    ]
  };

  useEffect(() => {
    fetch("/api/live")
      .then(r => r.json())
      .then(d => { if (d && d.prices) setLive(d.prices); })
      .catch(() => {});
    fetch("/api/news")
      .then(r => r.json())
      .then(d => { if (d && d.items) setNews(d.items.slice(0, 5)); })
      .catch(() => {});
  }, []);

  const goldVal = live?.gold_usd?.value || 4593.00;
  const crudeVal = live?.crude_wti?.value || 87.36;
  const bondVal = live?.us_10y?.value || 4.45;
  const dxyVal = live?.dxy?.value || 98.91;
  const gsRatio = live?.gold_silver_ratio?.value || 60.53;
  const ngRatio = live?.nifty_gold_ratio?.value || 1.68;
  const niftyVal = live?.nifty50?.value || 23547.75;
  const nvdaVal = live?.nvda?.value || 120.00;
  const msftVal = live?.msft?.value || 400.00;
  const aaplVal = live?.aapl?.value || 190.00;
  const googlVal = live?.googl?.value || 170.00;
  const metaVal = live?.meta?.value || 450.00;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.t1, fontFamily: "'Inter',system-ui,sans-serif", padding: "16px 20px" }}>
      {/* Title Header */}
      <div style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 12, marginBottom: 16 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700 }}>Statistical Macro Cockpit</h1>
        <p style={{ fontSize: 10, color: C.t3, marginTop: 2 }}>Live Market Analytics · Projections & Playbook Horizon Matrix</p>
      </div>

      {/* Grid: 3 Major Sections */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
        
        {/* SECTION 1: Fed Rate & Macro Metrics */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: C.blue, borderBottom: `1px solid ${C.border}`, paddingBottom: 6, marginBottom: 12 }}>🏛️ Fed & Global Macro Matrix</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
            <StatCard title="Current Fed Rate" val="3.50% - 3.75%" sub="Status: Hold" />
            <StatCard title="US 10Y Bond" val={`${bondVal}%`} change={live?.us_10y?.change_pct ? `${live.us_10y.change_pct}%` : ""} trend={live?.us_10y?.change_pct > 0 ? "up" : "dn"} sub="Inverted yield curve" />
            <StatCard title="US Dollar Index" val={dxyVal} change={live?.dxy?.change_pct ? `${live.dxy.change_pct}%` : ""} sub="Global FX Pressure" />
            <StatCard title="Crude WTI" val={`$${crudeVal}`} change={live?.crude_wti?.change_pct ? `${live.crude_wti.change_pct}%` : ""} sub="Hormuz Geopolitics" />
          </div>

          <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, marginBottom: 12 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.t2, textTransform: "uppercase", marginBottom: 8 }}>June 16 Decisions CME FedWatch</p>
            <ProgressBar label="Rate Hike (+25bps)" val={57} max={100} color={C.red} />
            <ProgressBar label="Rate Hold (No change)" val={43} max={100} color={C.amber} />
            <p style={{ fontSize: 9, color: C.t3, marginTop: 6 }}>Solid Reason: CPI jumped to 3.8% vs GDP slowdown (2.0%). Warsh wants credibility hawk play.</p>
          </div>

          <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.t2, textTransform: "uppercase", marginBottom: 6 }}>Latest Related Indicators</p>
            <table style={{ width: "100%", fontSize: 10, borderCollapse: "collapse" }}>
              <tbody>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}><td style={{ padding: "4px 0", color: C.t3 }}>US Total Debt</td><td style={{ textAlign: "right", fontWeight: 600 }}>$36.2T (Fiscal Dominance)</td></tr>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}><td style={{ padding: "4px 0", color: C.t3 }}>China Flow</td><td style={{ textAlign: "right", fontWeight: 600 }}>Dumping Treasury, Buying Gold</td></tr>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}><td style={{ padding: "4px 0", color: C.t3 }}>Trump Tariff Factor</td><td style={{ textAlign: "right", fontWeight: 600, color: C.amber }}>Max Tariffs Threat</td></tr>
                <tr><td style={{ padding: "4px 0", color: C.t3 }}>War Premium</td><td style={{ textAlign: "right", fontWeight: 600, color: C.red }}>Hormuz blockage risk 15%</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 2: Gold Statistical Analysis & Technicals */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: C.purple, borderBottom: `1px solid ${C.border}`, paddingBottom: 6, marginBottom: 12 }}>🥇 Gold Projection Model</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
            <StatCard title="Gold Spot" val={`$${goldVal}`} sub="Base support: $4,100" />
            <StatCard title="Gold/Silver Ratio" val={gsRatio} sub="Under 60 = Silver outruns" />
            <StatCard title="Nifty/Gold Ratio" val={ngRatio} sub="10Y low = Nifty cheapest" />
            <StatCard title="CB Flow Q1" val="244 tonnes" sub="Govt Reserves Flow" />
          </div>

          <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, marginBottom: 12 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.t2, textTransform: "uppercase", marginBottom: 6 }}>Technical Signals</p>
            <table style={{ width: "100%", fontSize: 10, borderCollapse: "collapse" }}>
              <tbody>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}><td style={{ padding: "4px 0", color: C.t3 }}>50-day DMA</td><td style={{ textAlign: "right", fontWeight: 600, color: C.green }}>$4,380 (Above DMA)</td></tr>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}><td style={{ padding: "4px 0", color: C.t3 }}>200-day DMA</td><td style={{ textAlign: "right", fontWeight: 600, color: C.green }}>$4,150 (Golden Cross)</td></tr>
                <tr><td style={{ padding: "4px 0", color: C.t3 }}>De-dollarization Trend</td><td style={{ textAlign: "right", fontWeight: 600, color: C.purple }}>Extreme (BRICS buying)</td></tr>
              </tbody>
            </table>
          </div>

          <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: C.t2, textTransform: "uppercase" }}>Projection Targets</p>
              <div style={{ display: "flex", gap: 4 }}>
                {Object.keys(PROJECTIONS).map(t => (
                  <button key={t} onClick={() => setProjTab(t)}
                    style={{ background: projTab === t ? C.t1 : "transparent", color: projTab === t ? C.bg : C.t2,
                      border: `1px solid ${projTab === t ? C.t1 : C.border}`, borderRadius: 12, fontSize: 9, padding: "2px 6px", cursor: "pointer", transition: "all 0.2s" }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}`, color: C.t3, fontSize: 9 }}>
                  <th style={{ textAlign: "left", padding: "4px 0" }}>Horizon</th>
                  <th style={{ textAlign: "right" }}>Target</th>
                  <th style={{ textAlign: "right" }}>Drivers</th>
                </tr>
              </thead>
              <tbody>
                {PROJECTIONS[projTab].map((p, i) => (
                  <tr key={i} style={{ borderBottom: i === 4 ? "none" : `1px solid ${C.border}` }}>
                    <td style={{ padding: "4px 0" }}>{p.h}</td>
                    <td style={{ textAlign: "right", fontWeight: 600, color: p.c || C.t1 }}>{p.t}</td>
                    <td style={{ textAlign: "right", color: p.c || C.t2 }}>{p.d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 3: AI Bubble & Smart Money Tracker */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.border}`, paddingBottom: 6, marginBottom: 12 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: C.red }}>🚨 AI Bubble & Smart Money Tracker</h2>
            <div style={{ background: C.redbg, color: C.red, padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 700, border: `1px solid ${C.red}` }}>
              VERDICT: HIGH RISK ZONES
            </div>
          </div>
          
          <p style={{ fontSize: 10, fontWeight: 700, color: C.t2, textTransform: "uppercase", marginBottom: 6 }}>MegaCap AI Valuations & Flows</p>
          <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse", marginBottom: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}`, color: C.t3, fontSize: 9 }}>
                <th style={{ textAlign: "left", padding: "4px 0" }}>Stock</th>
                <th style={{ textAlign: "right" }}>Price</th>
                <th style={{ textAlign: "right" }}>Valuation</th>
                <th style={{ textAlign: "right" }}>Smart Money (3d)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}><td style={{ padding: "4px 0", fontWeight: 600 }}>NVDA</td><td style={{ textAlign: "right" }}>${nvdaVal}</td><td style={{ textAlign: "right", color: C.red }}>Overvalued</td><td style={{ textAlign: "right", color: C.red }}>Distribution</td></tr>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}><td style={{ padding: "4px 0", fontWeight: 600 }}>MSFT</td><td style={{ textAlign: "right" }}>${msftVal}</td><td style={{ textAlign: "right", color: C.red }}>Overvalued</td><td style={{ textAlign: "right", color: C.red }}>Moving Away</td></tr>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}><td style={{ padding: "4px 0", fontWeight: 600 }}>AAPL</td><td style={{ textAlign: "right" }}>${aaplVal}</td><td style={{ textAlign: "right", color: C.amber }}>Stretched</td><td style={{ textAlign: "right", color: C.amber }}>Neutral</td></tr>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}><td style={{ padding: "4px 0", fontWeight: 600 }}>GOOGL</td><td style={{ textAlign: "right" }}>${googlVal}</td><td style={{ textAlign: "right", color: C.green }}>Fair</td><td style={{ textAlign: "right", color: C.green }}>Adding</td></tr>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}><td style={{ padding: "4px 0", fontWeight: 600 }}>META</td><td style={{ textAlign: "right" }}>${metaVal}</td><td style={{ textAlign: "right", color: C.green }}>Fair</td><td style={{ textAlign: "right", color: C.amber }}>Neutral</td></tr>
            </tbody>
          </table>

          <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, marginBottom: 12 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.t2, textTransform: "uppercase", marginBottom: 6 }}>Bubble Bursting Factors (Macro/Micro)</p>
            <div style={{ fontSize: 10, color: C.t2 }}>
              <p style={{ marginBottom: 4 }}><span style={{ color: C.red, fontWeight: 600 }}>1. Macro:</span> Fed "Higher for Longer" delays capital cost reduction, hitting high PE multiples.</p>
              <p style={{ marginBottom: 4 }}><span style={{ color: C.amber, fontWeight: 600 }}>2. Micro:</span> Corporate IT budget exhaustion vs AI ROI lag (revenue catch-up).</p>
              <p><span style={{ color: C.purple, fontWeight: 600 }}>3. Geopolitics:</span> Warsh doctrine signals fiscal constraint; US-China semi export bans escalating.</p>
            </div>
          </div>

          <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.t2, textTransform: "uppercase", marginBottom: 6 }}>Real Smart Money Movement</p>
            <table style={{ width: "100%", fontSize: 10, borderCollapse: "collapse" }}>
              <tbody>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}><td style={{ padding: "4px 0", color: C.gold, fontWeight: 600 }}>Physical Gold</td><td style={{ textAlign: "right", color: C.t2 }}>Central Banks buying record volumes (BRICS)</td></tr>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}><td style={{ padding: "4px 0", color: C.green, fontWeight: 600 }}>Short-Term Bonds</td><td style={{ textAlign: "right", color: C.t2 }}>Institutions locking 5%+ risk-free yields</td></tr>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}><td style={{ padding: "4px 0", color: C.cyan, fontWeight: 600 }}>Money Mkt Cash</td><td style={{ textAlign: "right", color: C.t2 }}>Piling ~$6T on sidelines waiting for crash</td></tr>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}><td style={{ padding: "4px 0", color: C.blue, fontWeight: 600 }}>Silver / Commodities</td><td style={{ textAlign: "right", color: C.t2 }}>Industrial squeeze hedging</td></tr>
                <tr><td style={{ padding: "4px 0", color: C.red, fontWeight: 600 }}>Commercial RE</td><td style={{ textAlign: "right", color: C.t2 }}>Massive outflow due to refi debt maturities</td></tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
