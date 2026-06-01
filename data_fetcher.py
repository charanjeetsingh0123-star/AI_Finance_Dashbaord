"""
data_fetcher.py — Background data engine for MasterMacroAnalysis Dashboard
Fetches: Yahoo Finance prices, Google News RSS, IndMoney CSV watcher
Writes:  data/live.json, data/news.json, data/portfolio.json, data/history.json
"""
import json
import os
import time
import glob
import csv
import threading
import traceback
from datetime import datetime, timezone, timedelta
from pathlib import Path

IST = timezone(timedelta(hours=5, minutes=30))
DATA_DIR = Path(__file__).parent / "data"
DATA_DIR.mkdir(exist_ok=True)

LIVE_FILE = DATA_DIR / "live.json"
NEWS_FILE = DATA_DIR / "news.json"
PORTFOLIO_FILE = DATA_DIR / "portfolio.json"
HISTORY_FILE = DATA_DIR / "history.json"

# ── Yahoo Finance Tickers ──
TICKERS = {
    "gold_usd":    "GC=F",
    "silver_usd":  "SI=F",
    "crude_wti":   "CL=F",
    "nifty50":     "^NSEI",
    "sensex":      "^BSESN",
    "inr_usd":     "USDINR=X",
    "dxy":         "DX-Y.NYB",
    "us_10y":      "^TNX",
    "sp500":       "^GSPC",
    "btc_usd":     "BTC-USD",
    "nasdaq":      "^IXIC",
    "nvda":        "NVDA",
    "msft":        "MSFT",
    "aapl":        "AAPL",
    "googl":       "GOOGL",
    "meta":        "META",
}

# ── News RSS Keywords ──
NEWS_QUERIES = [
    "gold price",
    "crude oil price",
    "Nifty 50",
    "Federal Reserve rate",
    "Hormuz strait",
    "Kevin Warsh Fed",
    "India stock market",
    "US recession 2026",
]

# ── IndMoney CSV watch path ──
INDMONEY_WATCH = os.path.expanduser("~/Downloads")


def _now_ist():
    return datetime.now(IST).strftime("%Y-%m-%d %H:%M:%S IST")


def _safe_write(path, data):
    tmp = str(path) + ".tmp"
    with open(tmp, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False, default=str)
    os.replace(tmp, str(path))


