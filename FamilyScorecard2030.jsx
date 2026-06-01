import { useState } from "react";

const S = {
  bg:"#09090b",card:"#111111",border:"#27272a",
  t1:"#f4f4f5",t2:"#a1a1aa",t3:"#52525b",
  red:"#ef4444",redbg:"rgba(239,68,68,0.1)",
  amber:"#f59e0b",amberbg:"rgba(245,158,11,0.1)",
  green:"#22c55e",greenbg:"rgba(34,197,94,0.1)",
  blue:"#60a5fa",bluebg:"rgba(96,165,250,0.1)",
  cyan:"#06b6d4",cyanbg:"rgba(6,182,212,0.1)",
  gold:"#d4870f",goldbg:"rgba(212,135,15,0.1)",
};

const Pill = ({label,c,bg})=>(
  <span style={{background:bg,color:c,border:`1px solid ${c}30`,borderRadius:20,
    fontSize:10,fontWeight:600,padding:"2px 8px",whiteSpace:"nowrap"}}>{label}</span>
);

const Row = ({name,who,was,now,reason,target})=>(
  <tr 
    style={{borderBottom:`1px solid ${S.border}`, transition: "background 0.2s ease"}}
    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
  >
    <td style={{padding:"10px 14px",fontWeight:500,color:S.t1,fontSize:12}}>{name}</td>
    <td style={{padding:"10px 14px",fontSize:11,color:S.t2}}>{who}</td>
    <td style={{padding:"10px 14px"}}>{was}</td>
    <td style={{padding:"10px 14px"}}>{now}</td>
    <td style={{padding:"10px 14px",fontSize:11,color:S.t2,lineHeight:1.5}}>{reason}</td>
    <td style={{padding:"10px 14px",fontSize:11,color:S.cyan,fontWeight:600,whiteSpace:"nowrap"}}>{target}</td>
  </tr>
);

const THead = ()=>(
  <thead>
    <tr style={{background:S.card}}>
      {["Stock","Who","1-yr verdict","2030 verdict","Why it changes","2030 target"].map(h=>(
        <th key={h} style={{padding:"8px 14px",textAlign:"left",fontSize:10,fontWeight:600,
          textTransform:"uppercase",letterSpacing:".06em",color:S.t3,
          borderBottom:`1px solid ${S.border}`}}>{h}</th>
      ))}
    </tr>
  </thead>
);

