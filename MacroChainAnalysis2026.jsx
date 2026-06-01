import { useState } from "react";

const C = {
  bg:"#09090b", card:"#0f0f0f", card2:"#141414", border:"#1f1f1f",
  t1:"#f4f4f5", t2:"#a1a1aa", t3:"#52525b",
  red:"#ef4444",   redbg:"rgba(239,68,68,0.08)",
  amber:"#f59e0b", amberbg:"rgba(245,158,11,0.08)",
  green:"#22c55e", greenbg:"rgba(34,197,94,0.08)",
  blue:"#60a5fa",  bluebg:"rgba(96,165,250,0.08)",
  gold:"#d4870f",  goldbg:"rgba(212,135,15,0.08)",
  cyan:"#06b6d4",  cyanbg:"rgba(6,182,212,0.08)",
  purple:"#a78bfa",purplebg:"rgba(167,139,250,0.08)",
  orange:"#fb923c",orangebg:"rgba(251,146,60,0.08)",
};

const Box = ({c,bg,title,children,accent})=>(
  <div style={{background:bg||C.card2,border:`1px solid ${C.border}`,
    borderLeft:`3px solid ${c}`,borderRadius:12,padding:"16px",marginBottom:12,boxShadow:"0 4px 12px rgba(0,0,0,0.05)"}}>
    {title&&<p style={{fontSize:12,fontWeight:700,color:c,marginBottom:8,letterSpacing:".02em"}}>{title}</p>}
    <div style={{fontSize:11,color:C.t2,lineHeight:1.6}}>{children}</div>
  </div>
);

const Tag = ({label,c,bg})=>(
  <span style={{background:bg||`${c}15`,color:c,border:`1px solid ${c}25`,
    borderRadius:20,fontSize:10,fontWeight:600,padding:"2px 9px",
    display:"inline-block",marginRight:4,marginBottom:2}}>{label}</span>
);

const Row2 = ({k,v,vc})=>(
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
    padding:"8px 0",borderBottom:`1px solid ${C.border}`, transition: "background 0.2s ease"}}
    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'}
    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
  >
    <span style={{fontSize:11,color:C.t3,paddingLeft:4}}>{k}</span>
    <span style={{fontSize:11,fontWeight:600,color:vc||C.t1,paddingRight:4}}>{v}</span>
  </div>
);

const Chain = ({items})=>(
  <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:4}}>
    {items.map((item,i)=>(
      <span key={i} style={{display:"flex",alignItems:"center",gap:4}}>
        <span style={{background:`${item.c}15`,color:item.c,border:`1px solid ${item.c}25`,
          borderRadius:6,fontSize:10,fontWeight:600,padding:"3px 8px"}}>{item.t}</span>
        {i<items.length-1&&<span style={{color:C.t3,fontSize:12}}>→</span>}
      </span>
    ))}
  </div>
);

const TABS = ["Situation Now","The 2 Variables","Chain Analysis","Gold & Warsh","June 16 Playbook","My Questions"];