# ═══════════════════════════════════════════════════════════
# PRICE FETCHER (Yahoo Finance via yfinance)
# ═══════════════════════════════════════════════════════════
def fetch_prices():
    try:
        import yfinance as yf
    except ImportError:
        print("[WARN] yfinance not installed. Run: pip3 install yfinance")
        return False

    print(f"[{_now_ist()}] Fetching live prices...")
    try:
        symbols = list(TICKERS.values())
        data = yf.download(symbols, period="2d", interval="1d", progress=False, threads=True)

        prices = {}
        for key, ticker in TICKERS.items():
            try:
                close_col = ("Close", ticker) if isinstance(data.columns, type(data.columns)) else "Close"
                if ("Close", ticker) in data.columns:
                    vals = data[("Close", ticker)].dropna()
                elif "Close" in data.columns:
                    vals = data["Close"].dropna()
                else:
                    vals = None

                if vals is not None and len(vals) > 0:
                    current = float(vals.iloc[-1])
                    prev = float(vals.iloc[-2]) if len(vals) > 1 else current
                    change = current - prev
                    change_pct = (change / prev * 100) if prev != 0 else 0
                    prices[key] = {
                        "value": round(current, 2),
                        "prev": round(prev, 2),
                        "change": round(change, 2),
                        "change_pct": round(change_pct, 2),
                    }
            except Exception as e:
                print(f"  [WARN] {key}/{ticker}: {e}")

        # ── Computed ratios ──
        gold = prices.get("gold_usd", {}).get("value", 0)
        silver = prices.get("silver_usd", {}).get("value", 1)
        nifty = prices.get("nifty50", {}).get("value", 0)
        inr = prices.get("inr_usd", {}).get("value", 86)

        if gold and silver:
            gs_ratio = round(gold / silver, 2)
            prices["gold_silver_ratio"] = {"value": gs_ratio, "label": "Gold/Silver Ratio"}

        def _fetch_zerodha_gold_inr():
            import urllib.request
            import re
            import ssl
            try:
                ctx = ssl.create_default_context()
                ctx.check_hostname = False
                ctx.verify_mode = ssl.CERT_NONE
                req = urllib.request.Request("https://www.zerodhafundhouse.com/live-gold-price", headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
                html = urllib.request.urlopen(req, timeout=10, context=ctx).read().decode('utf-8')
                match = re.search(r"Today(?:&#x27;|')s gold rate is ₹([\d,]+(?:\.\d+)?)", html)
                if match:
                    val = float(match.group(1).replace(",", ""))
                    return val / 10.0 # Per gram
            except Exception as e:
                print("  [WARN] Zerodha gold fetch error:", e)
            return None

        gold_inr_gram = _fetch_zerodha_gold_inr()
        if not gold_inr_gram and gold and inr:
            # Fallback with 15% estimated import duty and premium
            gold_inr_gram = (gold * inr / 31.1035) * 1.15

        if nifty and gold_inr_gram:
            ng_ratio = round(nifty / gold_inr_gram, 2)
            prices["nifty_gold_ratio"] = {"value": ng_ratio, "label": "Nifty/Gold Ratio"}
            prices["gold_inr_gram"] = {"value": round(gold_inr_gram, 0), "label": "Gold ₹/gram"}

        live = {
            "prices": prices,
            "updated_at": _now_ist(),
            "source": "Yahoo Finance",
        }
        _safe_write(LIVE_FILE, live)
        print(f"[{_now_ist()}] ✓ Prices updated: {len(prices)} instruments")

        # ── Append to history (once per day) ──
        _append_history(prices)
        return True

    except Exception as e:
        print(f"[{_now_ist()}] ✗ Price fetch error: {e}")
        traceback.print_exc()
        return False


def _append_history(prices):
    today = datetime.now(IST).strftime("%Y-%m-%d")
    history = []
    if HISTORY_FILE.exists():
        try:
            history = json.loads(HISTORY_FILE.read_text())
        except:
            history = []

    # Only append if last entry isn't today
    if history and history[-1].get("date") == today:
        return

    snapshot = {"date": today}
    for key, val in prices.items():
        if isinstance(val, dict) and "value" in val:
            snapshot[key] = val["value"]

    history.append(snapshot)
    _safe_write(HISTORY_FILE, history)
    print(f"[{_now_ist()}] ✓ History appended for {today}")


# ═══════════════════════════════════════════════════════════
# NEWS FETCHER (Google News RSS)
# ═══════════════════════════════════════════════════════════
def fetch_news():
    try:
        import yfinance as yf
    except ImportError:
        print("[WARN] yfinance not installed for news.")
        return False

    print(f"[{_now_ist()}] Fetching news via yfinance...")
    all_items = []
    seen_titles = set()

    # Tickers that produce relevant macro/finance news
    news_tickers = {
        "GC=F": "gold price",
        "SI=F": "silver price",
        "CL=F": "crude oil",
        "^NSEI": "Nifty 50",
        "^GSPC": "S&P 500",
        "USDINR=X": "INR/USD",
        "^TNX": "US bonds",
        "BTC-USD": "Bitcoin",
        "NVDA": "Nvidia",
        "MSFT": "Microsoft",
        "AAPL": "Apple",
        "GOOGL": "Google",
        "META": "Meta"
    }

    for ticker_sym, category in news_tickers.items():
        try:
            tk = yf.Ticker(ticker_sym)
            news_list = tk.news or []
            for item in news_list[:5]:
                content = item.get("content", item)
                title = content.get("title", "").strip()
                if not title or title in seen_titles:
                    continue
                seen_titles.add(title)

                pub_date = content.get("pubDate") or content.get("displayTime", "")
                try:
                    from datetime import datetime as dt
                    pub_dt = dt.fromisoformat(pub_date.replace("Z", "+00:00"))
                    pub_str = pub_dt.strftime("%b %d, %H:%M")
                    pub_ts = pub_dt.timestamp()
                except:
                    pub_str = pub_date[:16] if pub_date else ""
                    pub_ts = 0

                provider = content.get("provider", {})
                click_url = content.get("clickThroughUrl", {})
                canonical = content.get("canonicalUrl", {})

                all_items.append({
                    "title": title,
                    "link": click_url.get("url") or canonical.get("url", ""),
                    "source": provider.get("displayName", "Yahoo Finance"),
                    "published": pub_str,
                    "timestamp": pub_ts,
                    "query": category,
                    "summary": (content.get("summary") or "")[:200],
                })
        except Exception as e:
            print(f"  [WARN] News for {ticker_sym}: {e}")

    # Sort by timestamp descending, keep top 30
    all_items.sort(key=lambda x: x.get("timestamp", 0), reverse=True)
    all_items = all_items[:30]

    news = {
        "items": all_items,
        "updated_at": _now_ist(),
        "count": len(all_items),
    }
    _safe_write(NEWS_FILE, news)
    print(f"[{_now_ist()}] ✓ News updated: {len(all_items)} headlines")
    return True


# ═══════════════════════════════════════════════════════════
# PORTFOLIO WATCHER (IndMoney CSV)
# ═══════════════════════════════════════════════════════════
def scan_portfolio():
    """Scan ~/Downloads for indmoney*.csv and parse latest one."""
    pattern = os.path.join(INDMONEY_WATCH, "indmoney*.csv")
    files = glob.glob(pattern, recursive=False)
    # Also check for common export names
    pattern2 = os.path.join(INDMONEY_WATCH, "INDmoney*.csv")
    files += glob.glob(pattern2, recursive=False)
    pattern3 = os.path.join(INDMONEY_WATCH, "portfolio*.csv")
    files += glob.glob(pattern3, recursive=False)

    if not files:
        return False

    # Pick most recently modified
    latest = max(files, key=os.path.getmtime)
    mtime = os.path.getmtime(latest)

    # Check if we already processed this file
    if PORTFOLIO_FILE.exists():
        try:
            existing = json.loads(PORTFOLIO_FILE.read_text())
            if existing.get("source_mtime") == mtime:
                return False  # Already processed
        except:
            pass

    print(f"[{_now_ist()}] Parsing portfolio: {latest}")
    try:
        holdings = []
        with open(latest, "r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Normalize column names
                norm = {k.strip().lower().replace(" ", "_"): v.strip() for k, v in row.items()}
                holding = {
                    "name": norm.get("stock_name") or norm.get("asset_name") or norm.get("name", "Unknown"),
                    "category": norm.get("category") or norm.get("type", "Other"),
                    "broker": norm.get("broker") or norm.get("platform", "IndMoney"),
                    "invested": _parse_num(norm.get("invested") or norm.get("invested_value") or norm.get("buy_value")),
                    "current": _parse_num(norm.get("current") or norm.get("current_value") or norm.get("market_value")),
                    "quantity": _parse_num(norm.get("quantity") or norm.get("qty")),
                }
                if holding["name"] != "Unknown":
                    holdings.append(holding)

        portfolio = {
            "holdings": holdings,
            "source_file": os.path.basename(latest),
            "source_mtime": mtime,
            "updated_at": _now_ist(),
            "count": len(holdings),
        }
        _safe_write(PORTFOLIO_FILE, portfolio)
        print(f"[{_now_ist()}] ✓ Portfolio updated: {len(holdings)} holdings from {os.path.basename(latest)}")
        return True

    except Exception as e:
        print(f"[{_now_ist()}] ✗ Portfolio parse error: {e}")
        traceback.print_exc()
        return False


def _parse_num(val):
    if not val:
        return None
    try:
        return float(str(val).replace(",", "").replace("₹", "").replace("$", "").strip())
    except:
        return None


# ═══════════════════════════════════════════════════════════
# BACKGROUND SCHEDULER THREADS
# ═══════════════════════════════════════════════════════════
_stop_event = threading.Event()


def _price_loop(interval_sec=1800):
    """Fetch prices every 30 minutes."""
    fetch_prices()  # Immediate first fetch
    while not _stop_event.is_set():
        _stop_event.wait(interval_sec)
        if not _stop_event.is_set():
            fetch_prices()


def _news_loop(interval_sec=300):
    """Fetch news every 5 minutes."""
    fetch_news()  # Immediate first fetch
    while not _stop_event.is_set():
        _stop_event.wait(interval_sec)
        if not _stop_event.is_set():
            fetch_news()


def _portfolio_loop(interval_sec=60):
    """Check for new IndMoney CSV every 60 seconds."""
    scan_portfolio()
    while not _stop_event.is_set():
        _stop_event.wait(interval_sec)
        if not _stop_event.is_set():
            scan_portfolio()


def start_background_fetchers():
    """Start all background threads. Call from server.py."""
    threads = [
        threading.Thread(target=_price_loop, daemon=True, name="PriceFetcher"),
        threading.Thread(target=_news_loop, daemon=True, name="NewsFetcher"),
        threading.Thread(target=_portfolio_loop, daemon=True, name="PortfolioWatcher"),
    ]
    for t in threads:
        t.start()
        print(f"[{_now_ist()}] Started background thread: {t.name}")
    return threads


def stop_background_fetchers():
    _stop_event.set()


if __name__ == "__main__":
    print("Running one-shot fetch...")
    fetch_prices()
    fetch_news()
    scan_portfolio()
    print("Done.")
