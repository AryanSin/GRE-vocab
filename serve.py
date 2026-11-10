#!/usr/bin/env python3
"""
serve.py - Local development and viewing server for Vocab Galaxy
"""

import http.server
import socketserver
import webbrowser
import os
import sys
import json

PORT = 8080
NOTES_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "notes.json")

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.join(os.path.dirname(__file__), "web"), **kwargs)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        if self.path == "/api/notes" or self.path.startswith("/api/notes?"):
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            notes = {}
            if os.path.exists(NOTES_FILE):
                try:
                    with open(NOTES_FILE, "r", encoding="utf-8") as f:
                        notes = json.load(f)
                except Exception:
                    notes = {}
            self.wfile.write(json.dumps({"notes": notes}).encode("utf-8"))
            return
        super().do_GET()

    def do_POST(self):
        if self.path == "/api/notes":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode("utf-8")
            try:
                data = json.loads(body)
                notes = {}
                if os.path.exists(NOTES_FILE):
                    try:
                        with open(NOTES_FILE, "r", encoding="utf-8") as f:
                            notes = json.load(f)
                    except Exception:
                        notes = {}
                
                if "notes" in data and isinstance(data["notes"], dict):
                    notes = data["notes"]
                elif "word" in data:
                    w = str(data["word"]).strip().lower()
                    note_text = str(data.get("note", "")).strip()
                    if note_text:
                        notes[w] = note_text
                    else:
                        notes.pop(w, None)
                
                # Atomic write to notes.json
                temp_file = NOTES_FILE + ".tmp"
                with open(temp_file, "w", encoding="utf-8") as f:
                    json.dump(notes, f, ensure_ascii=False, indent=2)
                os.replace(temp_file, NOTES_FILE)

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "ok", "count": len(notes)}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
            return
        self.send_error(404, "Endpoint not found")

def main():
    port = PORT
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass

    # Find open port if busy
    while True:
        try:
            with socketserver.TCPServer(("", port), Handler) as httpd:
                url = f"http://localhost:{port}/"
                print(f"\n✨ Vocab Galaxy is running at: {url}")
                print("💡 Press Ctrl+C to stop the server\n")
                try:
                    webbrowser.open(url)
                except Exception:
                    pass
                httpd.serve_forever()
        except OSError:
            port += 1

if __name__ == "__main__":
    main()
