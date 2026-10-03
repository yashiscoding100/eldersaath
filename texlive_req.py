import requests

url = "https://texlive.net/cgi-bin/latexcgi"

with open("resume.tex", "r", encoding="utf-8") as f:
    tex = f.read()

data = {
    "engine": "pdflatex",
    "return": "pdf"
}
files = {
    "filecontents": ("document.tex", tex, "application/x-tex")
}

print("Requesting PDF...")
res = requests.post(url, data=data, files=files)

if res.status_code == 200 and res.content.startswith(b'%PDF'):
    with open("Yash_Saxena_Resume.pdf", "wb") as f:
        f.write(res.content)
    print("Success! Saved as Yash_Saxena_Resume.pdf")
else:
    print(f"Error {res.status_code}: {res.text[:200]}")
