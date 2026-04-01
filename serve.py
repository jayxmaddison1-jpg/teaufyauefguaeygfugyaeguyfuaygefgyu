import http.server
import socketserver
import webbrowser
import os

PORT = 3000

os.chdir(os.path.dirname(os.path.abspath(__file__)))

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/dashboard' or self.path == '/dashboard/':
            self.path = '/dashboard/index.html'
        elif self.path == '/':
            self.path = '/index.html'
        return super().do_GET()

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    url = f"http://localhost:{PORT}"
    print(f"Server running at {url}")
    print(f"Bio page:   {url}")
    print(f"Dashboard:  {url}/dashboard")
    print("Press Ctrl+C to stop.")
    webbrowser.open(url)
    httpd.serve_forever()
