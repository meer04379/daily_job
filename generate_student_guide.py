import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            super().showPage()
        super().save()

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#64748b"))
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "Daily Job Portal - Full Automation & Deployment Guide")
            self.setStrokeColor(colors.HexColor("#e2e8f0"))
            self.setLineWidth(0.5)
            self.line(54, 742, 558, 742)
        
        # Footer
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 36, page_text)
        self.drawString(54, 36, "Prepared for Students • Automation Masterclass")
        self.setStrokeColor(colors.HexColor("#e2e8f0"))
        self.setLineWidth(0.5)
        self.line(54, 48, 558, 48)
        self.restoreState()

def build_pdf():
    pdf_filename = "Daily_Job_Automation_Student_Guide.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor("#0f172a"),
        alignment=0,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#2563eb"),
        alignment=0,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'Heading1Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14.5,
        textColor=colors.HexColor("#334155"),
        spaceAfter=6
    )

    code_style = ParagraphStyle(
        'CodeStyle',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#0f172a"),
        backColor=colors.HexColor("#f1f5f9"),
        borderPadding=6,
        spaceAfter=8
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor("#1e3a8a"),
    )

    story = []

    # Title Banner Block
    story.append(Paragraph("Daily Job Portal: Complete Automation & Deployment Guide", title_style))
    story.append(Paragraph("A Step-by-Step Training Manual for Teaching Web Automation & CI/CD", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#2563eb"), spaceAfter=15))

    # Meta Info Table
    meta_data = [
        [
            Paragraph("<b>Project:</b> Daily Job Portal", body_style),
            Paragraph("<b>Stack:</b> HTML5, CSS3, JS, Node.js", body_style)
        ],
        [
            Paragraph("<b>Repo:</b> github.com/meer04379/daily_job", body_style),
            Paragraph("<b>Automation:</b> GitHub Actions (Cron CI/CD)", body_style)
        ]
    ]
    meta_table = Table(meta_data, colWidths=[250, 254])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#e2e8f0")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 15))

    # Project Overview Box
    overview_text = (
        "<b>Summary for Students:</b> Yeh project sikhata hai ke kaise ek modern dynamic website banakar "
        "usko bina kisi manual mehnat ke 100% automated banaya jata hai. Har roz background robot (GitHub Actions) "
        "chalega, verified jobs scrape karega, JSON database update karega, aur website ko live deploy karega."
    )
    callout_table = Table([[Paragraph(overview_text, callout_style)]], colWidths=[504])
    callout_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#eff6ff")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#bfdbfe")),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(callout_table)
    story.append(Spacer(1, 12))

    # Steps Definitions
    steps = [
        (
            "Step 1: Frontend Website Designing (HTML5 & CSS3)",
            "Sabse pehle humne ek high-converting, modern glassmorphic job portal design kiya.",
            [
                "<b>index.html:</b> Semantic structure banaya jisme Hero Banner, Live Job Search Filter, Category Pills, Govt Job Bulletin Board, Quick Apply Modal aur Alert Subscription form shamil hai.",
                "<b>style.css:</b> Pure modern CSS use ki gayi. Plus Jakarta Sans font, smooth card hover transitions, responsive flex/grid layouts jo mobile aur desktop dono par pixel-perfect dikhti hain.",
                "<b>Component UI:</b> Har job card par Verified Tick, Remote Badge, Expected Salary, aur Urgent Hiring alert styling provide ki."
            ]
        ),
        (
            "Step 2: Interactive Real-Time Logic (JavaScript)",
            "Website me dynamic interactive user experience dene ke liye client-side JavaScript likhi gayi.",
            [
                "<b>Multi-filter System:</b> Search input, location filter aur category dropdown ko sync kiya gaya.",
                "<b>Dynamic Modal Form:</b> 'Apply Now' click karne par pop-up open hota hai jisme candidate resume attach karke submit kar sakta hai.",
                "<b>Real-time DOM Rendering:</b> Static HTML par depend rehne ke bajaye data/jobs.json se live jobs render karne ka async logic add kiya gaya."
            ]
        ),
        (
            "Step 3: Git Version Control Setup & Remote Push",
            "Code ko cloud par store karne aur CI/CD ke liye GitHub repository se connect kiya gaya.",
            [
                "<b>Git Init & Branch:</b> Local folder me git repository initialize karke main branch configure ki gayi.",
                "<b>Remote URL Linked:</b> <code>https://github.com/meer04379/daily_job.git</code> remote add kiya gaya.",
                "<b>Commit & Push:</b> Initial files ko commit karke GitHub cloud repo par push kar diya gaya."
            ]
        ),
        (
            "Step 4: Automated Job Scraper Engine (Node.js)",
            "Manual jobs add karne ki zaroorat khatam karne ke liye ek smart aggregator script banayi gayi.",
            [
                "<b>Script: scripts/fetch-jobs.js:</b> Real-time public verified job feeds (Remotive, Arbeitnow APIs) ko fetch karta hai.",
                "<b>Government / Sarkari Feed:</b> Official SSC, SBI PO aur Railway Recruitment boards ke daily notifications integrate kiye.",
                "<b>Data Pipeline Output:</b> Filtered aur verified jobs ko clean JSON format me <code>data/jobs.json</code> me export karta hai."
            ]
        ),
        (
            "Step 5: Cloud Automation Pipeline (GitHub Actions CI/CD)",
            "Bina kisi paid server ke pura automation configure kiya gaya.",
            [
                "<b>Workflow File: .github/workflows/daily-update.yml:</b>",
                "<b>Cron Scheduler:</b> <code>cron: '0 0 * * *'</code> setting se rozana subah ye pipeline automatically trigger hoti hai.",
                "<b>Auto-Commit Bot:</b> GitHub Action bot automatically naye jobs fetch karke repository me commit & push kar deta hai.",
                "<b>GitHub Pages Auto Deploy:</b> Naya data aate hi live website automatically redeploy ho jati hai."
            ]
        ),
        (
            "Step 6: Secure Credentials & GitHub Pages Hosting",
            "Production security aur website ko public live URL dene ke steps:",
            [
                "<b>API Key Security:</b> Sensitive API keys ko seedha code me commit karne ke bajaye GitHub Repo ke <i>Settings -> Secrets and variables -> Actions</i> me <code>JOB_API_KEY</code> ke tor par mehfooz kiya gaya.",
                "<b>Live Hosting:</b> Repo ke <i>Settings -> Pages</i> me Source ko 'GitHub Actions' select kiya gaya.",
                "<b>Live Portal URL:</b> Website <code>https://meer04379.github.io/daily_job/</code> par freely accessible ho gayi."
            ]
        )
    ]

    for title, desc, points in steps:
        step_elements = []
        step_elements.append(Paragraph(title, h1_style))
        step_elements.append(Paragraph(desc, body_style))
        for pt in points:
            bullet_text = f"• {pt}"
            step_elements.append(Paragraph(bullet_text, body_style))
        step_elements.append(Spacer(1, 8))
        story.append(KeepTogether(step_elements))

    # Architecture Diagram / Table for Students
    story.append(Spacer(1, 6))
    story.append(Paragraph("System Architecture Flow (Students Explanation)", h1_style))
    arch_data = [
        [Paragraph("<b>Stage</b>", body_style), Paragraph("<b>Tool / Technology</b>", body_style), Paragraph("<b>Function / Role</b>", body_style)],
        [Paragraph("1. User Interface", body_style), Paragraph("HTML5, CSS3, JS", body_style), Paragraph("Visitors search & apply for daily jobs", body_style)],
        [Paragraph("2. Scraper Engine", body_style), Paragraph("Node.js (scripts/fetch-jobs.js)", body_style), Paragraph("Aggregates verified jobs from Web APIs", body_style)],
        [Paragraph("3. Data Store", body_style), Paragraph("data/jobs.json", body_style), Paragraph("Lightweight zero-cost database in Git repo", body_style)],
        [Paragraph("4. Automation Bot", body_style), Paragraph("GitHub Actions Workflow", body_style), Paragraph("Daily Cron Scheduler (00:00 UTC)", body_style)],
        [Paragraph("5. Deployment", body_style), Paragraph("GitHub Pages", body_style), Paragraph("Free global CDN web hosting", body_style)],
    ]
    arch_table = Table(arch_data, colWidths=[110, 150, 244])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f172a")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
    ]))
    story.append(arch_table)
    story.append(Spacer(1, 14))

    # Student Exercise / Assignment Box
    assignment_text = (
        "<b>Student Assignment / Practice Tasks:</b><br/>"
        "1. Apne GitHub account par repo ko fork karein.<br/>"
        "2. <code>scripts/fetch-jobs.js</code> me ek nayi field (e.g. Internships) add karein.<br/>"
        "3. Actions tab me jakar manual 'Run workflow' click karke live deployment test karein.<br/>"
        "4. Secret key add karke custom notification webhook (e.g. Telegram / Discord bot) attach karein."
    )
    assign_table = Table([[Paragraph(assignment_text, body_style)]], colWidths=[504])
    assign_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#fef3c7")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#fde68a")),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(assign_table)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF generated successfully: {pdf_filename}")

if __name__ == "__main__":
    build_pdf()
