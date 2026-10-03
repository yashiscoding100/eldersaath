import urllib.request
import uuid
import codecs

with open("resume.tex", "r", encoding="utf-8") as f:
    tex_code = f.read()

url = "https://texlive.net/cgi-bin/latexcgi"
boundary = uuid.uuid4().hex

body = []
# engine
body.append(f"--{boundary}")
body.append('Content-Disposition: form-data; name="engine"')
body.append('')
body.append('pdflatex')
# return
body.append(f"--{boundary}")
body.append('Content-Disposition: form-data; name="return"')
body.append('')
body.append('pdf')
# filecontents
body.append(f"--{boundary}")
body.append('Content-Disposition: form-data; name="filecontents"; filename="document.tex"')
body.append('Content-Type: application/x-tex')
body.append('')
body.append(tex_code)
# End
body.append(f"--{boundary}--")
body.append('')

body_bytes = "\r\n".join(body).encode('utf-8')

req = urllib.request.Request(url, data=body_bytes)
req.add_header('Content-Type', f'multipart/form-data; boundary={boundary}')

try:
    with urllib.request.urlopen(req) as res:
        content = res.read()
        if content.startswith(b'%PDF'):
            with open("Yash_Saxena_Resume.pdf", "wb") as f:
                f.write(content)
            print("Success! PDF generated.")
        else:
            print("Error: API did not return a PDF. Returned:")
            print(content[:200])
except Exception as e:
    print("Exception:", e)