export default function ChainAnalysis(){
  const [tab,setTab] = useState(0);
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
    <div style={{minHeight:"100vh",background:C.bg,color:C.t1,
      fontFamily:"'Inter',system-ui,sans-serif",paddingBottom:60}}>

      {/* Header */}
      <div style={{borderBottom:`1px solid ${C.border}`,padding:"16px 20px",
        position:"sticky",top:0,zIndex:50,
        background:"rgba(9,9,11,.85)",backdropFilter:"blur(12px)"}}>
        <p style={{fontSize:15,fontWeight:700,color:C.t1,marginBottom:2,letterSpacing:".01em"}}>
          Master-Class Chain Analysis — {live?.updated_at || "June 2, 2026"}
        </p>
        <p style={{fontSize:11,color:C.t3}}>
          Warsh · Hormuz · Fed Rate · Gold · Bond Market · US Debt · De-dollarisation · India impact
        </p>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:6,padding:"12px 20px",
        borderBottom:`1px solid ${C.border}`,overflowX:"auto"}}>
        {TABS.map((t,i)=>(
          <button key={t} onClick={()=>setTab(i)}
            style={{padding:"6px 16px",borderRadius:20,fontSize:11,fontWeight:600,
              cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.2s ease",
              background:tab===i?C.t1:"transparent",
              color:tab===i?C.bg:C.t2,
              border:`1px solid ${tab===i?C.t1:C.border}`}}>{t}</button>
        ))}
      </div>

      <div style={{padding:"16px 20px",maxWidth:960,margin:"0 auto"}}>

        {/* ══════════════════════════════════════════
            TAB 0 — SITUATION NOW
        ══════════════════════════════════════════ */}
        {tab===0&&<>
          <Box c={C.red} title="🚨 Everything changed in the last 9 days">
            Three simultaneous shocks hit at once. Each alone is manageable. Together they create the most complex macro setup since 2008.
            <br/><br/>
            <strong style={{color:C.t1}}>1.</strong> Kevin Warsh sworn in as Fed Chair (May 22). <strong style={{color:C.red}}>Known inflation hawk. 57% chance of rate HIKE by Dec.</strong>
            <br/>
            <strong style={{color:C.t1}}>2.</strong> Hormuz ceasefire fragile — Iran allowed 25 tankers through May 25-26 but US struck Iranian sites same day. MOU not signed by Trump.
            <br/>
            <strong style={{color:C.t1}}>3.</strong> April CPI jumped to 3.8% (from 3.26%). US Q1 GDP only 2.0%. <strong style={{color:C.amber}}>Classic stagflation setup.</strong>
          </Box>

          {/* Live data */}
          <p style={{fontSize:10,fontWeight:600,textTransform:"uppercase",
            letterSpacing:".07em",color:C.t3,margin:"14px 0 8px"}}>Current readings — {live?.updated_at || "June 2, 2026"}</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
            <div style={{background:C.card2,border:`0.5px solid ${C.border}`,borderRadius:10,padding:"12px 14px"}}>
              {[
                {k:"Fed Rate",v:"3.50–3.75% (HOLD)",vc:C.amber},
                {k:"New Fed Chair",v:"Kevin Warsh (May 22)",vc:C.red},
                {k:"Next FOMC",v:"June 16-17 (Warsh's 1st + dot plot)",vc:C.red},
                {k:"Hike probability Dec",v:"57% (CME FedWatch)",vc:C.red},
                {k:"US CPI (April)",v:"3.8% ↑ (was 3.26%)",vc:C.red},
                {k:"US GDP Q1",v:"2.0% (slowing)",vc:C.amber},
                {k:"Fed Balance Sheet",v:"~$7T (Warsh wants to shrink)",vc:C.amber},
              ].map((r,i)=><Row2 key={i} {...r}/>)}
            </div>
            <div style={{background:C.card2,border:`0.5px solid ${C.border}`,borderRadius:10,padding:"12px 14px"}}>
              {[
                {k:"Gold price",v:`~$${goldVal}`,vc:C.gold},
                {k:"Gold ATH (Jan 29)",v:"$5,595",vc:C.gold},
                {k:"Warsh shock (Jan 30)",v:"Gold −15%, Silver −31%",vc:C.red},
                {k:"Gold recovery since Feb",v:`$4,098 → $${goldVal} (+${((goldVal-4098)/4098*100).toFixed(0)}%)`,vc:C.green},
                {k:"WTI Crude Oil",v:`~$${crudeVal} (Hormuz crisis)`,vc:C.orange},
                {k:"Hormuz status",v:"Fragile ceasefire, partial open",vc:C.amber},
                {k:"US 10Y Bond",v:`~${bondVal}%`,vc:C.blue},
                {k:"US Debt",v:"$36.2T ($2T/yr growing)",vc:C.red},
              ].map((r,i)=><Row2 key={i} {...r}/>)}
            </div>
          </div>

          <Box c={C.amber} title="The core paradox Warsh faces">
            <strong style={{color:C.amber}}>Warsh wants to be Volcker. The math won't let him.</strong>
            <br/><br/>
            Volcker 1979: US debt = $800B. Could hike to 20% because interest payments were manageable.
            <br/>
            Warsh 2026: US debt = $36.2T. At 5% average rate = $1.8T/year JUST in interest. The US government spends $6T/year. Interest alone = 30% of all federal spending.
            <br/><br/>
            <strong style={{color:C.t1}}>If Warsh hikes to 5%+ → US debt spiral accelerates → Congress screams → Trump forces reversal.</strong>
            <br/>
            This is why Warsh is a <strong style={{color:C.red}}>50bps hawk maximum</strong>, not a Volcker. He knows the fiscal math.
          </Box>

          <Box c={C.gold} title="The Warsh Shock — already happened (key insight)">
            Jan 30, 2026: Warsh nominated → Gold fell 15% ($5,595 → $4,755), Silver fell 31%.
            <br/>
            This is the market <strong style={{color:C.gold}}>pre-pricing</strong> the Warsh hawkishness.
            <br/><br/>
            Historical pattern from our 60yr chart: Every time the market PRE-prices a Fed hike, the actual hike causes a smaller additional move — sometimes gold RISES on the actual hike (relief rally).
            <br/><br/>
            <strong style={{color:C.t1}}>Translation: The pain of Warsh is mostly already in gold's price. The ${`$${goldVal}`} current price reflects the Warsh discount.</strong>
          </Box>
        </>}

        {/* ══════════════════════════════════════════
            TAB 1 — THE 2 VARIABLES
        ══════════════════════════════════════════ */}
        {tab===1&&<>
          <p style={{fontSize:12,color:C.t2,marginBottom:14,lineHeight:1.6}}>
            Everything — gold, Nifty, INR, bonds, US stocks — is determined by just two variables in the next 60 days.
          </p>

          {/* Variable 1: Hormuz */}
          <div style={{background:C.card2,border:`0.5px solid ${C.border}`,
            borderTop:`2px solid ${C.orange}`,borderRadius:10,padding:"14px 16px",marginBottom:12}}>
            <p style={{fontSize:13,fontWeight:700,color:C.orange,marginBottom:10}}>
              Variable 1: Hormuz — Opens or Stays Closed?
            </p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              <div>
                <p style={{fontSize:10,fontWeight:600,color:C.green,marginBottom:6,
                  textTransform:"uppercase",letterSpacing:".06em"}}>Why it WILL open (strong case)</p>
                {[
                  "IRGC already allowed 25 vessels on May 25-26 = Iran is soft-opening as negotiating tool",
                  "Pakistan MOU talks: tentative agreement drafted (just Trump hasn't signed)",
                  "China = 40% of oil goes through Hormuz. China has maximum leverage + incentive to force deal",
                  "Iran's own oil exports go through Hormuz. Every closed day costs Iran $100M+",
                  "US Navy 5th Fleet in Bahrain can force-open in extremis. Iran knows this.",
                  "Historical precedent: Hormuz was never fully closed even during 1980-88 Iran-Iraq war",
                  "Trump's ego: he wants to announce 'deal'. Warsh's first meeting on June 16 — Trump wants oil lower before that.",
                ].map((x,i)=>(
                  <p key={i} style={{fontSize:11,color:C.t2,lineHeight:1.5,
                    marginBottom:4,paddingLeft:14,position:"relative"}}>
                    <span style={{position:"absolute",left:0,color:C.green}}>✓</span>{x}
                  </p>
                ))}
              </div>
              <div>
                <p style={{fontSize:10,fontWeight:600,color:C.red,marginBottom:6,
                  textTransform:"uppercase",letterSpacing:".06em"}}>Why it might STAY closed</p>
                {[
                  "Trump 'not satisfied' with MOU terms. Wants enriched uranium surrender + total Hormuz opening",
                  "Iran wants US troop withdrawal + end of naval blockade — US won't agree",
                  "US struck Iranian sites on May 25-26 DURING ceasefire = trust destroyed",
                  "IRGC warned 'any ceasefire violation will be met with force'",
                  "Iran domestic politics: hardliners need confrontational posture to survive",
                  "Trump set 3 previous deadlines (Mar 21, Mar 23, Apr 7) — all missed. Pattern of delays.",
                  "No formal deal signed. MOU only = can collapse any time",
                ].map((x,i)=>(
                  <p key={i} style={{fontSize:11,color:C.t2,lineHeight:1.5,
                    marginBottom:4,paddingLeft:14,position:"relative"}}>
                    <span style={{position:"absolute",left:0,color:C.red}}>✗</span>{x}
                  </p>
                ))}
              </div>
            </div>

            {/* Probability bars */}
            <p style={{fontSize:10,fontWeight:600,color:C.t3,
              textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>Probability assessment</p>
            {[
              {label:"Opens BEFORE June 16 (Warsh's 1st meeting)",pct:40,c:C.green},
              {label:"Opens July–September 2026",pct:35,c:C.cyan},
              {label:"Remains largely closed through Dec 2026",pct:20,c:C.orange},
              {label:"Permanent multi-year closure",pct:5,c:C.red},
            ].map(x=>(
              <div key={x.label} style={{marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontSize:11,color:C.t2}}>{x.label}</span>
                  <span style={{fontSize:11,fontWeight:600,color:x.c}}>{x.pct}%</span>
                </div>
                <div style={{background:C.border,borderRadius:4,height:6}}>
                  <div style={{background:x.c,borderRadius:4,height:6,
                    width:`${x.pct}%`,opacity:.8}}/>
                </div>
              </div>
            ))}
            <p style={{fontSize:10,color:C.t3,marginTop:8}}>
              Key signal to watch: China's diplomatic activity. If Beijing sends envoy → deal in 2 weeks. If China silent → prolonged.
            </p>
          </div>

          {/* Variable 2: Warsh */}
          <div style={{background:C.card2,border:`0.5px solid ${C.border}`,
            borderTop:`2px solid ${C.red}`,borderRadius:10,padding:"14px 16px"}}>
            <p style={{fontSize:13,fontWeight:700,color:C.red,marginBottom:10}}>
              Variable 2: Warsh — Hike, Hold, or Surprise Cut?
            </p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:12}}>
              {[
                {label:"HOLD at 3.625%",prob:"45%",c:C.amber,
                  why:"Oil-driven inflation is supply shock, not demand. Hiking into slowing growth (2% GDP) risks recession. Warsh wants to establish credibility first, hike later if needed."},
                {label:"HIKE 25bps → 4.00%",prob:"40%",c:C.red,
                  why:"April CPI 3.8% is 3rd consecutive miss. Fed minutes say majority want hikes. Warsh's first meeting = credibility statement. Hormuz still closed = oil still high. Markets pricing 57% hike by Dec."},
                {label:"CUT 25bps → 3.25%",prob:"15%",c:C.green,
                  why:"Only if Hormuz opens before June 16 AND CPI drops sharply in May data (released June 11). Very unlikely given current trajectory."},
              ].map(s=>(
                <div key={s.label} style={{background:C.card,border:`0.5px solid ${s.c}30`,
                  borderTop:`2px solid ${s.c}`,borderRadius:8,padding:"10px 12px"}}>
                  <p style={{fontSize:12,fontWeight:700,color:s.c,marginBottom:4}}>{s.label}</p>
                  <p style={{fontSize:20,fontWeight:700,color:s.c,marginBottom:6}}>{s.prob}</p>
                  <p style={{fontSize:10,color:C.t2,lineHeight:1.5}}>{s.why}</p>
                </div>
              ))}
            </div>
            <Box c={C.purple} title="The Warsh character from history">
              Warsh 2008: Dissented against QE. Called it "sugar high." Predicted inflation early.
              Warsh 2025 WSJ op-ed: Called Fed leadership "broken." Wants to shrink $7T balance sheet.
              Warsh's mentor: Milton Friedman (inflation is always and everywhere a monetary phenomenon).
              BUT: Warsh is also a Wall Street veteran. He knows markets. He will NOT create a Lehman-style shock on his first meeting.
              <br/><br/>
              <strong style={{color:C.t1}}>My read: Warsh talks hawkish, acts measured. June 16 = 25bps hike OR strong hike signal for September. Not 50bps. Not zero either.</strong>
            </Box>
          </div>
        </>}

        {/* ══════════════════════════════════════════
            TAB 2 — CHAIN ANALYSIS
        ══════════════════════════════════════════ */}
        {tab===2&&<>
          <p style={{fontSize:12,color:C.t2,marginBottom:14}}>
            Three scenarios. Every asset class mapped. Read top to bottom.
          </p>

          {/* Scenario A */}
          <div style={{background:C.card2,border:`0.5px solid ${C.green}30`,
            borderLeft:`2px solid ${C.green}`,borderRadius:10,padding:"14px 16px",marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <p style={{fontSize:13,fontWeight:700,color:C.green}}>Scenario A — Hormuz opens before June 16</p>
              <Tag label="Probability: 40%" c={C.green}/>
            </div>
            <div style={{marginBottom:10}}>
              <Chain items={[
                {t:"Hormuz opens",c:C.green},
                {t:`Oil $${crudeVal}→$80`,c:C.orange},
                {t:"CPI falls 0.6%",c:C.green},
                {t:"Warsh holds June 16",c:C.amber},
                {t:"Dollar weakens",c:C.cyan},
                {t:`Gold $${goldVal}→$5,200`,c:C.gold},
                {t:"Nifty 24K→28K",c:C.green},
                {t:"INR ₹86→₹84",c:C.green},
              ]}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:8}}>
              {[
                {a:"Gold",v:"$5,000–5,400",c:C.gold,n:"Relief rally. Fiscal dominance resumes. CB buying continues."},
                {a:"Silver",v:"+25–35%",c:C.cyan,n:"Best asset in this scenario. Ratio resumes decline. Industrial demand returns."},
                {a:"US Stocks",v:"S&P +8–12%",c:C.green,n:"Oil relief = earnings uplift. Rate hold = PE expansion. Buy tech."},
                {a:"Nifty",v:"27,000–29,000",c:C.green,n:"FII inflows surge. Oil import bill falls. RBI can cut. Domestic bull resumes."},
                {a:"INR",v:"₹83–85/$",c:C.green,n:"CAD improves. FII inflows. Best INR scenario."},
                {a:"US 10Y",v:"3.9–4.1%",c:C.blue,n:"Oil-driven inflation premium fades. Bonds rally."},
              ].map(x=>(
                <div key={x.a} style={{background:C.card,border:`0.5px solid ${C.border}`,borderRadius:8,padding:"8px 10px"}}>
                  <p style={{fontSize:10,color:C.t3,marginBottom:2}}>{x.a}</p>
                  <p style={{fontSize:13,fontWeight:700,color:x.c,marginBottom:3}}>{x.v}</p>
                  <p style={{fontSize:10,color:C.t3,lineHeight:1.4}}>{x.n}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Scenario B */}
          <div style={{background:C.card2,border:`0.5px solid ${C.red}30`,
            borderLeft:`2px solid ${C.red}`,borderRadius:10,padding:"14px 16px",marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <p style={{fontSize:13,fontWeight:700,color:C.red}}>Scenario B — Hormuz closed + Warsh hikes June 16</p>
              <Tag label="Probability: 35%" c={C.red}/>
            </div>
            <div style={{marginBottom:10}}>
              <Chain items={[
                {t:"Hormuz closed",c:C.red},
                {t:"Oil $110–125",c:C.orange},
                {t:"CPI→4.5%+",c:C.red},
                {t:"Warsh hikes 25bps",c:C.red},
                {t:"Dollar spikes DXY 112",c:C.blue},
                {t:"Gold $4,100–4,300",c:C.amber},
                {t:"Nifty 21,000–23,000",c:C.red},
                {t:"INR ₹89–92",c:C.red},
              ]}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:8,marginBottom:10}}>
              {[
                {a:"Gold immediate",v:"$4,000–4,300",c:C.amber,n:"Initial -10 to -15% correction. Market tests Warsh credibility."},
                {a:"Gold 6–12 months",v:"$5,500–6,500",c:C.gold,n:"Fiscal math reasserts. $36T debt can't sustain 4%+ rates. Gold reverses."},
                {a:"Silver",v:"−20–25% then +40%",c:C.cyan,n:"Most violent short-term move. Best medium-term buy after correction."},
                {a:"US Stocks",v:"S&P −10–18%",c:C.red,n:"Hike into slowing growth = recession pricing. Tech hardest hit."},
                {a:"Nifty",v:"20,500–23,000",c:C.red,n:"FII exit EM. Oil still high. RBI can't cut. Double headwind."},
                {a:"INR",v:"₹89–93/$",c:C.red,n:"Worst case for INR. High oil + dollar surge = severe pressure."},
              ].map(x=>(
                <div key={x.a} style={{background:C.card,border:`0.5px solid ${C.border}`,borderRadius:8,padding:"8px 10px"}}>
                  <p style={{fontSize:10,color:C.t3,marginBottom:2}}>{x.a}</p>
                  <p style={{fontSize:13,fontWeight:700,color:x.c,marginBottom:3}}>{x.v}</p>
                  <p style={{fontSize:10,color:C.t3,lineHeight:1.4}}>{x.n}</p>
                </div>
              ))}
            </div>
            <Box c={C.amber} title="BUT — Scenario B is STILL long-term bullish for gold">
              From our 60yr chart: 2022 parallel — Fed hiked 425bps, gold went FLAT (not crashed). Why? Fiscal dominance floor.
              <br/>
              In 2026 with $36T debt: Warsh hikes 25bps → gold corrects $200–300 → then resumes bull in 3–6 months.
              <br/><strong style={{color:C.t1}}>The Warsh shock already happened Jan 30 (−15%). A hike on June 16 is ALREADY PRICED. The actual correction may be smaller than expected.</strong>
            </Box>
          </div>

          {/* Scenario C — Stagflation trap */}
          <div style={{background:C.card2,border:`0.5px solid ${C.orange}30`,
            borderLeft:`2px solid ${C.orange}`,borderRadius:10,padding:"14px 16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <p style={{fontSize:13,fontWeight:700,color:C.orange}}>Scenario C — Stagflation trap (GDP↓ + CPI↑)</p>
              <Tag label="Probability: 25%" c={C.orange}/>
            </div>
            <div style={{marginBottom:10}}>
              <Chain items={[
                {t:"GDP→1% + CPI→4.5%",c:C.orange},
                {t:"Warsh paralysed",c:C.amber},
                {t:"HOLDS but threatens",c:C.amber},
                {t:"Market confusion",c:C.orange},
                {t:"Gold $4,200–4,800 choppy",c:C.gold},
                {t:"US stocks −5 to −10%",c:C.amber},
                {t:"Nifty flat-to-down",c:C.amber},
                {t:"INR ₹87–90",c:C.amber},
              ]}/>
            </div>
            <p style={{fontSize:11,color:C.t2,lineHeight:1.5}}>
              This is the 1973–1980 replay from our 60yr chart. Back then: stagflation = GOLD SURGED (9× in 7 years). The macro headwind for everything else. But gold floated above it all because it's not a growth asset — it's a currency trust asset.
              <br/><br/>
              <strong style={{color:C.t1}}>In Scenario C: Your gold is your best friend. Nifty underperforms. IT stocks hurt most. Physical gold + silver = preserve wealth. INR falls slowly.</strong>
            </p>
          </div>
        </>}

        {/* ══════════════════════════════════════════
            TAB 3 — GOLD & WARSH
        ══════════════════════════════════════════ */}
        {tab===3&&<>
          <Box c={C.gold} title="Gold vs every Fed Chair — 100 years of pattern">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:4}}>
              {[
                {era:"Burns (1970–78) — Dove",gold:"$35→$307",r:"+777%",
                  l:"Inflation ran hot. Fed printed. Gold surged. Classic debasement.",c:C.green},
                {era:"Volcker (1979–87) — Extreme Hawk",gold:"$612→$317",r:"−48%",
                  l:"But: gold only gave back HALF the 1970s gains. Structural floor held.",c:C.red},
                {era:"Greenspan (1987–2006) — Dove/Cut",gold:"$317→$636",r:"+100%",
                  l:"Long slow grind up. 'Greenspan put' = money printing lite.",c:C.green},
                {era:"Bernanke (2006–14) — QE King",gold:"$636→$1,200",r:"+89%",
                  l:"QE1/2/3 = gold surged. $3T+ balance sheet expansion.",c:C.green},
                {era:"Yellen (2014–18) — Gradual hiker",gold:"$1,266→$1,302",r:"+3%",
                  l:"Hiking cycle = gold flat. Dollar rose. Real yields positive briefly.",c:C.amber},
                {era:"Powell (2018–26) — Pivot master",gold:"$1,269→$2,389+",r:"+88%",
                  l:"COVID QE then hiking but gold still won. Fiscal dominance era starts.",c:C.green},
                {era:"WARSH (2026–?) — Self-described hawk",gold:`$${goldVal} (Jan 30 correction −15%)`,r:"???",
                  l:"Already priced. The shock happened on nomination. Actual hikes = smaller moves.",c:C.orange},
              ].map((x,i)=>(
                <div key={i} style={{background:C.card,border:`0.5px solid ${C.border}`,borderRadius:8,padding:"8px 10px"}}>
                  <p style={{fontSize:11,fontWeight:600,color:x.c,marginBottom:3}}>{x.era}</p>
                  <p style={{fontSize:10,color:C.t2,marginBottom:2}}>{x.gold} <strong style={{color:x.c}}>{x.r}</strong></p>
                  <p style={{fontSize:10,color:C.t3,lineHeight:1.4}}>{x.l}</p>
                </div>
              ))}
            </div>
          </Box>

          <Box c={C.red} title="What's DIFFERENT this time — the 3 contradictions">
            <strong style={{color:C.t1}}>Contradiction 1: Real yields positive but gold at $${goldVal}</strong>
            <br/>
            Classic rule: positive real yield (bond − inflation) = gold falls.
            Current: 10Y bond ${bondVal}% − CPI 3.8% = +${(bondVal - 3.8).toFixed(2)}% real yield. Gold SHOULD be at $1,800–2,000.
            It's at $${goldVal}. Why? <strong style={{color:C.gold}}>Central bank buying has broken the traditional model.</strong>
            Q1 2026: CBs bought 244 tonnes. That's a structural floor that didn't exist in Volcker's era.
            <br/><br/>
            <strong style={{color:C.t1}}>Contradiction 2: Warsh is a hawk but US debt makes him structurally dovish</strong>
            <br/>
            Warsh can talk like Volcker. He cannot act like Volcker.
            At $36.2T debt, every 1% rate increase = $362B more annual interest.
            US collects $4.9T in taxes. Current interest = $1.4T (29% of revenue).
            At Volcker rates (16%), interest = $5.8T = MORE THAN ALL TAX REVENUE.
            <strong style={{color:C.red}}> The fiscal math is a hard ceiling on how hawkish any Fed chair can actually be in 2026.</strong>
            <br/><br/>
            <strong style={{color:C.t1}}>Contradiction 3: China selling bonds but dollar not collapsing</strong>
            <br/>
            China reduced US bond holdings from $1.3T (2013) → $760B (2024). Should have killed dollar.
            Didn't — because Japan + domestic US institutions + Saudi Arabia replaced China's buying.
            But: Saudi Arabia now trading some oil in yuan. India paying for Russian oil in rupees.
            De-dollarisation is slow (10–20 years) not fast (1–2 years). DXY at ${dxyVal} = dollar still strong.
            <strong style={{color:C.amber}}>Net: Dollar stays strong medium-term. But long-term (2028–2032) structural weakness builds.</strong>
          </Box>

          <Box c={C.cyan} title="Gold price framework — what drives it NOW vs historically">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:4}}>
              <div>
                <p style={{fontSize:11,fontWeight:600,color:C.t2,marginBottom:6}}>Old drivers (1971–2020)</p>
                {["Real yields (inverse)", "USD strength (inverse)", "Inflation expectations", "Fear/geopolitical events"].map((x,i)=>(
                  <p key={i} style={{fontSize:11,color:C.t3,marginBottom:3,paddingLeft:12,position:"relative"}}>
                    <span style={{position:"absolute",left:0,color:C.cyan}}>→</span>{x}
                  </p>
                ))}
              </div>
              <div>
                <p style={{fontSize:11,fontWeight:600,color:C.gold,marginBottom:6}}>New drivers (2022–2030)</p>
                {["Central bank buying (dominant now)", "De-dollarisation demand", "Fiscal dominance (debt $36T+)", "Real yields LESS important", "Geopolitical reserve diversification"].map((x,i)=>(
                  <p key={i} style={{fontSize:11,color:C.t3,marginBottom:3,paddingLeft:12,position:"relative"}}>
                    <span style={{position:"absolute",left:0,color:C.gold}}>★</span>{x}
                  </p>
                ))}
              </div>
            </div>
            <br/>
            <strong style={{color:C.t1}}>Bottom line:</strong> Even if Warsh hikes and real yields go to +2%, gold floor is ~$3,800–4,000 because CB buying provides structural support that didn't exist before 2022. Goldman Sachs, JP Morgan, ANZ, ING all maintain $5,400–6,000 year-end 2026 targets.
          </Box>
        </>}

        {/* ══════════════════════════════════════════
            TAB 4 — JUNE 16 PLAYBOOK
        ══════════════════════════════════════════ */}
        {tab===4&&<>
          <Box c={C.red} title="June 16–17 is THE most important macro event for your portfolio in 2026">
            Warsh's first meeting as chair. Includes SEP (Summary of Economic Projections) + dot plot.
            Markets will read every word. This is THE pivot point for everything.
          </Box>

          {/* Timeline */}
          <p style={{fontSize:10,fontWeight:600,textTransform:"uppercase",
            letterSpacing:".07em",color:C.t3,margin:"14px 0 8px"}}>Next 16 days — what to watch</p>
          {[
            {d:"Jun 4",e:"China diplomatic signal?",imp:"HIGH",c:C.orange,
              w:"If China sends envoy to Tehran → Hormuz deal in 10 days. Watch CGTN, Xinhua."},
            {d:"Jun 11",e:"May CPI data released",imp:"CRITICAL",c:C.red,
              w:"If May CPI < 3.5% (oil/food easing) → Warsh holds June 16. If May CPI > 4% → hike is almost certain."},
            {d:"Jun 13",e:"May PPI + University of Michigan inflation expectations",imp:"HIGH",c:C.amber,
              w:"Inflation expectations matter more than actual data for Warsh's credibility play."},
            {d:"Jun 16-17",e:"FOMC decision + dot plot + Warsh press conference",imp:"MARKET-MOVING",c:C.red,
              w:"Warsh's tone matters as much as the decision. Watch for: balance sheet timeline, hike path, Hormuz comments."},
          ].map(x=>(
            <div key={x.d} style={{display:"flex",gap:12,alignItems:"flex-start",
              background:C.card2,border:`0.5px solid ${C.border}`,borderRadius:8,
              padding:"10px 14px",marginBottom:8}}>
              <div style={{flexShrink:0,textAlign:"center",width:44}}>
                <p style={{fontSize:12,fontWeight:700,color:x.c}}>{x.d}</p>
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                  <p style={{fontSize:12,fontWeight:600,color:C.t1}}>{x.e}</p>
                  <Tag label={x.imp} c={x.c}/>
                </div>
                <p style={{fontSize:11,color:C.t2,lineHeight:1.5}}>{x.w}</p>
              </div>
            </div>
          ))}

          {/* Portfolio action grid */}
          <p style={{fontSize:10,fontWeight:600,textTransform:"uppercase",
            letterSpacing:".07em",color:C.t3,margin:"14px 0 8px"}}>Your portfolio actions by outcome</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
            {[
              {title:"IF Hormuz opens + Warsh holds",c:C.green,
                actions:[
                  "ADD silver aggressively (ratio resumes decline)",
                  "ADD Nifty 50 index ETF lump sum",
                  "HOLD all gold — don't sell any",
                  "ADD HDFC Bank on Nifty pullback",
                  "BUY Power Grid + BEL",
                ]},
              {title:"IF Warsh hikes 25bps",c:C.red,
                actions:[
                  "DO NOT PANIC SELL gold",
                  "WAIT 30 days for gold to bottom",
                  "Then ADD physical gold at $4,000–4,200",
                  "Add silver after −20% correction (best entry)",
                  "Avoid Nifty for 60–90 days after hike",
                  "Hold US USD positions (BRK.B, GLD)",
                ]},
              {title:"IF Stagflation confirmed (GDP < 1%)",c:C.orange,
                actions:[
                  "HOLD all gold — stagflation is gold's best era",
                  "Buy energy stocks: GAIL, ONGC, IOCL",
                  "Avoid IT, discretionary, banking",
                  "Add infrastructure: Power Grid, NTPC, NHPC",
                  "Keep 10–15% cash for opportunities",
                ]},
            ].map(s=>(
              <div key={s.title} style={{background:C.card2,border:`0.5px solid ${s.c}30`,
                borderTop:`2px solid ${s.c}`,borderRadius:10,padding:"10px 12px"}}>
                <p style={{fontSize:11,fontWeight:600,color:s.c,marginBottom:8}}>{s.title}</p>
                {s.actions.map((a,i)=>(
                  <p key={i} style={{fontSize:11,color:C.t2,lineHeight:1.5,
                    marginBottom:3,paddingLeft:14,position:"relative"}}>
                    <span style={{position:"absolute",left:0,color:s.c}}>›</span>{a}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </>}

        {/* ══════════════════════════════════════════
            TAB 5 — MY QUESTIONS
        ══════════════════════════════════════════ */}
        {tab===5&&<>
          <Box c={C.cyan} title="Questions I need from you to sharpen the analysis further">
            I understand the macro setup deeply. But 3 inputs from you would sharpen the precision significantly:
          </Box>

          {[
            {n:"Q1",c:C.orange,
              q:"How are you tracking Hormuz negotiations daily?",
              why:"The single biggest near-term variable. If you have access to live news, the signal to watch is: (a) China sending a special envoy to Tehran — deal in 10-14 days. (b) Trump tweeting 'great deal' — open in 48 hours. (c) IRGC allowing more vessels — soft-open already happening. The MOU draft exists. Question is just Trump's signature.",
              imp:"Knowing whether you're watching this daily affects whether I give you trigger-based actions or time-based actions."},
            {n:"Q2",c:C.red,
              q:"What's your available cash or liquid position right now?",
              why:"June 16 creates a binary event. If Warsh hikes → gold dips to $4,000–4,200 = best buying opportunity in 2026. If Warsh holds → immediate silver + Nifty add. In either case, having cash ready to deploy in the 72 hours after June 16 is worth more than any stock picking.",
              imp:"If you have ₹3–5L liquid, the June 16 playbook changes completely. If you're fully deployed, strategy is different."},
            {n:"Q3",c:C.purple,
              q:"Do Prabhdeep and Surjit have any gold exposure?",
              why:"We know their equity holdings from the Numbers file. But their gold (physical + ETF) position changes the family's overall macro resilience significantly. If they have minimal gold — the most important action for them is adding gold/silver before June 16, not equity shuffling.",
              imp:"If total family gold is less than 25% of family net worth combined — that's the first thing to fix before June 16."},
            {n:"Q4",c:C.amber,
              q:"Is the ₹11.27L HDFC loan fixed or floating rate?",
              why:"If floating — a Warsh hike directly increases your EMI cost. If fixed — you're insulated. This determines whether paying down the loan vs investing is the right call for the next 6 months.",
              imp:"If floating rate loan: every 25bps hike = ~₹2,800 more per year on ₹11L. 4 hikes = ₹11,200/yr more. Need to know if prepayment makes sense."},
          ].map(x=>(
            <div key={x.n} style={{background:C.card2,border:`0.5px solid ${C.border}`,
              borderLeft:`2px solid ${x.c}`,borderRadius:10,padding:"14px 16px",marginBottom:10}}>
              <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                <span style={{fontSize:14,fontWeight:700,color:x.c,flexShrink:0}}>{x.n}</span>
                <div>
                  <p style={{fontSize:13,fontWeight:600,color:C.t1,marginBottom:6}}>{x.q}</p>
                  <p style={{fontSize:11,color:C.t2,lineHeight:1.5,marginBottom:6}}>{x.why}</p>
                  <p style={{fontSize:10,color:x.c}}><strong>Why it matters: </strong>{x.imp}</p>
                </div>
              </div>
            </div>
          ))}

          <Box c={C.gold} title="One final insight — the thing most analysts miss">
            Gold fell 15% when Warsh was nominated (Jan 30). Gold is now $${goldVal} — still $${(goldVal-4098).toFixed(0)} above where it was before the 2025 bull run really started (~$4,100 was the Feb 2026 low).
            <br/><br/>
            The Warsh shock was <strong style={{color:C.gold}}>the market testing whether the fiscal dominance bull is real or speculative.</strong> The fact that gold held $4,000+ and has recovered to $${goldVal} is the answer. The structural bull is real.
            <br/><br/>
            <strong style={{color:C.t1}}>World Gold Council data: Central banks bought 244 tonnes in Q1 2026 alone (up 74% YoY). That is not speculation. That is governments voting with their reserves that the dollar's dominance is fading.</strong> No Fed chair — not even Volcker reincarnated — can fight 244 tonnes/quarter of sovereign buying.
            <br/><br/>
            Your gold is not just an investment. It is a vote for the correct macro thesis. Hold it.
          </Box>

          <p style={{fontSize:10,color:C.t3,marginTop:12,lineHeight:1.5}}>
            All analysis based on verified sources: Crux Investor (GDP/CPI data), CME FedWatch (rate probabilities), Charles Schwab (Warsh analysis), CNN Business (ceasefire status), Wikipedia/House of Commons Library (Hormuz crisis), 60-year macro chart data compiled earlier in this conversation. Not SEBI or SEC-registered investment advice.
          </p>
        </>}

      </div>
    </div>
  );
}
