import os

with open("resume.tex", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(r"\input{glyphtounicode}", "% \\input{glyphtounicode}")
content = content.replace(r"\pdfgentounicode=1", "% \\pdfgentounicode=1")

with open("resume.tex", "w", encoding="utf-8") as f:
    f.write(content)
