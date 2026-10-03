import os
import re

with open("resume.tex", "r", encoding="utf-8") as f:
    content = f.read()

# Change font size from 11pt to 10pt
content = content.replace(r"\documentclass[letterpaper,11pt]{article}", r"\documentclass[letterpaper,10pt]{article}")

# Update LinkedIn URL
content = content.replace(r"https://linkedin.com/in/yashsaxena", r"https://www.linkedin.com/in/yash-saxena-5a6974279")

with open("resume.tex", "w", encoding="utf-8") as f:
    f.write(content)
