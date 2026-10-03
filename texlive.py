import urllib.request
import urllib.parse
import os

with open("resume.tex", "r", encoding="utf-8") as f:
    tex_code = f.read()

url = "https://texlive.net/cgi-bin/latexcgi"
data = urllib.parse.urlencode({
    "filecontents": tex_code,
    "filename": "document.tex",
    "engine": "pdflatex",
    "return": "pdf"
}).encode('utf-8')

req = urllib.request.Request(url, data=data)
try:
    with urllib.request.urlopen(req) as response:
        with open("Yash_Saxena_Resume_LaTeX.pdf", "wb") as f:
            f.write(response.read())
    print("Success")
except Exception as e:
    print("Error:", e)
