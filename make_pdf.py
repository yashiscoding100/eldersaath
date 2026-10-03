from fpdf import FPDF

class ResumePDF(FPDF):
    def header(self):
        pass
    def footer(self):
        pass
    
    def title_section(self):
        self.set_font('helvetica', 'B', 24)
        self.cell(0, 10, 'Yash Saxena', align='C', new_x='LMARGIN', new_y='NEXT')
        self.set_font('helvetica', '', 10)
        self.cell(0, 6, '+91 9650731278 | yash.saxena4203@gmail.com | LinkedIn | GitHub | Bhopal, India', align='C', new_x='LMARGIN', new_y='NEXT')
        self.ln(4)
        
    def section_title(self, title):
        self.set_font('helvetica', 'B', 14)
        self.cell(0, 6, title, new_x='LMARGIN', new_y='NEXT')
        self.line(self.get_x(), self.get_y(), self.get_x() + 190, self.get_y())
        self.ln(3)

    def subheading(self, title, subtitle, right1, right2):
        self.set_font('helvetica', 'B', 11)
        self.cell(130, 6, title, new_x='RIGHT')
        self.set_font('helvetica', '', 10)
        self.cell(60, 6, right1, align='R', new_x='LMARGIN', new_y='NEXT')
        
        self.set_font('helvetica', 'I', 10)
        self.cell(130, 6, subtitle, new_x='RIGHT')
        self.set_font('helvetica', 'I', 10)
        self.cell(60, 6, right2, align='R', new_x='LMARGIN', new_y='NEXT')
        self.ln(2)

    def bullet(self, text):
        self.set_font('helvetica', '', 10)
        # Using a simple hyphen or bullet
        self.set_x(15)
        self.multi_cell(180, 5, '-  ' + text, new_x='LMARGIN', new_y='NEXT')
        self.ln(1)

    def basic_item(self, text):
        self.set_font('helvetica', '', 10)
        self.set_x(10)
        self.multi_cell(190, 5, text, new_x='LMARGIN', new_y='NEXT')
        self.ln(1)

pdf = ResumePDF()
pdf.add_page()

pdf.title_section()

pdf.section_title('Education')
pdf.subheading('VIT Bhopal University', 'Bachelor of Technology in Computer Science Engineering', 'GPA: 7.82/10', 'Bhopal, India')
pdf.subheading('Delhi Public School', 'Senior Secondary', '79.4%', 'Delhi, India | 05/2023')
pdf.subheading('Delhi Public School', 'Secondary', '90.4%', 'Delhi, India | 08/2021')
pdf.ln(2)

pdf.section_title('Experience')
pdf.subheading('The Matrix Club', 'Lead - Finance & Sponsorship', 'Bhopal, India', '09/2025 - Present')
pdf.bullet('Led financial strategy and budget management for club events, overseeing resource planning, cost optimization, and sponsorship outreach.')
pdf.ln(2)

pdf.section_title('Projects')
pdf.subheading('ElderSaath (Remote Elderly Healthcare Platform)', 'Full-Stack Developer', '08/2026 - Present', '')
pdf.bullet('Architected and deployed a full-stack remote eldercare application utilizing Next.js, React, Tailwind CSS, and Prisma (PostgreSQL).')
pdf.bullet('Engineered strict Role-Based Access Control (RBAC) via NextAuth to securely separate Caretaker management dashboards from simplified Elder interfaces.')
pdf.bullet('Developed a dynamic serverless backend scheduler and API engine to handle custom medication and task intervals with automatic timezone normalization (IST).')
pdf.bullet('Packaged the web application into a native Android app using Capacitor, integrating high-priority Firebase Cloud Messaging (FCM) and Full-Screen Intents.')
pdf.bullet('Built a resilient native alarm system that successfully bypasses strict OEM battery optimization software on devices like Redmi and Samsung.')
pdf.bullet('Built a secure in-app medical document vault using Base64 encoding and React Blob URLs to securely render cross-origin medical data.')
pdf.ln(2)

pdf.section_title('Publications & Certifications')
pdf.bullet('Optimizing Mentorship Pairing Using a Hybrid Weighted Bipartite Graph Model - Co-author; Springer, Forthcoming 2026')
pdf.bullet('Introduction To Machine Learning - NPTEL (05/2025)')
pdf.bullet('The Bits and Bytes of Computer Networking - Google, Coursera (10/2024)')
pdf.bullet('Marketing Analytics - NPTEL (05/2026)')
pdf.bullet('Programming in Java - Vityarthi (04/2025)')
pdf.ln(2)

pdf.section_title('Leadership & Activities')
pdf.bullet('Placement Process Volunteer, VIT Bhopal University (01/2026) - Coordinated campus recruitment activities across multiple hiring drives.')
pdf.bullet('solVIT Hackathon (03/2025) - Ideated a hostel-life solution addressing everyday student needs, organized by the hostel committee.')
pdf.ln(2)

pdf.section_title('Technical Skills')
pdf.basic_item('Front-End Development: HTML, CSS, React, Next.js, Tailwind CSS')
pdf.basic_item('Languages: Java, TypeScript, JavaScript')
pdf.basic_item('Databases: MySQL, PostgreSQL, Prisma ORM')
pdf.basic_item('Core CS: DSA, OOP, Operating Systems, Computer Networks, DBMS')
pdf.basic_item('Tools & Version Control: Git, GitHub, Visual Studio, VS Code, Capacitor')
pdf.basic_item('Cloud & OS: AWS (Foundational Knowledge), Firebase')
pdf.ln(2)

pdf.section_title('Soft Skills')
pdf.basic_item('Problem Solving - Analytical Thinking - Team Collaboration - Effective Communication - Leadership (Finance Lead, The Matrix Club) - Stakeholder Management - Project Coordination - Financial Management')

pdf.output('Yash_Saxena_Resume.pdf')
