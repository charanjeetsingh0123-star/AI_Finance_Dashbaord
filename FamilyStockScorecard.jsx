import { useState } from "react";

const S = {
  bg: "#09090b", card: "#111111", border: "#27272a", card2: "#1a1a1a",
  t1: "#f4f4f5", t2: "#a1a1aa", t3: "#52525b",
  red: "#ef4444", redbg: "rgba(239,68,68,0.1)",
  amber: "#f59e0b", amberbg: "rgba(245,158,11,0.1)",
  green: "#22c55e", greenbg: "rgba(34,197,94,0.1)",
  blue: "#60a5fa", bluebg: "rgba(96,165,250,0.1)",
  cyan: "#06b6d4", cyanbg: "rgba(6,182,212,0.1)",
  purple: "#a78bfa", purplebg: "rgba(167,139,250,0.1)",
};

const Pill = ({ label, color, bg }) => (
  <span style={{ background: bg, color, border: `1px solid ${color}30`, borderRadius: 20, fontSize: 10, fontWeight: 600, padding: "2px 8px", whiteSpace: "nowrap" }}>{label}</span>
);

const Row = ({ name, who, pl, plColor, reason, verdict }) => (
  <tr 
    style={{ borderBottom: `1px solid ${S.border}`, transition: "background 0.2s ease" }}
    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
  >
    <td style={{ padding: "10px 14px", fontWeight: 500, color: S.t1, fontSize: 12, whiteSpace: "nowrap" }}>{name}</td>
    <td style={{ padding: "10px 14px", fontSize: 11, color: S.t2 }}>{who}</td>
    <td style={{ padding: "10px 14px", fontSize: 11, color: plColor || S.t2, whiteSpace: "nowrap", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{pl}</td>
    <td style={{ padding: "10px 14px", fontSize: 11, color: S.t2, lineHeight: 1.5 }}>{reason}</td>
    <td style={{ padding: "10px 14px", textAlign: "right" }}>{verdict}</td>
  </tr>
);

const Section = ({ title, color, children }) => (
  <div style={{ marginBottom: 24 }}>
    <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em", color, marginBottom: 8 }}>{title}</p>
    <div style={{ border: `1px solid ${S.border}`, borderRadius: 12, overflow: "hidden", background: S.bg, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ background: S.card }}>
            {["Stock / Fund", "Who", {name:"P&L", align:"right"}, "Reason (macro + fundamental)", {name:"Verdict", align:"right"}].map((h, i) => (
              <th key={i} style={{ padding: "8px 14px", textAlign: typeof h === 'object' ? h.align : "left", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", color: S.t3, borderBottom: `1px solid ${S.border}` }}>
                {typeof h === 'object' ? h.name : h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  </div>
);

const Alert = ({ color, bg, children }) => (
  <div style={{ borderLeft: `2px solid ${color}`, background: bg, borderRadius: 8, padding: "8px 12px", marginBottom: 6, fontSize: 11, color: S.t2, lineHeight: 1.5 }}>{children}</div>
);

const MetroCard = ({ label, value, valueColor, sub }) => (
  <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 12, padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
    <p style={{ fontSize: 10, color: S.t3, marginBottom: 6, textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 }}>{label}</p>
    <p style={{ fontSize: 20, fontWeight: 700, color: valueColor || S.t1, marginBottom: 4 }}>{value}</p>
    <p style={{ fontSize: 11, color: S.t2, lineHeight: 1.4 }}>{sub}</p>
  </div>
);

const TABS = ["Overview", "SELL NOW", "SELL RALLY", "HOLD", "BUY / ADD", "Mutual Funds", "Actions"];

export default function Scorecard() {
  const [tab, setTab] = useState(0);
  const [live, setLive] = useState(null);

  useEffect(() => {
    (window.smartFetch || fetch)("/api/live")
      .then(r => r.json())
      .then(d => {
        if (d && d.prices) setLive(d.prices);
      })
      .catch(() => {});
  }, []);

  const goldVal = live?.gold_usd?.value || 4593.00;
  const silverVal = live?.silver_usd?.value || 75.88;
  const crudeVal = live?.crude_wti?.value || 87.36;
  const bondVal = live?.us_10y?.value || 4.45;
  const dxyVal = live?.dxy?.value || 98.91;
  const gsRatio = live?.gold_silver_ratio?.value || 60.53;
  const ngRatio = live?.nifty_gold_ratio?.value || 1.68;

  return (
    <div style={{ minHeight: "100vh", background: S.bg, color: S.t1, fontFamily: "'Inter',system-ui,sans-serif", padding: "0 0 60px" }}>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${S.border}`, padding: "16px 20px", background: "rgba(9,9,11,.85)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: S.t1, letterSpacing: ".01em" }}>Family Portfolio Scorecard</p>
        <p style={{ fontSize: 11, color: S.t3, marginTop: 2 }}>Charanjeet · Prabhdeep · Surjit — Data 22 May 2026 · 60-yr macro analysis</p>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 6, padding: "12px 20px", borderBottom: `1px solid ${S.border}`, overflowX: "auto" }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            style={{ padding: "6px 16px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s ease",
              background: tab === i ? S.t1 : "transparent", color: tab === i ? S.bg : S.t2,
              border: `1px solid ${tab === i ? S.t1 : S.border}` }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ padding: "16px 20px", maxWidth: 1100, margin: "0 auto" }}>

        {/* ── TAB 0: OVERVIEW ── */}
        {tab === 0 && <>
          <p style={{ fontSize: 11, color: S.t3, marginBottom: 12 }}>4 macro triggers read from 60-year chart driving every verdict below</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 8, marginBottom: 16 }}>
            <MetroCard label={`Oil $${crudeVal} WTI`} value={crudeVal > 95 ? "INDIA PAIN" : "STABLE"} valueColor={crudeVal > 95 ? S.red : S.green} sub="CAD widens → INR falls → FII exits → Nifty drag" />
            <MetroCard label={`US Bond 10Y ${bondVal}%`} value={bondVal > 4.2 ? "IT RISK" : "STABLE"} valueColor={bondVal > 4.2 ? S.amber : S.green} sub="US slowdown → IT revenue cuts → TCS/HCL headwind" />
            <MetroCard label={`Gold $${goldVal} Spot`} value="YOUR EDGE" valueColor={S.green} sub="Fiscal dominance confirmed. 43.6% gold = best family positioning" />
            <MetroCard label={`DXY ${dxyVal} · Fed 3.625%`} value={dxyVal > 103 ? "RISK OFF" : "WATCH"} valueColor={dxyVal > 103 ? S.red : S.blue} sub="Strong $ = EM headwind. More Fed cuts → gold next leg up" />
          </div>

          <div style={{ background: S.card2, border: `0.5px solid ${S.border}`, borderRadius: 10, padding: 16, marginBottom: 16, display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: S.t1, marginBottom: 8 }}>Portfolio Health Snowflake</p>
              <p style={{ fontSize: 11, color: S.t2, lineHeight: 1.5 }}>Simply Wall St style multi-axis representation of family portfolio composition vs macro conditions.</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <Pill label="Value: 4/6" color={S.amber} bg={S.amberbg} />
                <Pill label="Future: 3/6" color={S.red} bg={S.redbg} />
                <Pill label="Past: 5/6" color={S.green} bg={S.greenbg} />
                <Pill label="Health: 6/6" color={S.cyan} bg={S.cyanbg} />
              </div>
            </div>
            <div style={{ width: 200, height: 180 }}>
              {typeof Recharts !== 'undefined' && Recharts.RadarChart && (
                <Recharts.ResponsiveContainer width="100%" height="100%">
                  <Recharts.RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                    { axis: 'Value', score: 4 },
                    { axis: 'Future', score: 3 },
                    { axis: 'Past', score: 5 },
                    { axis: 'Health', score: 6 },
                    { axis: 'Dividend', score: 2 }
                  ]}>
                    <Recharts.PolarGrid stroke={S.border} />
                    <Recharts.PolarAngleAxis dataKey="axis" tick={{ fill: S.t2, fontSize: 9 }} />
                    <Recharts.PolarRadiusAxis angle={30} domain={[0, 6]} tick={false} axisLine={false} />
                    <Recharts.Radar name="Portfolio" dataKey="score" stroke={S.blue} fill={S.blue} fillOpacity={0.4} />
                  </Recharts.RadarChart>
                </Recharts.ResponsiveContainer>
              )}
            </div>
          </div>

          <Alert color={S.amber} bg={S.amberbg}>
            <strong style={{ color: S.amber }}>Hormuz Crisis & Oil:</strong> At ${crudeVal} WTI, India's CAD widens. But Iran loses $100M+ per closed day. A ceasefire could quickly crash oil to $75, dropping CPI to 3% and triggering Fed cuts.
          </Alert>
          <Alert color={S.amber} bg={S.amberbg}>
            <strong style={{ color: S.amber }}>INR outlook from 60-yr DXY + Oil chart:</strong> ₹86–88/$ near term (6–9 months) · ₹90–95/$ medium term (2–3 yrs). No crash — structural 5–7%/yr depreciation. Your USD holdings (GLD, BRK.B, TMUS) are a natural hedge. Do not sell them.
          </Alert>
          <Alert color={S.red} bg={S.redbg}>
            <strong style={{ color: S.red }}>US Market Risk:</strong> Top 10 stocks now 44% of S&P 500 (worse than dot-com). S&P is 70% above trend. Smart money is exiting speculative AI tech.
          </Alert>
          <Alert color={S.red} bg={S.redbg}>
            <strong style={{ color: S.red }}>Family overlap risk:</strong> Kaynes Technology, HDFC Bank, GAIL, Amara Raja, Reliance, Container Corp held by ALL 3 members. Kaynes → sell all. GAIL + Container Corp → keep only Charanjeet, exit duplicates. Reduces concentration risk.
          </Alert>
          <Alert color={S.green} bg={S.greenbg}>
            <strong style={{ color: S.green }}>Your strongest signal from charts:</strong> Gold/Silver ratio {gsRatio} (near 20-yr low) = silver to outperform gold by 30–50% over next 18 months. Nifty/Gold ratio {ngRatio} = Nifty cheapest vs gold in 10 years = gradual Nifty re-entry window NOW.
          </Alert>
          <Alert color={S.green} bg={S.greenbg}>
            <strong style={{ color: S.green }}>The Kevin Warsh Fed Test:</strong> When Warsh was nominated, gold fell 15% to $4,098. It has since recovered to ${goldVal}. The structural bull survived the test. CBs bought 244 tonnes in Q1 2026. Your 43.6% gold allocation is a proven edge.
          </Alert>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 12 }}>
            {[
              { label: "Bull 35% chance", color: S.green, text: "Iran deal → oil $70 → Fed cuts → Gold $5,500+ → Nifty 30,000 Dec 2026 · Portfolio +40%" },
              { label: "Base 50% chance", color: S.amber, text: "Oil $85–100 · Nifty 24–27K · Gold $4,200–5,000 · INR ₹86–88 · Portfolio flat to +15%. Gold saves you, IT drags." },
              { label: "Bear 15% chance", color: S.red, text: "US recession + oil $110+ → Nifty 19–21K · INR ₹90+. BUT Gold hits $5,500–6,000. Your 43.6% gold = you survive better than 90% of investors." },
            ].map(s => (
              <div key={s.label} style={{ background: S.card, border: `0.5px solid ${S.border}`, borderTop: `2px solid ${s.color}`, borderRadius: 10, padding: "10px 12px" }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: s.color, marginBottom: 4 }}>{s.label}</p>
                <p style={{ fontSize: 11, color: S.t2, lineHeight: 1.5 }}>{s.text}</p>
              </div>
            ))}
          </div>
        </>}

        {/* ── TAB 1: SELL NOW ── */}
        {tab === 1 && <Section title="⛔ Exit immediately — no waiting" color={S.red}>
          <Row name="Vodafone Idea" who="Prabhdeep" pl="~−90%" plColor={S.red} reason="Near bankruptcy. Zero FCF. No 5G spectrum. Promoter diluted. Book loss for tax offset today." verdict={<Pill label="EXIT NOW" color={S.red} bg={S.redbg} />} />
          <Row name="C.E. Info Systems" who="CS · PK" pl="−41%" plColor={S.red} reason="GIS/Maps. US clients cutting tech spend (high US bonds = capex freeze). PE 60x for declining revenue. No catalyst in sight." verdict={<Pill label="EXIT NOW" color={S.red} bg={S.redbg} />} />
          <Row name="Kaynes Technology" who="ALL 3 members" pl="−12 to −17%" plColor={S.red} reason="PE 80x+. Electronics cycle down. China PCB dumping. Triple family concentration = extreme risk. Overvalued for current macro. Weak cash flow." verdict={<Pill label="EXIT ALL 3" color={S.red} bg={S.redbg} />} />
          <Row name="Jyoti CNC Automation" who="CS · PK" pl="−26%" plColor={S.red} reason="CNC machining. Auto + EV order slowdown. Capex-heavy, debt rising. PE 70x. No margin of safety." verdict={<Pill label="EXIT NOW" color={S.red} bg={S.redbg} />} />
          <Row name="Asian Paints" who="Prabhdeep" pl="−7,100" plColor={S.red} reason="Oil $106 = raw material nightmare (70% petrochem inputs). Margin destruction 200–250bps. PE 50x+ expensive. Birla Opus eating market share. Loss deepens." verdict={<Pill label="EXIT NOW" color={S.red} bg={S.redbg} />} />
          <Row name="IndusInd Bank" who="Surjit" pl="loss" plColor={S.red} reason="Governance red flag (CFO change). Microfinance NPA rising. Vehicle finance stress. Promoter pledging. Move to HDFC Bank instead." verdict={<Pill label="EXIT NOW" color={S.red} bg={S.redbg} />} />
          <Row name="Lodha Developers" who="Prabhdeep" pl="loss" plColor={S.red} reason="Debt-heavy builder. Interest-rate sensitive. UK operations drag. At $106 oil + INR weakness, discretionary real estate softens." verdict={<Pill label="EXIT NOW" color={S.red} bg={S.redbg} />} />
          <Row name="Utkarsh SFB" who="Charanjeet" pl="tiny" plColor={S.red} reason="Microfinance stress across sector. NPA rising. SFB under RBI scrutiny. Tiny position — no reason to hold." verdict={<Pill label="EXIT NOW" color={S.red} bg={S.redbg} />} />
          <Row name="Genpharmasec · Filatex · Redtape" who="Charanjeet" pl="tiny" plColor={S.t3} reason="Micro positions, no moat, no conviction thesis. Portfolio noise. Exit all, redeploy to high-conviction ideas." verdict={<Pill label="CLEAN UP" color={S.red} bg={S.redbg} />} />
        </Section>}

        {/* ── TAB 2: SELL ON RALLY ── */}
        {tab === 2 && <Section title="⚠️ Sell on next 5–10% bounce — do not average down" color={S.amber}>
          <Row name="TCS" who="CS · PK" pl="−13.7%" plColor={S.red} reason="US spending freeze from tariffs + high bond yields. IT project delays. PE 25x expensive for slowing revenue. Sell bounce, rotate to Nifty Index." verdict={<Pill label="SELL RALLY" color={S.amber} bg={S.amberbg} />} />
          <Row name="HCL Technologies" who="SK · CS" pl="loss" plColor={S.red} reason="Same US IT headwind. Enterprise clients pausing. Sell on any 8%+ recovery." verdict={<Pill label="SELL RALLY" color={S.amber} bg={S.amberbg} />} />
          <Row name="Wipro" who="SK · PK" pl="loss" plColor={S.red} reason="Weakest of Big 4 IT. Revenue near zero growth. No AI differentiation. Exit on bounce." verdict={<Pill label="SELL RALLY" color={S.amber} bg={S.amberbg} />} />
          <Row name="Infosys (Groww)" who="Charanjeet" pl="−12%" plColor={S.red} reason="Same IT thesis. Sell on any 8%+ bounce." verdict={<Pill label="SELL RALLY" color={S.amber} bg={S.amberbg} />} />
          <Row name="Jio Financial Services" who="Charanjeet" pl="−125" plColor={S.red} reason="No revenue yet. Pure speculation. At high oil + rising US yields, speculation premium shrinks. Sell on Reliance news rally." verdict={<Pill label="SELL RALLY" color={S.amber} bg={S.amberbg} />} />
          <Row name="Exide Industries" who="Charanjeet" pl="~0%" plColor={S.t3} reason="Losing EV battery race to Amara Raja. Lead-acid fading. You already hold Amara Raja — no need for both. Switch proceeds to Amara." verdict={<Pill label="SWITCH→AMARA" color={S.amber} bg={S.amberbg} />} />
          <Row name="Adani Energy Solutions" who="Surjit" pl="+3,829" plColor={S.green} reason="Book 60% profit. Adani group leverage risk elevated. Transmission biz is good but macro headwinds. Keep 40% stake only." verdict={<Pill label="PARTIAL 60%" color={S.amber} bg={S.amberbg} />} />
          <Row name="IRB Infra · Patel Engg · Ircon" who="Charanjeet" pl="small" plColor={S.t3} reason="Infrastructure contractors: high leverage, thin margins, slow payment cycles. Hold NHPC (quality). Exit these contractors on bounce." verdict={<Pill label="SELL RALLY" color={S.amber} bg={S.amberbg} />} />
          <Row name="GAIL (duplicates)" who="SK · PK" pl="flat" plColor={S.t3} reason="All 3 hold GAIL. Keep only Charanjeet's. Sell Surjit + Prabhdeep duplicates. GAIL is a hold — just not 3x concentrated." verdict={<Pill label="REDUCE DUPE" color={S.amber} bg={S.amberbg} />} />
          <Row name="Container Corp (duplicates)" who="SK · PK" pl="small gain" plColor={S.green} reason="Same logic. All 3 hold. Keep Charanjeet only. Exit others on strength." verdict={<Pill label="REDUCE DUPE" color={S.amber} bg={S.amberbg} />} />
          <Row name="PG Electroplast · Himadri Chem" who="Surjit" pl="small" plColor={S.t3} reason="Niche, illiquid, small cap. Book whatever exists. Redeploy to high-conviction ideas." verdict={<Pill label="EXIT CLEAN" color={S.amber} bg={S.amberbg} />} />
          <Row name="Nifty IT ETF (Nippon)" who="Charanjeet" pl="−13.7%" plColor={S.red} reason="ETF = diversified IT risk but same headwind. If not locked, switch to Nifty 50 Index. US recovery in 18 months = wait if long-term." verdict={<Pill label="SWITCH OR WAIT" color={S.amber} bg={S.amberbg} />} />
        </Section>}

        {/* ── TAB 3: HOLD ── */}
        {tab === 3 && <Section title="✅ Hold with conviction — macro supports these" color={S.green}>
          <Row name="ALL Gold ETFs" who="ALL 3 members" pl="+80%+" plColor={S.green} reason="Fiscal dominance era. $36T US debt → printing inevitable → gold structural bull. Central banks globally buying. DO NOT SELL any gold holding." verdict={<Pill label="HOLD ALL" color={S.green} bg={S.greenbg} />} />
          <Row name="HDFC Bank" who="ALL 3" pl="slight loss" plColor={S.amber} reason="India's best bank. 1.8x P/B reasonable. RBI cutting rates = NIM expansion. Buy more on dips below ₹1,650. Quality franchise." verdict={<Pill label="HOLD + BUY DIP" color={S.green} bg={S.greenbg} />} />
          <Row name="Bharti Airtel" who="Charanjeet" pl="+271" plColor={S.green} reason="ARPU ₹209 → target ₹250+. Telecom duopoly. Africa growth. 5G monetisation. Defensive in slowdown. Strong cash flow." verdict={<Pill label="HOLD" color={S.green} bg={S.greenbg} />} />
          <Row name="Reliance Industries" who="ALL 3" pl="~flat" plColor={S.t3} reason="Diversified: O2C, Jio, Retail, New Energy. PE 22x fair. INR weakness helps O2C exports. Reduce Surjit holding if concentrated." verdict={<Pill label="HOLD" color={S.green} bg={S.greenbg} />} />
          <Row name="Amara Raja Energy" who="ALL 3" pl="+gain" plColor={S.green} reason="Battery tech leader. EV + data centre UPS demand. Strong book value. Better than Exide. Keep all 3 members." verdict={<Pill label="HOLD ALL" color={S.green} bg={S.greenbg} />} />
          <Row name="Siemens India" who="PK · others" pl="−305" plColor={S.amber} reason="Capital goods. India infra + manufacturing cycle. Premium PE (40x) justified for execution quality. Long-term hold." verdict={<Pill label="HOLD" color={S.green} bg={S.greenbg} />} />
          <Row name="Waaree Energies" who="Charanjeet" pl="+1,024" plColor={S.green} reason="Solar EPC leader. PLI + renewable mandate. Export tailwind. Strong order book. Ride the energy transition wave." verdict={<Pill label="HOLD" color={S.green} bg={S.greenbg} />} />
          <Row name="Transformers & Rectifiers" who="Charanjeet" pl="+3,354" plColor={S.green} reason="Power infra demand exploding (AI data centres + grid expansion). Right place, right time. Hold." verdict={<Pill label="HOLD" color={S.green} bg={S.greenbg} />} />
          <Row name="NHPC" who="Charanjeet" pl="slight loss" plColor={S.amber} reason="Hydro power = clean, steady. Undervalued vs solar. Govt capex on hydro rising. Accumulate at dips." verdict={<Pill label="HOLD + ADD" color={S.green} bg={S.greenbg} />} />
          <Row name="Sona BLW Precision" who="CS · PK" pl="+gain" plColor={S.green} reason="EV drivetrain components. Export to global OEMs. Quality management. 2–3 year story intact." verdict={<Pill label="HOLD" color={S.green} bg={S.greenbg} />} />
          <Row name="Adani Ports" who="Prabhdeep" pl="+gain" plColor={S.green} reason="Physical port infra = irreplaceable monopoly. Iran war rerouting increases India port traffic." verdict={<Pill label="HOLD" color={S.green} bg={S.greenbg} />} />
          <Row name="Coal India" who="Surjit" pl="+gain" plColor={S.green} reason="8%+ dividend yield. India still 55% coal-dependent. Cash cow. Pure income stock for Surjit's portfolio." verdict={<Pill label="HOLD" color={S.green} bg={S.greenbg} />} />
          <Row name="ITC Ltd" who="Surjit" pl="−6,783" plColor={S.red} reason="FMCG defensive + ITC Hotels demerger value unlock. Cigarette cash machine. At ₹400 range = fair value. Don't panic on paper loss." verdict={<Pill label="HOLD" color={S.green} bg={S.greenbg} />} />
          <Row name="Dr Reddy's Labs" who="PK · CS" pl="+4,170" plColor={S.green} reason="US generic pharma + biosimilars. INR weakness = export gain. FDA clearances on track. Defensive in global slowdown." verdict={<Pill label="HOLD" color={S.green} bg={S.greenbg} />} />
          <Row name="CG Power" who="Prabhdeep" pl="+gain" plColor={S.green} reason="Defence + power electronics. Promoter turnaround complete. Strong order book. Long-term hold." verdict={<Pill label="HOLD" color={S.green} bg={S.greenbg} />} />
          <Row name="US Stocks: BRK.B · TMUS · GLD" who="Charanjeet" pl="small" plColor={S.t3} reason="BRK.B = Buffett defensive. TMUS = telecom cash flow. GLD = gold in USD = natural INR hedge. Hold all. INR falling to ₹88–95 = these gain automatically." verdict={<Pill label="HOLD ALL" color={S.green} bg={S.greenbg} />} />
          <Row name="Netflix (NFLX)" who="Charanjeet" pl="+gain" plColor={S.green} reason="Streaming monopoly. Ad-supported tier growing. AI content cost reduction. Hold small USD position." verdict={<Pill label="HOLD" color={S.green} bg={S.greenbg} />} />
        </Section>}

        {/* ── TAB 4: BUY ── */}
        {tab === 4 && <>
          <Alert color={S.cyan} bg={S.cyanbg}><strong style={{ color: S.cyan }}>Two strongest signals from our charts right now:</strong> (1) Gold/Silver ratio {gsRatio} = silver outperforms next 18 months. (2) Nifty/Gold ratio {ngRatio} = Nifty historically cheap vs gold = gradual re-entry window.</Alert>
          <Section title="🟢 Add more — macro alignment strongest here" color={S.blue}>
            <Row name="Silver ETF (Nippon / Zerodha)" who="ALL 3 members" pl="tiny now" plColor={S.t3} reason={`Gold/Silver ratio ${gsRatio} — near 20-yr low. From 60yr chart: every time ratio < 60, silver outperforms gold 30–50% in next 18 months. Add 5% of portfolio each member NOW.`} verdict={<Pill label="BUY NOW" color={S.cyan} bg={S.cyanbg} />} />
            <Row name="Nifty 50 Index ETF (UTI / Nippon)" who="ALL 3 members" pl="not held" plColor={S.t3} reason={`Nifty/Gold at ${ngRatio} vs 3.66 (Dec 2024) = Nifty cheapest vs gold in 10 years. Start SIP ₹5,000/month each member. 3-yr target: Nifty 32,000–38,000.`} verdict={<Pill label="SIP START" color={S.blue} bg={S.bluebg} />} />
            <Row name="HDFC Bank (on dips)" who="ALL 3 members" pl="held" plColor={S.t3} reason="Every member holds at slight loss. If HDFC falls to ₹1,600–1,650, add 25% more. India's JPMorgan equivalent. RBI rate cuts = NIM expansion catalyst." verdict={<Pill label="ADD ON DIP" color={S.blue} bg={S.bluebg} />} />
            <Row name="Power Grid Corporation" who="CS or PK" pl="not held" plColor={S.t3} reason="AI data centres + EV charging = mandatory grid upgrades. Quasi-sovereign. PE 16x, dividend 5%+. Strong book value. Capital-light transmission biz." verdict={<Pill label="BUY" color={S.blue} bg={S.bluebg} />} />
            <Row name="NTPC / NTPC Green Energy" who="Any member" pl="not held" plColor={S.t3} reason={`Energy transition. 50GW+ renewable target. Oil at $${crudeVal} accelerates switch from coal. Govt backing. Undervalued vs sector peers.`} verdict={<Pill label="BUY" color={S.blue} bg={S.bluebg} />} />
            <Row name="Bharat Electronics (BEL)" who="CS or PK" pl="not held" plColor={S.t3} reason="Defence exports booming. Iran war = global defence spend surge. Order book ₹70,000Cr+. PE 35x justified for quality defence + electronics combo." verdict={<Pill label="BUY" color={S.blue} bg={S.bluebg} />} />
            <Row name="Bajaj Finance" who="Surjit" pl="partial held" plColor={S.t3} reason="India's best NBFC. RBI cutting = NIM expansion + lower borrowing cost. India consumption credit = structural demand. Expensive but worth it." verdict={<Pill label="ADD" color={S.blue} bg={S.bluebg} />} />
          </Section>
        </>}

        {/* ── TAB 5: MUTUAL FUNDS ── */}
        {tab === 5 && <>
          <Section title="CHARANJEET — ELSS & Other MFs" color={S.green}>
            <Row name="Mirae Asset ELSS" who="CS" pl="+35%" plColor={S.green} reason="Best ELSS performer. ELSS lock-in active. Hold till maturity, then SWP." verdict={<Pill label="HOLD" color={S.green} bg={S.greenbg} />} />
            <Row name="Quant ELSS" who="CS" pl="+15.1%" plColor={S.green} reason="Quant momentum model works. Hold." verdict={<Pill label="HOLD" color={S.green} bg={S.greenbg} />} />
            <Row name="Tata ELSS" who="CS" pl="+48%" plColor={S.green} reason="Best 3yr return in ELSS stable. Hold." verdict={<Pill label="HOLD" color={S.green} bg={S.greenbg} />} />
            <Row name="Bandhan ELSS + DSP ELSS + Axis ELSS" who="CS" pl="+44 / +46 / +35%" plColor={S.green} reason="All strong. All ELSS locked. Hold." verdict={<Pill label="HOLD ALL" color={S.green} bg={S.greenbg} />} />
            <Row name="Tata Digital India Fund" who="CS" pl="+2.8%" plColor={S.amber} reason="IT sector fund. US recession risk = underperform next 12 months. If unlocked → switch to Nifty 50 Index. If locked → hold and wait for IT cycle recovery." verdict={<Pill label="SWITCH if unlocked" color={S.amber} bg={S.amberbg} />} />
            <Row name="SBI Multi Asset Allocation" who="CS" pl="+14%" plColor={S.green} reason="Holds equity + debt + gold. Gold inside = good. Diversified. Hold." verdict={<Pill label="HOLD" color={S.green} bg={S.greenbg} />} />
          </Section>
          <Section title="PRABHDEEP — MFs" color={S.amber}>
            <Row name="Quant Flexi Cap" who="PK" pl="+gain" plColor={S.green} reason="Good model. Check if DIRECT plan. If Regular → switch to Direct immediately. Saves 0.5–1%/yr in expense ratio." verdict={<Pill label="CHECK → DIRECT" color={S.amber} bg={S.amberbg} />} />
            <Row name="DSP Healthcare Fund" who="PK" pl="+8,300 (+23%)" plColor={S.green} reason="Book 50% profit now. US recession = generic pharma export slow. Healthcare valuations stretched. Redeploy into Nifty 50 Index SIP." verdict={<Pill label="PARTIAL EXIT 50%" color={S.amber} bg={S.amberbg} />} />
            <Row name="ABSL PSU Equity Fund" who="PK · SK" pl="+good" plColor={S.green} reason="PSU rally 2021–2024 exceptional. Valuations stretched now. Book 60% and switch to Mirae Asset Large & Midcap or Nifty 50 Index." verdict={<Pill label="BOOK 60% + SWITCH" color={S.amber} bg={S.amberbg} />} />
            <Row name="Motilal Oswal Midcap" who="PK" pl="−1,800" plColor={S.red} reason="Midcap expensive at current levels. High PE universe. Don't average down. Switch to Mirae Asset Large & Midcap (diversified, proven)." verdict={<Pill label="SWITCH → Mirae L&MC" color={S.amber} bg={S.amberbg} />} />
          </Section>
          <Section title="SURJIT — MFs" color={S.purple}>
            <Row name="Nippon India Gold ETF" who="SK" pl="+strong" plColor={S.green} reason="Gold in fiscal dominance era. Hold and add more. This is your best MF." verdict={<Pill label="HOLD + ADD" color={S.green} bg={S.greenbg} />} />
            <Row name="UTI Nifty 200 Momentum" who="SK" pl="−2,260" plColor={S.red} reason="Momentum ETFs underperform in high-volatility (oil shock + global uncertainty = momentum reversals). Switch to simple Nifty 50 Index ETF." verdict={<Pill label="SWITCH → Nifty 50" color={S.amber} bg={S.amberbg} />} />
            <Row name="JM Flexi Cap" who="SK" pl="unclear" plColor={S.t3} reason="Small AMC, inconsistent track record. Switch to UTI Flexi Cap Direct or HDFC Flexi Cap Direct — both better managed." verdict={<Pill label="SWITCH → UTI Flexi" color={S.amber} bg={S.amberbg} />} />
            <Row name="DSP (Surjit)" who="SK" pl="+4,100" plColor={S.green} reason="Good returns. Hold if Direct plan. Switch to Direct if Regular." verdict={<Pill label="HOLD / CHECK PLAN" color={S.green} bg={S.greenbg} />} />
          </Section>
        </>}

        {/* ── TAB 6: ACTIONS ── */}
        {tab === 6 && <>
          <p style={{ fontSize: 11, color: S.t3, marginBottom: 12 }}>Do in this exact order — highest impact first</p>
          {[
            { n: "1", color: S.red, bg: S.redbg, text: "Pay credit cards ₹41,683 TODAY. Running at 35%+ annual interest = highest cost in entire family portfolio. Non-negotiable." },
            { n: "2", color: S.red, bg: S.redbg, text: "Exit Vodafone Idea + Kaynes Technology (all 3 members) + C.E. Info Systems THIS WEEK. These will not recover before macro improves." },
            { n: "3", color: S.red, bg: S.redbg, text: `Exit Asian Paints (Prabhdeep). Oil at $${crudeVal} = margin destruction for another 6–12 months. Don't hold hope.` },
            { n: "4", color: S.amber, bg: S.amberbg, text: "Switch ALL regular MF plans → Direct plans. Annual saving: ₹6,000–15,000/year across family (0.5–1% on ₹15L+ corpus). Do it this month." },
            { n: "5", color: S.amber, bg: S.amberbg, text: "Book 50% DSP Healthcare (Prabhdeep) + 60% ABSL PSU (PK & SK). Redeploy into Nifty 50 Index SIP for all three members." },
            { n: "6", color: S.cyan, bg: S.cyanbg, text: `Add Silver ETF for all 3 members (5% of portfolio each). Gold/Silver ratio ${gsRatio} = rare setup. Silver outperforms gold in next 18 months historically.` },
            { n: "7", color: S.blue, bg: S.bluebg, text: `Start Nifty 50 Index SIP ₹5K/month for Prabhdeep and Surjit. Nifty/Gold ratio ${ngRatio} = Nifty cheapest vs gold in 10 years.` },
            { n: "8", color: S.amber, bg: S.amberbg, text: "Eliminate duplicate holdings: Container Corp → keep Charanjeet only. GAIL → keep Charanjeet only. Sell SK + PK duplicates, redeploy to high-conviction." },
            { n: "9", color: S.amber, bg: S.amberbg, text: "IT stocks: TCS, Wipro, HCL — sell on next 8–10% bounce. US IT slowdown is a 12–18 month headwind. Don't average down." },
            { n: "10", color: S.blue, bg: S.bluebg, text: "Ensure all 3 members have: term life insurance (min 10× income) + health insurance ₹10L+ each. The ₹11L HDFC loan is a family risk if something happens." },
          ].map(a => (
            <div key={a.n} style={{ borderLeft: `2px solid ${a.color}`, background: a.bg, borderRadius: 8, padding: "10px 14px", marginBottom: 8, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: a.color, flexShrink: 0 }}>{a.n}</span>
              <p style={{ fontSize: 12, color: S.t2, lineHeight: 1.5, margin: 0 }}>{a.text}</p>
            </div>
          ))}
          <div style={{ marginTop: 16, padding: "10px 14px", background: S.card, border: `0.5px solid ${S.border}`, borderRadius: 10 }}>
            <p style={{ fontSize: 10, color: S.t3 }}>Analysis based on 60-year macro cycle data (1965–June 2026), family holdings as of 1 June 2026, IndMoney MCP data. Not SEBI-registered investment advice. Verify LTCG/STCG tax implications + ELSS lock-in periods before executing any trade. Consult a SEBI-registered advisor.</p>
          </div>
        </>}

      </div>
    </div>
  );
}
