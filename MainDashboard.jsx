import { useState, useEffect } from "react";

const C = {
  bg: "#09090b", card: "#0f0f0f", card2: "#141414", border: "#1f1f1f",
  t1: "#f4f4f5", t2: "#a1a1aa", t3: "#52525b",
  red: "#ef4444", redbg: "rgba(239,68,68,0.08)",
  amber: "#f59e0b", amberbg: "rgba(245,158,11,0.08)",
  green: "#22c55e", greenbg: "rgba(34,197,94,0.08)",
  blue: "#60a5fa", bluebg: "rgba(96,165,250,0.08)",
  purple: "#a78bfa", purplebg: "rgba(167,139,250,0.08)",
  cyan: "#06b6d4", cyanbg: "rgba(6,182,212,0.08)",
  gold: "#fbbf24"
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
  const [projTab, setProjTab] = useState("Gold");
  const [scenario, setScenario] = useState("Base");

  const SCENARIOS = {
    Base: {
      Gold: [
        { h: "1-Week", t: "$4,620", d: "DXY wane" },
        { h: "1-Month", t: "$4,850", d: "Warsh fear" },
        { h: "3-Month", t: "$5,100", d: "Stagflation" },
        { h: "1-Year", t: "$5,500", d: "Rates roll" },
        { h: "2030 (5-Yr)", t: "$6,500", d: "Debt Spiral", c: C.gold }
      ],
      Silver: [
        { h: "1-Week", t: "$52.00", d: "Gold momentum" },
        { h: "1-Month", t: "$58.00", d: "Ind. squeeze" },
        { h: "3-Month", t: "$65.00", d: "Solar demand" },
        { h: "1-Year", t: "$80.00", d: "Deficit peak" },
        { h: "2030 (5-Yr)", t: "$110.00", d: "Electrification", c: C.blue }
      ],
      Nifty50: [
        { h: "1-Week", t: "23,800", d: "FII buying" },
        { h: "1-Month", t: "24,500", d: "Earnings growth" },
        { h: "3-Month", t: "25,200", d: "Rate cut prep" },
        { h: "1-Year", t: "28,000", d: "Capex cycle" },
        { h: "2030 (5-Yr)", t: "38,000", d: "India Decade", c: C.cyan }
      ],
      Nifty500: [
        { h: "1-Week", t: "22,500", d: "Midcap bounce" },
        { h: "1-Month", t: "23,100", d: "Domestic flows" },
        { h: "3-Month", t: "24,000", d: "Retail SIPs" },
        { h: "1-Year", t: "26,500", d: "Broad recovery" },
        { h: "2030 (5-Yr)", t: "32,000", d: "Formalization", c: C.green }
      ],
      Nasdaq: [
        { h: "1-Week", t: "18,200", d: "Tech earnings" },
        { h: "1-Month", t: "18,800", d: "AI momentum" },
        { h: "3-Month", t: "19,500", d: "Soft landing" },
        { h: "1-Year", t: "21,000", d: "Fed cuts" },
        { h: "2030 (5-Yr)", t: "30,000", d: "AGI adoption", c: C.purple }
      ]
    },
    Bull: {
      Gold: [
        { h: "1-Week", t: "$4,700", d: "Liquidity build" },
        { h: "1-Month", t: "$5,000", d: "Fiat flight" },
        { h: "3-Month", t: "$5,300", d: "CB panic buying" },
        { h: "1-Year", t: "$6,000", d: "Debt spiral acceleration" },
        { h: "2030 (5-Yr)", t: "$8,500", d: "Stagflation hedge", c: C.gold }
      ],
      Silver: [
        { h: "1-Week", t: "$55.00", d: "Industrial panic" },
        { h: "1-Month", t: "$62.00", d: "Supply shortage" },
        { h: "3-Month", t: "$72.00", d: "Solar solarization" },
        { h: "1-Year", t: "$95.00", d: "Green grid panic" },
        { h: "2030 (5-Yr)", t: "$150.00", d: "Metal deficit peak", c: C.blue }
      ],
      Nifty50: [
        { h: "1-Week", t: "24,200", d: "SIP record surge" },
        { h: "1-Month", t: "25,600", d: "Foreign flows back" },
        { h: "3-Month", t: "27,000", d: "Monsoon surprise" },
        { h: "1-Year", t: "32,000", d: "GDP outperformance" },
        { h: "2030 (5-Yr)", t: "50,000", d: "SIP cushioning", c: C.cyan }
      ],
      Nifty500: [
        { h: "1-Week", t: "23,000", d: "Retail FOMO" },
        { h: "1-Month", t: "24,400", d: "Midcap expansion" },
        { h: "3-Month", t: "25,800", d: "Earnings upgrades" },
        { h: "1-Year", t: "30,500", d: "Credit expansion" },
        { h: "2030 (5-Yr)", t: "45,000", d: "India formalization", c: C.green }
      ],
      Nasdaq: [
        { h: "1-Week", t: "18,700", d: "AI revenue spike" },
        { h: "1-Month", t: "19,800", d: "Fed cuts early" },
        { h: "3-Month", t: "21,200", d: "Buybacks expand" },
        { h: "1-Year", t: "24,500", d: "Nvidia 3T market cap" },
        { h: "2030 (5-Yr)", t: "42,000", d: "AGI commercialized", c: C.purple }
      ]
    },
    Bear: {
      Gold: [
        { h: "1-Week", t: "$4,500", d: "DXY safe haven" },
        { h: "1-Month", t: "$4,300", d: "Deflation threat" },
        { h: "3-Month", t: "$4,000", d: "Liquidations spike" },
        { h: "1-Year", t: "$3,500", d: "Cash preference" },
        { h: "2030 (5-Yr)", t: "$2,500", d: "Commodity collapse", c: C.gold }
      ],
      Silver: [
        { h: "1-Week", t: "$48.00", d: "Industrial demand drop" },
        { h: "1-Month", t: "$42.00", d: "Margin liquidation" },
        { h: "3-Month", t: "$38.00", d: "Industrial recession" },
        { h: "1-Year", t: "$32.00", d: "Capex freeze" },
        { h: "2030 (5-Yr)", t: "$30.00", d: "Demand contraction", c: C.blue }
      ],
      Nifty50: [
        { h: "1-Week", t: "23,000", d: "Tariff shock" },
        { h: "1-Month", t: "21,500", d: "Oil premium shock" },
        { h: "3-Month", t: "20,000", d: "FII capitulation" },
        { h: "1-Year", t: "18,500", d: "INR depreciation" },
        { h: "2030 (5-Yr)", t: "16,500", d: "Insolvency wave", c: C.cyan }
      ],
      Nifty500: [
        { h: "1-Week", t: "21,800", d: "Midcap bubble pop" },
        { h: "1-Month", t: "20,200", d: "Leverage unwinding" },
        { h: "3-Month", t: "18,500", d: "SIP pause" },
        { h: "1-Year", t: "16,200", d: "Credit crunch" },
        { h: "2030 (5-Yr)", t: "13,000", d: "Midcap failures", c: C.green }
      ],
      Nasdaq: [
        { h: "1-Week", t: "17,800", d: "Multiple contraction" },
        { h: "1-Month", t: "16,500", d: "WACC rises to 9%" },
        { h: "3-Month", t: "15,200", d: "AI Capex cuts" },
        { h: "1-Year", t: "14,000", d: "Refinancing wall defaults" },
        { h: "2030 (5-Yr)", t: "18,500", d: "Valuation compression", c: C.purple }
      ]
    }
  };

  useEffect(() => {
    (window.smartFetch || fetch)("/api/live")
      .then(r => r.json())
      .then(d => { if (d && d.prices) setLive(d.prices); })
      .catch(() => {});
  }, []);

  const SCENARIO_DATA = {
    Base: {
      fedRate: "3.50% - 3.75%",
      fedStatus: "Hold",
      bondVal: live?.us_10y?.value || 4.47,
      bondChg: live?.us_10y?.change_pct ? `${live.us_10y.change_pct}%` : "+0.49%",
      bondTrend: "up",
      dxyVal: live?.dxy?.value || 99.19,
      dxyChg: live?.dxy?.change_pct ? `${live.dxy.change_pct}%` : "+0.12%",
      crudeVal: live?.crude_wti?.value || 92.23,
      crudeChg: live?.crude_wti?.change_pct ? `${live.crude_wti.change_pct}%` : "+2.77%",
      goldVal: live?.gold_usd?.value || 4515.10,
      goldChg: live?.gold_usd?.change_pct ? `${live.gold_usd.change_pct}%` : "-0.68%",
      gsRatio: live?.gold_silver_ratio?.value || 59.92,
      ngRatio: live?.nifty_gold_ratio?.value || 1.51,
      niftyVal: live?.nifty50?.value || 23382.60,
      niftyChg: live?.nifty50?.change_pct ? `${live.nifty50.change_pct}%` : "-0.96%",
      cmeWatch: { hike: 57, hold: 43, cut: 0 },
      cmeReason: "CPI jumped to 3.8% vs GDP slowdown (2.0%). Hawks push rate hike to preserve inflation control.",
      buffett: "237.8% (Significantly Overvalued)",
      yieldNorm: "+0.47% (Recession Warning: 5-19mo)",
      refiWall: "$368B (41% Zombie Companies)",
      tariff: "Max Tariffs Threat",
      warPremium: "Hormuz blockage risk 15%",
      dma50: "$4,380 (Above DMA)",
      dma200: "$4,150 (Golden Cross)",
      dedollar: "Extreme (BRICS buying)",
      stocks: {
        nvda: { price: live?.nvda?.value || 224.02, val: "Overvalued", valColor: C.red, flow: "Distribution", flowColor: C.red },
        msft: { price: live?.msft?.value || 463.61, val: "Overvalued", valColor: C.red, flow: "Moving Away", flowColor: C.red },
        aapl: { price: live?.aapl?.value || 307.48, val: "Stretched", valColor: C.amber, flow: "Neutral", flowColor: C.amber },
        googl: { price: live?.googl?.value || 378.14, val: "Fair", valColor: C.green, flow: "Adding", flowColor: C.green },
        meta: { price: live?.meta?.value || 605.28, val: "Fair", valColor: C.green, flow: "Neutral", flowColor: C.amber }
      }
    },
    Bull: {
      fedRate: "3.00% - 3.25%",
      fedStatus: "Cuts Started",
      bondVal: (live?.us_10y?.value ? (live.us_10y.value * 0.86).toFixed(2) : 3.85),
      bondChg: "-1.25%",
      bondTrend: "dn",
      dxyVal: (live?.dxy?.value ? (live.dxy.value * 0.96).toFixed(2) : 95.50),
      dxyChg: "-0.85%",
      crudeVal: (live?.crude_wti?.value ? (live.crude_wti.value * 0.85).toFixed(2) : 78.50),
      crudeChg: "-3.40%",
      goldVal: (live?.gold_usd?.value ? (live.gold_usd.value * 1.05).toFixed(2) : 4720.00),
      goldChg: "+1.85%",
      gsRatio: 55.20,
      ngRatio: 1.75,
      niftyVal: (live?.nifty50?.value ? (live.nifty50.value * 1.09).toFixed(2) : 25600.00),
      niftyChg: "+2.15%",
      cmeWatch: { hike: 0, hold: 15, cut: 85 },
      cmeReason: "Inflation drops to 2.8%. Fed pivots early to support economic expansion and credit markets.",
      buffett: "255.4% (Stretched but backed by AI productivity)",
      yieldNorm: "+0.85% (Healthy positive steepening)",
      refiWall: "$368B (Zombies rescued by cheap credit)",
      tariff: "Negotiated Tariffs / Low Impact",
      warPremium: "De-escalating risk <5%",
      dma50: "$4,490 (Bullish Expansion)",
      dma200: "$4,220 (Golden Cross Confirmed)",
      dedollar: "Moderate (Stable Reserves)",
      stocks: {
        nvda: { price: (live?.nvda?.value ? (live.nvda.value * 1.10).toFixed(2) : 245.50), val: "Stretched", valColor: C.amber, flow: "Strong Accumulation", flowColor: C.green },
        msft: { price: (live?.msft?.value ? (live.msft.value * 1.10).toFixed(2) : 510.20), val: "Stretched", valColor: C.amber, flow: "Institutional Inflow", flowColor: C.green },
        aapl: { price: (live?.aapl?.value ? (live.aapl.value * 1.11).toFixed(2) : 340.80), val: "Fair", valColor: C.green, flow: "Adding", flowColor: C.green },
        googl: { price: (live?.googl?.value ? (live.googl.value * 1.09).toFixed(2) : 412.00), val: "Undervalued", valColor: C.green, flow: "Heavy Buying", flowColor: C.green },
        meta: { price: (live?.meta?.value ? (live.meta.value * 1.09).toFixed(2) : 660.10), val: "Fair", valColor: C.green, flow: "Accumulation", flowColor: C.green }
      }
    },
    Bear: {
      fedRate: "4.00% - 4.25%",
      fedStatus: "Forced Hike",
      bondVal: (live?.us_10y?.value ? (live.us_10y.value * 1.15).toFixed(2) : 5.12),
      bondChg: "+3.15%",
      bondTrend: "up",
      dxyVal: (live?.dxy?.value ? (live.dxy.value * 1.06).toFixed(2) : 104.80),
      dxyChg: "+1.65%",
      crudeVal: (live?.crude_wti?.value ? (live.crude_wti.value * 1.19).toFixed(2) : 110.00),
      crudeChg: "+8.90%",
      goldVal: (live?.gold_usd?.value ? (live.gold_usd.value * 1.08).toFixed(2) : 4850.00),
      goldChg: "+4.20%",
      gsRatio: 68.50,
      ngRatio: 1.22,
      niftyVal: (live?.nifty50?.value ? (live.nifty50.value * 0.88).toFixed(2) : 20500.00),
      niftyChg: "-4.80%",
      cmeWatch: { hike: 80, hold: 20, cut: 0 },
      cmeReason: "Crude spike to $110/bbl forces Fed's hand to combat stagflation despite declining GDP (1.2%).",
      buffett: "185.0% (Mean reversion underway)",
      yieldNorm: "+0.12% (Panic Normalization / Crash warning)",
      refiWall: "$368B (46% Zombies heading to default)",
      tariff: "Universal Tariffs (Trade War)",
      warPremium: "Hormuz blockage risk 35%",
      dma50: "$4,210 (Death Cross Threat)",
      dma200: "$4,350 (Breakdown Below DMA)",
      dedollar: "Panic (Central Banks dumping Treasuries)",
      stocks: {
        nvda: { price: (live?.nvda?.value ? (live.nvda.value * 0.83).toFixed(2) : 185.20), val: "Overvalued", valColor: C.red, flow: "Heavy Distribution", flowColor: C.red },
        msft: { price: (live?.msft?.value ? (live.msft.value * 0.84).toFixed(2) : 390.40), val: "Overvalued", valColor: C.red, flow: "Liquidation", flowColor: C.red },
        aapl: { price: (live?.aapl?.value ? (live.aapl.value * 0.81).toFixed(2) : 250.60), val: "Stretched", valColor: C.amber, flow: "Outflow", flowColor: C.red },
        googl: { price: (live?.googl?.value ? (live.googl.value * 0.82).toFixed(2) : 310.80), val: "Fair", valColor: C.green, flow: "Neutral", flowColor: C.amber },
        meta: { price: (live?.meta?.value ? (live.meta.value * 0.82).toFixed(2) : 495.30), val: "Stretched", valColor: C.amber, flow: "Distribution", flowColor: C.red }
      }
    }
  };

  const currentData = SCENARIO_DATA[scenario];

  const goldVal = currentData.goldVal;
  const gsRatio = currentData.gsRatio;
  const ngRatio = currentData.ngRatio;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.t1, fontFamily: "'Inter',system-ui,sans-serif", padding: "16px 20px" }}>
      {/* Title Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.border}`, paddingBottom: 12, marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700 }}>Statistical Macro Cockpit</h1>
          <p style={{ fontSize: 10, color: C.t3, marginTop: 2 }}>Live Market Analytics · Projections & Playbook Horizon Matrix</p>
        </div>

        {/* Global Scenario Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.card2, border: `1px solid ${C.border}`, padding: "6px 12px", borderRadius: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: C.t3, textTransform: "uppercase", letterSpacing: ".05em" }}>Scenario Mode</span>
          <div style={{ display: "flex", gap: 4 }}>
            {["Base", "Bull", "Bear"].map(s => {
              const isActive = scenario === s;
              const bg = s === "Bull" ? C.green : s === "Bear" ? C.red : C.blue;
              return (
                <button key={s} onClick={() => setScenario(s)}
                  style={{
                    background: isActive ? bg : "transparent",
                    color: isActive ? C.bg : C.t2,
                    border: isActive ? `1px solid ${bg}` : `1px solid ${C.border}`,
                    borderRadius: 4, fontSize: 10, fontWeight: 700, padding: "4px 12px",
                    cursor: "pointer", transition: "all 0.2s ease-in-out",
                    boxShadow: isActive ? `0 0 8px ${bg}88` : "none"
                  }}>
                  {s.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid: 3 Major Sections */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
        
        {/* SECTION 1: Fed Rate & Macro Metrics */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: C.blue, borderBottom: `1px solid ${C.border}`, paddingBottom: 6, marginBottom: 12 }}>🏛️ Fed & Global Macro Matrix</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
            <StatCard title="Current Fed Rate" val={currentData.fedRate} sub={`Status: ${currentData.fedStatus}`} />
            <StatCard title="US 10Y Bond" val={`${currentData.bondVal}%`} change={currentData.bondChg} trend={currentData.bondTrend} sub="Inverted yield curve" />
            <StatCard title="US Dollar Index" val={currentData.dxyVal} change={currentData.dxyChg} sub="Global FX Pressure" />
            <StatCard title="Crude WTI" val={`$${currentData.crudeVal}`} change={currentData.crudeChg} sub="Hormuz Geopolitics" />
          </div>

          <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, marginBottom: 12 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.t2, textTransform: "uppercase", marginBottom: 8 }}>June 16 Decisions CME FedWatch</p>
            {currentData.cmeWatch.hike > 0 && <ProgressBar label="Rate Hike (+25bps)" val={currentData.cmeWatch.hike} max={100} color={C.red} />}
            {currentData.cmeWatch.hold > 0 && <ProgressBar label="Rate Hold (No change)" val={currentData.cmeWatch.hold} max={100} color={C.amber} />}
            {currentData.cmeWatch.cut > 0 && <ProgressBar label="Rate Cut (-25bps)" val={currentData.cmeWatch.cut} max={100} color={C.green} />}
            <p style={{ fontSize: 9, color: C.t3, marginTop: 6 }}>Solid Reason: {currentData.cmeReason}</p>
          </div>

          <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.t2, textTransform: "uppercase", marginBottom: 6 }}>Latest Related Indicators</p>
            <table style={{ width: "100%", fontSize: 10, borderCollapse: "collapse" }}>
              <tbody>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}><td style={{ padding: "4px 0", color: C.t3 }}>Buffett Indicator</td><td style={{ textAlign: "right", fontWeight: 600, color: C.red }}>{currentData.buffett}</td></tr>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}><td style={{ padding: "4px 0", color: C.t3 }}>Yield Curve Normalization</td><td style={{ textAlign: "right", fontWeight: 600, color: C.amber }}>{currentData.yieldNorm}</td></tr>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}><td style={{ padding: "4px 0", color: C.t3 }}>Russell 2000 Refi Wall</td><td style={{ textAlign: "right", fontWeight: 600, color: C.red }}>{currentData.refiWall}</td></tr>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}><td style={{ padding: "4px 0", color: C.t3 }}>Trump Tariff Factor</td><td style={{ textAlign: "right", fontWeight: 600, color: C.amber }}>{currentData.tariff}</td></tr>
                <tr><td style={{ padding: "4px 0", color: C.t3 }}>War Premium</td><td style={{ textAlign: "right", fontWeight: 600, color: C.red }}>{currentData.warPremium}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 2: Gold Statistical Analysis & Technicals */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: C.purple, borderBottom: `1px solid ${C.border}`, paddingBottom: 6, marginBottom: 12 }}>🥇 Gold & Index Projection Model</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
            <StatCard title="Gold Spot" val={`$${goldVal}`} sub="Base support: $4,100" />
            <StatCard title="Gold/Silver Ratio" val={gsRatio} sub="Under 60 = Silver outruns" />
            <StatCard title="Nifty/Gold Ratio" val={ngRatio} sub="1.48 = Nifty dropped" />
            <StatCard title="CB Flow Q1" val="244 tonnes" sub="Govt Reserves Flow" />
          </div>

          <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, marginBottom: 12 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.t2, textTransform: "uppercase", marginBottom: 6 }}>Technical Signals</p>
            <table style={{ width: "100%", fontSize: 10, borderCollapse: "collapse" }}>
              <tbody>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}><td style={{ padding: "4px 0", color: C.t3 }}>50-day DMA</td><td style={{ textAlign: "right", fontWeight: 600, color: C.green }}>{currentData.dma50}</td></tr>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}><td style={{ padding: "4px 0", color: C.t3 }}>200-day DMA</td><td style={{ textAlign: "right", fontWeight: 600, color: C.green }}>{currentData.dma200}</td></tr>
                <tr><td style={{ padding: "4px 0", color: C.t3 }}>De-dollarization Trend</td><td style={{ textAlign: "right", fontWeight: 600, color: C.purple }}>{currentData.dedollar}</td></tr>
              </tbody>
            </table>
          </div>

          <div style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: C.t2, textTransform: "uppercase" }}>Projection Targets (2030 Consensus)</p>
              <div style={{ display: "flex", gap: 4 }}>
                {Object.keys(SCENARIOS[scenario]).map(t => (
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
                  <th style={{ textAlign: "right" }}>Drivers / Catalyst</th>
                </tr>
              </thead>
              <tbody>
                {SCENARIOS[scenario][projTab].map((p, i) => (
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
            <div style={{ background: scenario === 'Bear' ? C.redbg : scenario === 'Bull' ? C.greenbg : C.amberbg,
              color: scenario === 'Bear' ? C.red : scenario === 'Bull' ? C.green : C.amber,
              padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 700,
              border: `1px solid ${scenario === 'Bear' ? C.red : scenario === 'Bull' ? C.green : C.amber}` }}>
              VERDICT: {scenario === 'Bear' ? "CRITICAL SQUEEZE" : scenario === 'Bull' ? "LIQUIDITY EXPANSION" : "STRETCHED VALUATIONS"}
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
              <tr style={{ borderBottom: `1px solid ${C.border}` }}><td style={{ padding: "4px 0", fontWeight: 600 }}>NVDA</td><td style={{ textAlign: "right" }}>${currentData.stocks.nvda.price}</td><td style={{ textAlign: "right", color: currentData.stocks.nvda.valColor }}>{currentData.stocks.nvda.val}</td><td style={{ textAlign: "right", color: currentData.stocks.nvda.flowColor }}>{currentData.stocks.nvda.flow}</td></tr>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}><td style={{ padding: "4px 0", fontWeight: 600 }}>MSFT</td><td style={{ textAlign: "right" }}>${currentData.stocks.msft.price}</td><td style={{ textAlign: "right", color: currentData.stocks.msft.valColor }}>{currentData.stocks.msft.val}</td><td style={{ textAlign: "right", color: currentData.stocks.msft.flowColor }}>{currentData.stocks.msft.flow}</td></tr>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}><td style={{ padding: "4px 0", fontWeight: 600 }}>AAPL</td><td style={{ textAlign: "right" }}>${currentData.stocks.aapl.price}</td><td style={{ textAlign: "right", color: currentData.stocks.aapl.valColor }}>{currentData.stocks.aapl.val}</td><td style={{ textAlign: "right", color: currentData.stocks.aapl.flowColor }}>{currentData.stocks.aapl.flow}</td></tr>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}><td style={{ padding: "4px 0", fontWeight: 600 }}>GOOGL</td><td style={{ textAlign: "right" }}>${currentData.stocks.googl.price}</td><td style={{ textAlign: "right", color: currentData.stocks.googl.valColor }}>{currentData.stocks.googl.val}</td><td style={{ textAlign: "right", color: currentData.stocks.googl.flowColor }}>{currentData.stocks.googl.flow}</td></tr>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}><td style={{ padding: "4px 0", fontWeight: 600 }}>META</td><td style={{ textAlign: "right" }}>${currentData.stocks.meta.price}</td><td style={{ textAlign: "right", color: currentData.stocks.meta.valColor }}>{currentData.stocks.meta.val}</td><td style={{ textAlign: "right", color: currentData.stocks.meta.flowColor }}>{currentData.stocks.meta.flow}</td></tr>
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
