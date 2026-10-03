import urllib.request
import urllib.parse
import sys

tex_content = r'''\documentclass{article}
\begin{document}
Hello from Python!
\end{document}'''

url = 'https://latexonline.cc/compile'
# Wait, latexonline.cc expects multipart/form-data for POST or GET with ?text=
url_get = 'https://latexonline.cc/compile?text=' + urllib.parse.quote(tex_content)

try:
    req = urllib.request.Request(url_get, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        with open('test_api.pdf', 'wb') as f:
            f.write(response.read())
    print("Success")
except Exception as e:
    print("Error:", e)
