import urllib.request
import urllib.parse
import sys

tex_content = r'''\documentclass[letterpaper,11pt]{article}

\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}
\input{glyphtounicode}

\pagestyle{fancy}
\fancyhf{} 
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-.5in}
\addtolength{\textheight}{1.0in}

\urlstyle{same}

\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

\titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

\pdfgentounicode=1

\newcommand{\resumeItem}[1]{
  \item\small{
    {#1 \vspace{-2pt}}
  }
}

\newcommand{\resumeSubheading}[4]{
  \vspace{-2pt}\item
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & #2 \\
      \textit{\small#3} & \textit{\small #4} \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeSubSubheading}[2]{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \textit{\small#1} & \textit{\small #2} \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeProjectHeading}[2]{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \small#1 & #2 \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeSubItem}[1]{\resumeItem{#1}\vspace{-4pt}}

\renewcommand\labelitemii{$\vcenter{\hbox{\tiny$\bullet$}}$}

\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.15in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}

\begin{document}

\begin{center}
    \textbf{\Huge \scshape Yash Saxena} \\ \vspace{1pt}
    \small +91 9650731278 $|$ \href{mailto:yash.saxena4203@gmail.com}{\underline{yash.saxena4203@gmail.com}} $|$ 
    \href{https://linkedin.com/in/yashsaxena}{\underline{LinkedIn}} $|$
    \href{https://github.com/yashiscoding100}{\underline{GitHub}} $|$
    Bhopal, India
\end{center}

\section{Education}
  \resumeSubHeadingListStart
    \resumeSubheading
      {VIT Bhopal University}{GPA: 7.82/10}
      {Bachelor of Technology in Computer Science Engineering}{Bhopal, India}
    \vspace{2pt}
    \resumeSubheading
      {Delhi Public School}{79.4\%}
      {Senior Secondary}{Delhi, India \quad 05/2023}
    \vspace{2pt}
    \resumeSubheading
      {Delhi Public School}{90.4\%}
      {Secondary}{Delhi, India \quad 08/2021}
  \resumeSubHeadingListEnd

\section{Experience}
  \resumeSubHeadingListStart
    \resumeSubheading
      {The Matrix Club}{Bhopal, India}
      {Lead -- Finance \& Sponsorship}{09/2025 -- Present}
      \resumeItemListStart
        \resumeItem{Led financial strategy and budget management for club events, overseeing resource planning, cost optimization, and sponsorship outreach.}
      \resumeItemListEnd
  \resumeSubHeadingListEnd

\section{Projects}
    \resumeSubHeadingListStart
      \resumeProjectHeading
          {\textbf{ElderSaath} (Remote Elderly Healthcare Platform)}{08/2026 -- Present}
          \resumeItemListStart
            \resumeItem{Architected and deployed a full-stack, cross-platform remote eldercare application utilizing \textbf{Next.js, React, Tailwind CSS, and Prisma (PostgreSQL)} for the core web architecture.}
            \resumeItem{Engineered strict \textbf{Role-Based Access Control (RBAC)} via NextAuth to securely separate Caretaker management dashboards from simplified Elder interfaces.}
            \resumeItem{Developed a dynamic serverless backend scheduler and API engine to handle custom medication and task intervals with automatic timezone normalization (IST).}
            \resumeItem{Packaged the web application into a native Android app using \textbf{Capacitor}, integrating high-priority \textbf{Firebase Cloud Messaging (FCM)} and Full-Screen Intents to create a robust native alarm system that successfully bypasses strict OEM battery optimization software (e.g., Xiaomi/Samsung).}
            \resumeItem{Built a secure in-app medical document vault using Base64 encoding and React Blob URLs to securely render cross-origin medical data across both web and mobile environments.}
          \resumeItemListEnd
    \resumeSubHeadingListEnd

\section{Publications \& Certifications}
  \resumeSubHeadingListStart
    \resumeItem{\textbf{Optimizing Mentorship Pairing Using a Hybrid Weighted Bipartite Graph Model} -- Co-author; Springer, Forthcoming 2026}
    \resumeItem{\textbf{Introduction To Machine Learning} -- NPTEL (05/2025)}
    \resumeItem{\textbf{The Bits and Bytes of Computer Networking} -- Google, Coursera (10/2024)}
    \resumeItem{\textbf{Marketing Analytics} -- NPTEL (05/2026)}
    \resumeItem{\textbf{Programming in Java} -- Vityarthi (04/2025)}
  \resumeSubHeadingListEnd

\section{Leadership \& Activities}
  \resumeSubHeadingListStart
    \resumeItem{\textbf{Placement Process Volunteer}, VIT Bhopal University (01/2026) -- Coordinated campus recruitment activities across multiple hiring drives.}
    \resumeItem{\textbf{solVIT Hackathon} (03/2025) -- Ideated a hostel-life solution addressing everyday student needs, organized by the hostel committee.}
  \resumeSubHeadingListEnd

\section{Technical Skills}
 \begin{itemize}[leftmargin=0.15in, label={}]
    \small{\item{
     \textbf{Front-End Development}{: HTML, CSS, React, Next.js, Tailwind CSS} \\
     \textbf{Languages}{: Java, TypeScript, JavaScript} \\
     \textbf{Databases}{: MySQL, PostgreSQL, Prisma ORM} \\
     \textbf{Core CS}{: DSA, OOP, Operating Systems, Computer Networks, DBMS} \\
     \textbf{Tools \& Version Control}{: Git, GitHub, Visual Studio, VS Code, Capacitor} \\
     \textbf{Cloud \& OS}{: AWS (Foundational Knowledge), Firebase}
    }}
 \end{itemize}

\section{Soft Skills}
 \begin{itemize}[leftmargin=0.15in, label={}]
    \small{\item{
     Problem Solving $\cdot$ Analytical Thinking $\cdot$ Team Collaboration $\cdot$ Effective Communication $\cdot$ Leadership (Finance Lead, The Matrix Club) $\cdot$ Stakeholder Management $\cdot$ Project Coordination $\cdot$ Financial Management
    }}
 \end{itemize}

\end{document}
'''

import json

url = 'https://latexonline.cc/compile'
# Actually, latexonline allows POST with a file or URL.
# Wait, let's use the GET method with URL encoding. But it has a max length limit sometimes.
# I'll try the POST method to 'data' or similar if GET fails.
url_get = 'https://latexonline.cc/compile?text=' + urllib.parse.quote(tex_content)

try:
    req = urllib.request.Request(url_get, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        with open('Yash_Saxena_Resume.pdf', 'wb') as f:
            f.write(response.read())
    print("Success")
except Exception as e:
    print("Error:", e)
