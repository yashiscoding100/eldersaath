import urllib.request
import uuid
import codecs

with open("resume.tex", "r", encoding="utf-8") as f:
    tex_code = f.read()

url = "https://latexonline.cc/data"
boundary = uuid.uuid4().hex

body = []
# file parameter
body.append(f"--{boundary}")
body.append('Content-Disposition: form-data; name="file"; filename="document.tex"')
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
    print("Requesting from latexonline.cc/data...")
    with urllib.request.urlopen(req, timeout=30) as res:
        content = res.read()
        if content.startswith(b'%PDF'):
            with open("C:/Users/Yash/Desktop/Yash_Saxena_Resume.pdf", "wb") as f:
                f.write(content)
            print("Success! Copied directly to Desktop.")
        else:
            print("Error: API did not return a PDF.")
except Exception as e:
    print("Exception:", e)