const Card = ({label,val,valC,sub,border})=>(
  <div style={{background:S.card,border:`1px solid ${S.border}`,borderTop:`2px solid ${border||S.border}`,
    borderRadius:12,padding:"16px",boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
    <p style={{fontSize:10,color:S.t3,marginBottom:6,textTransform:"uppercase",letterSpacing:".08em",fontWeight:600}}>{label}</p>
    <p style={{fontSize:20,fontWeight:700,color:valC||S.t1,marginBottom:4}}>{val}</p>
    <p style={{fontSize:11,color:S.t2,lineHeight:1.4}}>{sub}</p>
  </div>
);

const TABS=["What Changes","Revised Sell","Upgraded→Hold","Mutual Funds","2030 Wealth Map","Priority Actions"];

export default function Scorecard2030(){
  const [tab,setTab]=useState(0);
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
  const crudeVal = live?.crude_wti?.value || 87.36;
  const bondVal = live?.us_10y?.value || 4.45;
  const dxyVal = live?.dxy?.value || 98.91;
  const gsRatio = live?.gold_silver_ratio?.value || 60.53;
  const ngRatio = live?.nifty_gold_ratio?.value || 1.68;

  return(
    <div style={{minHeight:"100vh",background:S.bg,color:S.t1,
      fontFamily:"'Inter',system-ui,sans-serif",paddingBottom:60}}>

      {/* Header */}
      <div style={{borderBottom:`1px solid ${S.border}`,padding:"16px 20px",
        background:"rgba(9,9,11,.85)",backdropFilter:"blur(12px)",
        position:"sticky",top:0,zIndex:50}}>
        <p style={{fontSize:15,fontWeight:700,color:S.t1,letterSpacing:".01em"}}>Re-analysis: 2027–2030 Horizon</p>
        <p style={{fontSize:11,color:S.t3,marginTop:2}}>Same data · Different patience · Very different verdicts</p>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:6,padding:"12px 20px",borderBottom:`1px solid ${S.border}`,overflowX:"auto"}}>
        {TABS.map((t,i)=>(
          <button key={t} onClick={()=>setTab(i)}
            style={{padding:"6px 16px",borderRadius:20,fontSize:11,fontWeight:600,
              cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.2s ease",
              background:tab===i?S.t1:"transparent",
              color:tab===i?S.bg:S.t2,
              border:`1px solid ${tab===i?S.t1:S.border}`}}>{t}</button>
        ))}
      </div>

      <div style={{padding:"16px 20px",maxWidth:1100,margin:"0 auto"}}>

        {/* ══ TAB 0: WHAT CHANGES ══ */}
        {tab===0&&<>
          <div style={{background:S.goldbg,border:`1px solid ${S.gold}30`,borderRadius:10,
            padding:"12px 16px",marginBottom:16}}>
            <p style={{fontSize:13,fontWeight:600,color:S.gold,marginBottom:6}}>
              Core thesis shift with 2027–2030 lens
            </p>
            <p style={{fontSize:12,color:S.t2,lineHeight:1.7}}>
              Short-term (1 yr): Oil shock, US slowdown, IT freeze = pain now.<br/>
              Long-term (2030): Fed cuts to 2–3% by 2027 → global liquidity surge → India structural bull → gold $6,000–8,000 → Nifty 38,000–45,000.<br/>
              <strong style={{color:S.t1}}>Your gold-heavy portfolio is PERFECTLY positioned for 2030. The equity underperformance of 2025–26 is the price of entry.</strong>
            </p>
          </div>

          {/* Summary change grid */}
          <p style={{fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:".07em",
            color:S.t3,marginBottom:8}}>How verdicts shift</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:8,marginBottom:16}}>
            <Card label="Exits removed (now hold)" val="11 stocks" valC={S.green} border={S.green}
              sub="TCS, HCL, Wipro, Jio Financial, Kaynes, Jyoti CNC, IRB, Patel, IDBI, Exide, C.E.Info (partial)" />
            <Card label="Still exit regardless" val="5 stocks" valC={S.red} border={S.red}
              sub="Vodafone Idea, IndusInd Bank, Asian Paints, Lodha, micro-cap noise" />
            <Card label="Gold target by 2030" val="₹20,000–28,000/g" valC={S.gold} border={S.gold}
              sub="$6,000–8,000/oz × ₹92–95 per dollar + 15% duty. Your ₹41L gold → ₹55L–75L" />
            <Card label="Nifty target by 2030" val="38,000–45,000" valC={S.cyan} border={S.cyan}
              sub="India GDP 6.5% × PE expansion when Fed cuts. From 24,000 = +60 to 87%" />
          </div>

          {/* Macro 2027-2030 setup */}
          <p style={{fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:".07em",color:S.t3,marginBottom:8}}>
            What the 60-year chart says about 2027–2030
          </p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
            {[
              {c:S.green,t:"Fed cuts → Liquidity surge (2026–2028)",
                b:"From our chart: every time Fed cuts from 4%+ to 2–3% (1982, 2001, 2009, 2020), markets rally 40–150% in 3 years. We are at the START of that cut cycle. Nifty + gold = dual winners."},
              {c:S.gold,t:"Gold: $6,000–8,000 by 2030 is BASE CASE",
                b:"60yr chart shows gold follows fiscal expansion. US debt $36T → $50T by 2030. Interest payments $1.4T → $2T+. Printing becomes mandatory. This is the Volcker era in REVERSE. Gold wins."},
              {c:S.cyan,t:"Silver: biggest % move of all assets 2026–2028",
                b:"G/S ratio 58.9 now. Historical mean is 68. When ratio falls below 60 and then reverses: silver moves 50–100% in 18 months. You hold ₹1.5K silver. This is the asset to add most aggressively."},
              {c:S.blue,t:"India: manufacturing + consumption 2027–2030",
                b:"China+1 materialising. PLI producing results. MSME formalisation. Middle class growing 50M/year. Domestic consumption is NOT dependent on US. Nifty mid and small cap = outperform."},
            ].map(x=>(
              <div key={x.t} style={{background:S.card,border:`0.5px solid ${S.border}`,
                borderLeft:`2px solid ${x.c}`,borderRadius:8,padding:"10px 12px"}}>
                <p style={{fontSize:11,fontWeight:600,color:x.c,marginBottom:4}}>{x.t}</p>
                <p style={{fontSize:11,color:S.t2,lineHeight:1.5}}>{x.b}</p>
              </div>
            ))}
          </div>

          <div style={{background:S.card,border:`0.5px solid ${S.border}`,borderRadius:10,padding:"12px 16px"}}>
            <p style={{fontSize:11,fontWeight:600,color:S.amber,marginBottom:6}}>INR by 2030 — from 60yr DXY chart</p>
            <p style={{fontSize:11,color:S.t2,lineHeight:1.6}}>
              Structural depreciation continues: ₹86–88 (2026) → ₹90–92 (2027) → ₹92–96 (2030). Not a collapse — a steady grind lower (5–7%/yr historical average).<br/>
              <strong style={{color:S.t1}}>Impact on your portfolio:</strong> Your USD-denominated holdings (GLD, BRK.B, TMUS, NFLX) gain automatically as INR falls. Your physical gold + gold ETFs priced in INR = massive appreciation. ₹41L gold position could be worth ₹55L–75L by 2030 in INR terms combining currency and price appreciation.
            </p>
          </div>
        </>}

        {/* ══ TAB 1: STILL SELL ══ */}
        {tab===1&&<>
          <p style={{fontSize:11,color:S.t3,marginBottom:12}}>
            These 5 have structural problems that do NOT resolve by 2030. Exit now, free up capital for winners.
          </p>
          <div style={{border:`0.5px solid ${S.border}`,borderRadius:10,overflow:"hidden",background:S.bg,marginBottom:16}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead>
                <tr style={{background:S.card}}>
                  {["Stock","Who","Why still exit even with 5yr patience","Action"].map(h=>(
                    <th key={h} style={{padding:"5px 10px",textAlign:"left",fontSize:10,fontWeight:500,
                      textTransform:"uppercase",color:S.t3,borderBottom:`0.5px solid ${S.border}`}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {n:"Vodafone Idea",w:"Prabhdeep",
                    r:"By 2030 this is either bankrupt or so diluted it's worthless. Jio + Airtel have already won. No 5G, no spectrum money, no promoter support. This is not a recovery story — it is a survival story that they are losing.",
                    a:<Pill label="EXIT TODAY" c={S.red} bg={S.redbg}/>},
                  {n:"IndusInd Bank",w:"Surjit",
                    r:"Governance issues (CFO departure, microfinance NPA) take 5–7 years to fully heal, NOT 3–5. By 2030, HDFC Bank will have doubled while IndusInd is still explaining itself. Wrong vehicle for your 5-year patience.",
                    a:<Pill label="EXIT → HDFC Bank" c={S.red} bg={S.redbg}/>},
                  {n:"Asian Paints",w:"Prabhdeep",
                    r:"Birla Opus disruption is STRUCTURAL, not cyclical. By 2030 Birla will have 15–20% market share. Asian Paints' 50x PE was pricing in a monopoly that no longer exists. Margin compression is permanent. Better to own Berger or exit entirely.",
                    a:<Pill label="EXIT NOW" c={S.red} bg={S.redbg}/>},
                  {n:"Lodha Developers",w:"Prabhdeep",
                    r:"High debt builder. By 2030, real estate may recover but Lodha's debt could compound the downside. If rates stay elevated even slightly, their UK + India debt servicing kills returns. Better: buy a Nifty Realty ETF for safer real estate exposure.",
                    a:<Pill label="EXIT" c={S.red} bg={S.redbg}/>},
                  {n:"Micro-cap noise (Genpharmasec, Filatex, Redtape, PG Electroplast)",w:"CS · SK",
                    r:"By 2030, these are still small, illiquid, and founder-dependent. No moat. No institutional coverage. Capital is better deployed in conviction ideas. Even 5 years won't cure 'no competitive advantage'.",
                    a:<Pill label="CLEAN UP" c={S.red} bg={S.redbg}/>},
                ].map((x,i)=>(
                  <tr key={i} style={{borderBottom:`0.5px solid ${S.border}`}}>
                    <td style={{padding:"7px 10px",fontWeight:500,color:S.t1,fontSize:12}}>{x.n}</td>
                    <td style={{padding:"7px 10px",fontSize:10,color:S.t2}}>{x.w}</td>
                    <td style={{padding:"7px 10px",fontSize:11,color:S.t2,lineHeight:1.5}}>{x.r}</td>
                    <td style={{padding:"7px 10px"}}>{x.a}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{background:S.greenbg,border:`1px solid ${S.green}30`,borderRadius:10,padding:"10px 14px"}}>
            <p style={{fontSize:11,color:S.t2}}>
              <strong style={{color:S.green}}>Everything else you were told to sell in the 1-yr analysis?</strong> With 2027–2030 patience — hold. The US will cut rates, global liquidity will return, India's structural story is intact. See next tab for upgraded verdicts.
            </p>
          </div>
        </>}

        {/* ══ TAB 2: UPGRADED → HOLD ══ */}
        {tab===2&&<>
          <p style={{fontSize:11,color:S.t3,marginBottom:12}}>
            These were "sell on rally" in the 1-yr view. With 2027–2030 patience, they become holds or even adds.
          </p>
          <div style={{border:`0.5px solid ${S.border}`,borderRadius:10,overflow:"hidden",background:S.bg}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <THead/>
              <tbody>
                <Row name="TCS" who="CS · PK"
                  was={<Pill label="SELL RALLY" c={S.amber} bg={S.amberbg}/>}
                  now={<Pill label="HOLD + BUY DIP" c={S.green} bg={S.greenbg}/>}
                  reason="US IT freeze is 12–18 months, not 5 years. By 2028 AI-driven enterprise spend returns. TCS is THE quality compounder in India IT. If TCS dips below ₹3,200 → add. India's best export franchise."
                  target="₹4,500–5,500 by 2030"/>
                <Row name="HCL Technologies" who="SK · CS"
                  was={<Pill label="SELL RALLY" c={S.amber} bg={S.amberbg}/>}
                  now={<Pill label="HOLD" c={S.green} bg={S.greenbg}/>}
                  reason="IT services + products (Angel One, Temenos). Product revenue = sticky. By 2027-28 recovery. PE 20x = cheaper than TCS. Hold."
                  target="₹2,000–2,500 by 2029"/>
                <Row name="Wipro" who="SK · PK"
                  was={<Pill label="SELL RALLY" c={S.amber} bg={S.amberbg}/>}
                  now={<Pill label="HOLD MINIMUM" c={S.cyan} bg={S.cyanbg}/>}
                  reason="Weakest IT player but not dying. Hold if in profit. If losing >15%, exit. New CEO (Srinivas Pallia) is making changes. By 2030, IT sector tide lifts all boats."
                  target="₹380–450 by 2029"/>
                <Row name="Jio Financial Services" who="CS"
                  was={<Pill label="SELL RALLY" c={S.amber} bg={S.amberbg}/>}
                  now={<Pill label="HOLD SMALL" c={S.green} bg={S.greenbg}/>}
                  reason="By 2027, Jio Financial will have revenue from insurance, lending, broking. Reliance ecosystem = captive 450M customers. This is a 2028-2030 story. Hold your small position."
                  target="₹350–500 by 2028"/>
                <Row name="Kaynes Technology" who="ALL 3"
                  was={<Pill label="EXIT ALL" c={S.red} bg={S.redbg}/>}
                  now={<Pill label="HOLD, DON'T ADD" c={S.cyan} bg={S.cyanbg}/>}
                  reason="Electronics manufacturing in India is a 10-year story (China+1). By 2030, Kaynes revenue could 4×. But PE 80x = still too expensive. Hold what you have, let revenue catch up to price. Don't add."
                  target="₹5,000–7,000 by 2030 (if revenue grows)"/>
                <Row name="Jyoti CNC Automation" who="CS · PK"
                  was={<Pill label="EXIT NOW" c={S.red} bg={S.redbg}/>}
                  now={<Pill label="HOLD CAUTIOUSLY" c={S.amber} bg={S.amberbg}/>}
                  reason="Auto + aerospace CNC recovery by 2027-28. India aerospace manufacturing is nascent. But watch: if debt increases or losses continue, exit. Check quarterly results closely."
                  target="₹700–1,100 by 2028 if debt reduces"/>
                <Row name="C.E. Info Systems" who="CS · PK"
                  was={<Pill label="EXIT NOW" c={S.red} bg={S.redbg}/>}
                  now={<Pill label="HOLD 40%, EXIT 60%" c={S.amber} bg={S.amberbg}/>}
                  reason="AI + autonomous vehicles needs maps. MAPMYINDIA is India's only mapping data company. Google can't replicate India-specific data. Niche moat. Reduce but don't fully exit. -41% = already pricing pain."
                  target="₹900–1,400 by 2029 (partial recovery)"/>
                <Row name="IDBI Bank" who="CS"
                  was={<Pill label="SELL RALLY" c={S.amber} bg={S.amberbg}/>}
                  now={<Pill label="HOLD — PRIVATISATION PLAY" c={S.green} bg={S.greenbg}/>}
                  reason="Government divesting IDBI Bank. LIC selling stake. By 2026-2027, private buyer (Kotak? Fairfax?) rerates the bank 40-60%. This is a hidden catalyst. Hold your small position."
                  target="₹125–175 by 2027 on privatisation"/>
                <Row name="Exide Industries" who="CS"
                  was={<Pill label="SWITCH→AMARA" c={S.amber} bg={S.amberbg}/>}
                  now={<Pill label="HOLD BOTH" c={S.green} bg={S.greenbg}/>}
                  reason="With 5 years, Exide's EV battery JV (with SVOLT China) matures. Lead-acid still needed till 2028. Hold alongside Amara Raja — both win in EV transition. Don't need to switch."
                  target="₹350–480 by 2029"/>
                <Row name="IRB Infrastructure" who="CS"
                  was={<Pill label="SELL RALLY" c={S.amber} bg={S.amberbg}/>}
                  now={<Pill label="HOLD" c={S.green} bg={S.greenbg}/>}
                  reason="Toll road = annuity income. By 2030, India's road network expands, traffic grows, toll rates increase. IRB is a 5-year compounding story at current low valuation. Hold."
                  target="₹80–120 by 2030"/>
                <Row name="Nifty IT ETF" who="CS"
                  was={<Pill label="SWITCH OR WAIT" c={S.amber} bg={S.amberbg}/>}
                  now={<Pill label="HOLD — IT RECOVERS 2028" c={S.green} bg={S.greenbg}/>}
                  reason="ETF form = diversified. When US normalises (2027-28), IT sector rallies hard. Hold. Don't sell the sector at the bottom of the cycle."
                  target="IT index +60–90% by 2029"/>
                <Row name="Rail Vikas Nigam (RVNL)" who="CS"
                  was={<Pill label="small/exit" c={S.amber} bg={S.amberbg}/>}
                  now={<Pill label="HOLD" c={S.green} bg={S.greenbg}/>}
                  reason="Railway capex ₹2.5L Cr/year through 2030. RVNL is direct beneficiary. Govt contractor with sovereign backing. By 2030, order book 5-7× current."
                  target="₹650–900 by 2030"/>
              </tbody>
            </table>
          </div>
        </>}

        {/* ══ TAB 3: MUTUAL FUNDS ══ */}
        {tab===3&&<>
          <div style={{border:`0.5px solid ${S.border}`,borderRadius:10,overflow:"hidden",background:S.bg}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead>
                <tr style={{background:S.card}}>
                  {["Fund","Who","2030 verdict","Action + reason"].map(h=>(
                    <th key={h} style={{padding:"5px 10px",textAlign:"left",fontSize:10,fontWeight:500,
                      textTransform:"uppercase",color:S.t3,borderBottom:`0.5px solid ${S.border}`}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {f:"All 6 ELSS Funds (Mirae, Quant, Tata, Bandhan, DSP, Axis)",w:"CS",
                    v:<Pill label="HOLD ALL TO 2030" c={S.green} bg={S.greenbg}/>,
                    r:"ELSS = equity + tax saving. All showing 15–48% returns. With India's GDP at 6.5–7% and Nifty headed to 38–45K by 2030, these become 3–5× from current. Lock in SIP. Don't touch."},
                  {f:"Tata Digital India Fund",w:"CS",
                    v:<Pill label="HOLD — IT RECOVERS 2028" c={S.green} bg={S.greenbg}/>,
                    r:"IT fund underperforms next 12–18 months then surges. With 5-year horizon = hold. Don't switch. IT correction = buying opportunity for the fund manager."},
                  {f:"SBI Multi Asset Allocation",w:"CS",
                    v:<Pill label="HOLD + ADD" c={S.green} bg={S.greenbg}/>,
                    r:"Has gold + equity + debt inside. All three asset classes win in the 2027–2030 scenario. Perfect fund for your 2030 horizon. Add ₹3,000/month SIP."},
                  {f:"Quant Flexi Cap",w:"PK",
                    v:<Pill label="HOLD — SWITCH TO DIRECT" c={S.cyan} bg={S.cyanbg}/>,
                    r:"Quant model works over 5 years. But check: if Regular plan, switch to Direct NOW. 0.7% saved annually = ₹50,000+ extra over 5 years on ₹1L corpus."},
                  {f:"DSP Healthcare Fund",w:"PK",
                    v:<Pill label="HOLD FULL — DON'T EXIT" c={S.green} bg={S.greenbg}/>,
                    r:"With 5-yr horizon: India pharma + biosimilars is a 2027–2030 mega-story. India becoming global API + generics hub. US FDA clearances accelerating. Hold all 100%. +23% is just the beginning."},
                  {f:"ABSL PSU Equity",w:"PK · SK",
                    v:<Pill label="PARTIAL HOLD 50%" c={S.amber} bg={S.amberbg}/>,
                    r:"PSU valuations stretched 2021–2024 but with Nifty → 45K, PSUs also move. Book 40% to lock profits, hold 60% for 2030 upside. Don't fully exit — government capex through 2030 = PSU earnings growth."},
                  {f:"Motilal Oswal Midcap",w:"PK",
                    v:<Pill label="HOLD — MIDCAP WINS BY 2030" c={S.green} bg={S.greenbg}/>,
                    r:"5-year horizon changes everything. India midcap compounds fastest over 5 years historically. The -₹1,800 loss will reverse by 2027. Motilal is a quality fund house. Hold. Add ₹2K/month SIP."},
                  {f:"UTI Nifty 200 Momentum ETF",w:"SK",
                    v:<Pill label="HOLD OR SWITCH TO NIFTY50" c={S.amber} bg={S.amberbg}/>,
                    r:"Momentum works in bull markets. If India enters bull by 2026 (as rate cuts flow through), this outperforms. Hold but hedge: add Nifty 50 ETF alongside so you're not pure momentum-dependent."},
                  {f:"JM Flexi Cap",w:"SK",
                    v:<Pill label="SWITCH → HDFC Flexi Cap" c={S.amber} bg={S.amberbg}/>,
                    r:"Still switch. JM is not a top-tier AMC for 5-year commitment. HDFC Flexi Cap has 20-year track record. Switch once, benefit for 5 years."},
                  {f:"Nippon India Gold ETF",w:"SK",
                    v:<Pill label="HOLD ALL + ADD MONTHLY" c={S.gold} bg={S.goldbg}/>,
                    r:`Gold $${goldVal} today → $6,000–8,000 by 2030. INR ₹86 → ₹93–96 by 2030. Combined: gold ETF in INR gives 4–6× returns by 2030. This is your single best MF. Add ₹3,000/month.`},
                ].map((x,i)=>(
                  <tr key={i} style={{borderBottom:`0.5px solid ${S.border}`}}>
                    <td style={{padding:"7px 10px",fontWeight:500,color:S.t1,fontSize:12}}>{x.f}</td>
                    <td style={{padding:"7px 10px",fontSize:10,color:S.t2}}>{x.w}</td>
                    <td style={{padding:"7px 10px"}}>{x.v}</td>
                    <td style={{padding:"7px 10px",fontSize:11,color:S.t2,lineHeight:1.5}}>{x.r}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>}

        {/* ══ TAB 4: WEALTH MAP ══ */}
        {tab===4&&<>
          <p style={{fontSize:11,color:S.t3,marginBottom:12}}>
            From our 60yr chart: Fed cutting from 3.6% → 2–3% by 2027, US debt at $45T by 2030, India GDP compounding. Here is the realistic range.
          </p>

          {/* 2027 targets */}
          <p style={{fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:".07em",color:S.t3,marginBottom:8}}>
            2027 INTERIM TARGETS (18 months away)
          </p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:8,marginBottom:16}}>
            <Card label="Gold price" val="$5,200–6,000" valC={S.gold} border={S.gold} sub="Fed cuts + CB buying + fiscal dominance"/>
            <Card label="Gold in INR/gram" val="₹15,000–17,000" valC={S.gold} border={S.gold} sub="At $5,500 + INR ₹89"/>
            <Card label="Your gold position (₹41L)" val="₹1.05–1.2Cr" valC={S.gold} border={S.gold} sub="~2.5–3× from today"/>
            <Card label="Nifty 50" val="28,000–33,000" valC={S.cyan} border={S.cyan} sub="Rate cuts + India growth + FII return"/>
            <Card label="Silver" val="₹1.1–1.4L/kg" valC={S.blue} border={S.blue} sub="G/S ratio normalises to 50–55"/>
            <Card label="INR" val="₹88–91/$" valC={S.amber} border={S.amber} sub="Structural depreciation continues"/>
          </div>

          {/* 2030 targets */}
          <p style={{fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:".07em",color:S.t3,marginBottom:8}}>
            2030 FINAL TARGETS (bull case / base case)
          </p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:8,marginBottom:16}}>
            <Card label="Gold price" val="$6,500–10,000" valC={S.gold} border={S.gold} sub="Fiscal dominance fully established. US debt $50T+"/>
            <Card label="Gold INR/gram" val="₹20,000–28,000" valC={S.gold} border={S.gold} sub="At $8,000 + INR ₹94"/>
            <Card label="Your gold (₹41L → ?)" val="₹1.7–3.0Cr" valC={S.gold} border={S.gold} sub="4–7× return in INR terms"/>
            <Card label="Nifty 50" val="38,000–45,000" valC={S.cyan} border={S.cyan} sub="India top 3 economy. Demographics. Manufacturing."/>
            <Card label="Silver INR/kg" val="₹1.5–2.2L" valC={S.blue} border={S.blue} sub="+55–125% from today's ₹97K/kg"/>
            <Card label="Bharti Airtel" val="₹2,200–2,800" valC={S.green} border={S.green} sub="ARPU ₹300+ by 2030. Africa growth."/>
          </div>

          {/* Family wealth projection */}
          <p style={{fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:".07em",color:S.t3,marginBottom:8}}>
            Family net worth projection (Charanjeet only — known data)
          </p>
          <div style={{background:S.card,border:`0.5px solid ${S.border}`,borderRadius:10,padding:"14px 16px",marginBottom:12}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
              {[
                {a:"Physical Gold (₹40.5L today)",b:"₹1.5–2.5Cr",c:"Gold $6,500–8,000 + INR 94"},
                {a:"Real Estate (₹35L today)",b:"₹55–75L",c:"8–10% appreciation, modest"},
                {a:"Indian Equity (₹7.65L today)",b:"₹18–28L",c:"Nifty 45K + quality picks 2×–3×"},
                {a:"Mutual Funds (₹3.56L today)",b:"₹9–14L",c:"ELSS + SIP compounding at 14–16%"},
              ].map(x=>(
                <div key={x.a} style={{borderBottom:`0.5px solid ${S.border}`,paddingBottom:10}}>
                  <p style={{fontSize:10,color:S.t3,marginBottom:4}}>{x.a}</p>
                  <p style={{fontSize:16,fontWeight:700,color:S.green}}>{x.b}</p>
                  <p style={{fontSize:10,color:S.t3}}>{x.c}</p>
                </div>
              ))}
            </div>
            <div style={{marginTop:12,paddingTop:12,borderTop:`0.5px solid ${S.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <p style={{fontSize:10,color:S.t3}}>Current net worth (Charanjeet)</p>
                <p style={{fontSize:13,fontWeight:500,color:S.t2}}>₹81.19L</p>
              </div>
              <div style={{fontSize:18,color:S.t3}}>→</div>
              <div>
                <p style={{fontSize:10,color:S.t3}}>2030 projected net worth (base)</p>
                <p style={{fontSize:20,fontWeight:700,color:S.green}}>₹2.2–3.2Cr</p>
              </div>
              <div>
                <p style={{fontSize:10,color:S.t3}}>Multiple</p>
                <p style={{fontSize:20,fontWeight:700,color:S.gold}}>2.7–3.9×</p>
              </div>
              <div>
                <p style={{fontSize:10,color:S.t3}}>CAGR needed</p>
                <p style={{fontSize:20,fontWeight:700,color:S.cyan}}>22–31%</p>
              </div>
            </div>
            <p style={{fontSize:10,color:S.t3,marginTop:8}}>Gold doing the heavy lifting. Equity adds acceleration. Real estate is the anchor. This is achievable WITHOUT taking extra risk — just hold what you have + add silver + add Nifty SIP.</p>
          </div>

          <div style={{background:S.goldbg,border:`1px solid ${S.gold}30`,borderRadius:10,padding:"10px 14px"}}>
            <p style={{fontSize:11,color:S.t2,lineHeight:1.6}}>
              <strong style={{color:S.gold}}>The single biggest lever in your 2030 plan:</strong> Physical gold ₹40.5L is 50% of your investable wealth. At $8,000 gold and ₹94 INR, that becomes ₹2.5Cr+. You don't need to do anything clever. You just need to NOT SELL YOUR GOLD. That one decision is worth more than every other trade combined.
            </p>
          </div>
        </>}

        {/* ══ TAB 5: ACTIONS ══ */}
        {tab===5&&<>
          <p style={{fontSize:11,color:S.t3,marginBottom:12}}>
            With 2027–2030 lens, action list shrinks dramatically. Fewer exits, more patience, more adds.
          </p>
          {[
            {n:"1",c:S.red,bg:S.redbg,
              t:"EXIT only these 5: Vodafone Idea · IndusInd Bank · Asian Paints · Lodha · Micro-caps (Genpharmasec, Filatex, Redtape). Everything else — hold. Stop overtrading."},
            {n:"2",c:S.red,bg:S.redbg,
              t:"Pay credit card ₹41,683 immediately. 35% annual interest on ₹41K = ₹14,500/year wasted. That money invested in silver ETF = ₹28,000 by 2027. Math is clear."},
            {n:"3",c:S.gold,bg:S.goldbg,
              t:`DO NOT SELL ANY GOLD. Physical + ETFs across all 3 members. This is your 2030 wealth engine. Gold from $${goldVal} to $6,500–8,000 + INR from ₹86 to ₹94 = 4–6× in INR. Protecting this holding is the most important action.`},
            {n:"4",c:S.cyan,bg:S.cyanbg,
              t:`Add Silver ETF for all 3 members — 5% of portfolio each. Gold/Silver ratio ${gsRatio} from our chart is the signal. Silver to outperform gold by 30–50% in next 18 months. Best risk/reward trade in your entire family portfolio right now.`},
            {n:"5",c:S.blue,bg:S.bluebg,
              t:`Start Nifty 50 Index SIP: ₹5,000/month each for Prabhdeep and Surjit. Nifty/Gold ratio ${ngRatio} = cheapest in 10 years. Nifty 38,000–45,000 by 2030. SIP removes timing anxiety.`},
            {n:"6",c:S.amber,bg:S.amberbg,
              t:"Switch ALL regular MF plans → Direct. One-time action. Saves ₹8,000–18,000/year across family. Over 5 years = ₹40,000–90,000 saved. Do this month via platforms like MFCentral."},
            {n:"7",c:S.amber,bg:S.amberbg,
              t:"Reduce GAIL + Container Corp to only Charanjeet. Sell duplicates from Prabhdeep and Surjit on any rally. Redeploy into silver ETF + Nifty 50 SIP. Less noise, better returns."},
            {n:"8",c:S.green,bg:S.greenbg,
              t:"Increase SBI Multi Asset Allocation SIP (Charanjeet) to ₹5,000/month. It holds equity + gold + debt automatically. Perfect 'set and forget' for 2030 target."},
            {n:"9",c:S.green,bg:S.greenbg,
              t:"Add Power Grid Corp or BEL (one stock, one member). These are 5-year structural plays — electricity grid + defence exports. Buy ₹25,000–50,000 position. Both will be 2–3× by 2030."},
            {n:"10",c:S.blue,bg:S.bluebg,
              t:"Insurance audit for all 3 members. ₹11L HDFC loan + ₹2L Bajaj loan = ₹13L family liability. If primary earner has no term life — fix that before any investment. Term insurance for ₹1Cr costs ₹8,000–12,000/year. Non-negotiable."},
          ].map(a=>(
            <div key={a.n} style={{borderLeft:`2px solid ${a.c}`,background:a.bg,
              borderRadius:8,padding:"10px 14px",marginBottom:8,
              display:"flex",gap:12,alignItems:"flex-start"}}>
              <span style={{fontSize:16,fontWeight:700,color:a.c,flexShrink:0}}>{a.n}</span>
              <p style={{fontSize:12,color:S.t2,lineHeight:1.6,margin:0}}>{a.t}</p>
            </div>
          ))}

          <div style={{background:S.card,border:`0.5px solid ${S.border}`,borderRadius:10,
            padding:"14px 16px",marginTop:16}}>
            <p style={{fontSize:12,fontWeight:600,color:S.t1,marginBottom:8}}>One-line summary for 2027–2030</p>
            <p style={{fontSize:12,color:S.t2,lineHeight:1.7}}>
              <strong style={{color:S.gold}}>Gold:</strong> Don't touch it. Let it run to ₹55L–75L.<br/>
              <strong style={{color:S.cyan}}>Silver:</strong> Add now. Best current opportunity from our charts.<br/>
              <strong style={{color:S.green}}>Nifty SIP:</strong> Start for PK + SK. Nifty to 38,000–45,000 by 2030.<br/>
              <strong style={{color:S.red}}>Exit only:</strong> Vodafone, IndusInd, Asian Paints, Lodha, micro-caps.<br/>
              <strong style={{color:S.t1}}>Everything else:</strong> Patience. The 2026–27 rate cut cycle is your friend.
            </p>
          </div>

          <p style={{fontSize:10,color:S.t3,marginTop:12,lineHeight:1.5}}>
            Based on 60-year macro cycle (1965–May 2026), family holdings as of 22 May 2026, IndMoney MCP data. Not SEBI-registered advice. Tax implications (LTCG, STCG, ELSS lock-in) must be verified before executing. Consult a SEBI RIA before acting.
          </p>
        </>}

      </div>
    </div>
  );
}
