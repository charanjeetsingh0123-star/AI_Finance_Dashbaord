"""
server.py — Upgraded HTTP server with API endpoints + background data fetchers
Serves: static files, /api/live, /api/news, /api/portfolio, /api/refresh
"""
import http.server
import socketserver
import json
import sys
import os
import webbrowser
from pathlib import Path
from datetime import datetime, timezone, timedelta

PORT = int(os.environ.get("PORT", 8000))
DATA_DIR = Path(__file__).parent / "data"
DATA_DIR.mkdir(exist_ok=True)


class DashboardHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler with API endpoints and CORS."""

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def do_GET(self):
        # ── API Routes ──
        if self.path == "/api/live":
            self._serve_json(DATA_DIR / "live.json")
        elif self.path == "/api/news":
            self._serve_json(DATA_DIR / "news.json")
        elif self.path == "/api/portfolio":
            self._serve_json(DATA_DIR / "portfolio.json")
        elif self.path == "/api/history":
            self._serve_json(DATA_DIR / "history.json")
        elif self.path == "/api/refresh":
            self._handle_refresh()
        elif self.path == "/api/status":
            self._handle_status()
        else:
            super().do_GET()

    def do_POST(self):
        if self.path == "/api/note":
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                note_text = data.get("note", "")
                
                # Append to local JSON as fallback/log
                notes_file = DATA_DIR / "notes.json"
                notes = []
                if notes_file.exists():
                    try:
                        notes = json.loads(notes_file.read_text())
                    except:
                        pass
                
                new_note = {
                    "timestamp": datetime.now(timezone(timedelta(hours=5, minutes=30))).strftime("%Y-%m-%d %H:%M:%S IST"),
                    "note": note_text
                }
                notes.append(new_note)
                
                tmp = str(notes_file) + ".tmp"
                with open(tmp, "w") as f:
                    json.dump(notes, f, indent=2, ensure_ascii=False)
                os.replace(tmp, str(notes_file))
                
                # TODO: Integrate with Google Docs API here when credentials.json is provided
                print(f"\\n[NOTE SAVED] {note_text}\\n")
                
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Note saved successfully"}).encode())
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode())
        else:
            self.send_error(404, "Endpoint not found")

    def _serve_json(self, filepath):
        if filepath.exists():
            data = filepath.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(data)
        else:
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"status":"pending","message":"Data not yet fetched. Wait 30 seconds."}')

    def _handle_refresh(self):
        """Force immediate refresh of all data."""
        import threading
        def _do():
            try:
                from data_fetcher import fetch_prices, fetch_news, scan_portfolio
                fetch_prices()
                fetch_news()
                scan_portfolio()
            except Exception as e:
                print(f"Refresh error: {e}")
        threading.Thread(target=_do, daemon=True).start()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps({"status": "refreshing"}).encode())

    def _handle_status(self):
        status = {}
        for name in ["live", "news", "portfolio", "history"]:
            f = DATA_DIR / f"{name}.json"
            if f.exists():
                try:
                    d = json.loads(f.read_text())
                    status[name] = {
                        "exists": True,
                        "updated_at": d.get("updated_at", "unknown"),
                        "size": f.stat().st_size,
                    }
                except:
                    status[name] = {"exists": True, "error": "parse_fail"}
            else:
                status[name] = {"exists": False}
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(status, indent=2).encode())

    def log_message(self, format, *args):
        # Suppress noisy logs for API polling, keep others
        if "/api/" in str(args[0]):
            return
        super().log_message(format, *args)


def main():
    print(f"╔══════════════════════════════════════════════╗")
    print(f"║  MasterMacro Dashboard Server v2.0           ║")
    print(f"║  http://localhost:{PORT}                        ║")
    print(f"║  API: /api/live  /api/news  /api/portfolio    ║")
    print(f"║  POST: /api/note                              ║")
    print(f"║  Refresh: /api/refresh   Status: /api/status  ║")
    print(f"╚══════════════════════════════════════════════╝")

    # Start background data fetchers
    try:
        from data_fetcher import start_background_fetchers
        start_background_fetchers()
        print("[OK] Background fetchers started")
    except Exception as e:
        print(f"[WARN] Could not start fetchers: {e}")
        print("       Dashboard will work but without live data.")

    socketserver.TCPServer.allow_reuse_address = True
    if not os.environ.get("PORT"):
        webbrowser.open(f"http://localhost:{PORT}")

    try:
        with socketserver.TCPServer(("", PORT), DashboardHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down...")
        try:
            from data_fetcher import stop_background_fetchers
            stop_background_fetchers()
        except:
            pass
        sys.exit(0)
    except Exception as e:
        print(f"Server error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
