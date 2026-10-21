# Claude Prompt: Personal Portfolio Website for Jiya Baghel

Copy this prompt into Claude. For a full working website with backend features, use Claude Code or export the generated project to a hosting platform.

---

Act as a senior full-stack developer and UI/UX designer. Build a complete, modern, premium personal portfolio website for **Jiya Baghel**, a B.Tech Computer Science student specializing in Artificial Intelligence and Machine Learning at Symbiosis Institute of Technology, Nagpur, India.

The website must be visually impressive, responsive, interactive, professional, and suitable for internship applications. Build the actual working project, not just a design description.

## 1. Design

- Dark futuristic theme with black/navy backgrounds and electric blue/violet accents.
- Modern typography, subtle gradients, glassmorphism, smooth scrolling, and tasteful animations.
- Animated hero section, interactive project cards, skill badges, hover effects, and a mobile-friendly navigation menu.
- Professional appearance without excessive animations or clutter.
- Make it fast, accessible, and responsive on phones, tablets, and desktops.

## 2. Hero section

**Name:** Jiya Baghel  
**Headline:** AI/ML Student | Python Developer | Aspiring Software Engineer

Include a short introduction about my interest in AI, machine learning, Python, and building practical software projects.

Add buttons for **View Projects**, **Download Resume**, and **Contact Me**.

- GitHub: https://github.com/Jiya2006
- LinkedIn: https://www.linkedin.com/in/jiya-baghel-3724a7241

Do not invent my email address, phone number, resume, or work experience. Use clearly labelled placeholders for missing details.

## 3. About me

I am a B.Tech Computer Science student specializing in Artificial Intelligence and Machine Learning at Symbiosis Institute of Technology, Nagpur. I am interested in machine learning, software development, and building practical projects.

My previously reported semester CGPA is 7.5. Include it only as a semester CGPA, not as an overall CGPA unless confirmed.

## 4. Skills

Display these in organized, attractive categories:

- **Programming:** Python, Java, C
- **Web development:** HTML, CSS
- **AI/ML:** Machine Learning, NumPy, pandas, Jupyter Notebook
- **Computer science:** Data Structures
- **Tools:** GitHub

Represent my skill level honestly. Do not add unconfirmed technologies or claim expertise without evidence.

## 5. Projects

Create individual project cards with a description, technology tags, and buttons for GitHub repository and live demo where available.

Include:

1. Diabetes Prediction Using Machine Learning
2. Credit Card Fraud Detection
3. Recommendation System
4. Spam SMS Detection
5. Customer Churn Prediction
6. TaskMaster – To-Do List App
7. Underwater Sensor Network Simulation — energy-efficient MAC protocols using ns-3/WSL
8. CA Workease — an ongoing project involving machine learning
9. Arduino Clap Sensor
10. HACK-O-WEEK

GitHub profile: https://github.com/Jiya2006

Use real repository links only after verifying them. If a repository or demo URL is unknown, use a clearly labelled placeholder. Never invent project results, model accuracy, downloads, or performance statistics. Mark ongoing projects as **In Progress**.

## 6. Leadership and achievements

Create a section featuring:

- Current Organising Secretary (Event Management) at college
- Previous Co-coordinator of the Competitive Club, involving technical and cultural activities
- National-level dancer
- Gold medal in dodgeball
- Participation in the Smart India Hackathon (SIH), with details left editable until confirmed

Highlight teamwork, leadership, event management, communication, and problem-solving.

## 7. Working contact form with email notifications

Create a real contact form with:

- Full name
- Email address
- Message
- Required consent checkbox explaining how submitted information will be used

When a visitor voluntarily submits the form, send an email notification to my configured email address containing the visitor's name, email, message, and submission timestamp.

Use a secure backend and a suitable email provider such as Supabase with Resend, or another reliable supported option. Include:

- Server-side validation
- Email format validation
- Spam protection and rate limiting
- Clear success and failure messages
- Secure environment-variable configuration
- Instructions for setting up the database and email provider

Never expose secret API keys in client-side code. Do not pretend email notifications work until credentials are configured and the flow is tested.

## 8. Visitor analytics and IP address requirement

I want to understand how many people visit my portfolio.

Implement privacy-conscious analytics that can show:

- Total visits and page views
- Visit timestamps
- Referrer information where available
- Aggregate browser/device statistics
- Available geographic analytics at an appropriate, non-identifying level

If IP address logging is genuinely required, disclose this clearly in the privacy notice, restrict access, protect stored data, and define a reasonable retention period. Do not use IP addresses to claim a visitor's identity.

**Important:** A normal website visit does not reveal a visitor's name or email address. Do not secretly collect these details. Collect a visitor's name and email only when they voluntarily submit the contact form.

Create a private analytics/admin dashboard, protected by authentication, where I can view analytics separately from contact form submissions. Never expose this dashboard or visitors' messages publicly.

## 9. Other sections

Include:

- Education
- Projects
- Skills
- Leadership and achievements
- Contact
- Footer with GitHub, LinkedIn, and a privacy notice

Add a resume download button that works once I upload my actual resume. Until then, show a clear placeholder rather than a fake download.

Include basic SEO metadata, a favicon, accessible contrast, loading states, and a professional 404 page.

## 10. Technical implementation

Build a maintainable, deployable application using React, TypeScript, and Tailwind CSS, with a secure backend such as Supabase where appropriate.

If using Claude Artifacts, explain any backend features that cannot run inside the Artifact and provide a full project structure or source files for deployment.

The website must actually run. Do not stop after generating a screenshot, static mockup, or code snippets.

Before finishing:

1. Run and fix build errors.
2. Test responsive layouts.
3. Verify navigation and project links.
4. Test contact-form validation.
5. Provide exact steps to configure email notifications and analytics.
6. Explain how to deploy the website using free-tier services where possible.
7. List any credentials or information I must provide myself.
8. Clearly identify any functionality that remains unconfigured.

Prioritize a polished design, working features, security, privacy, and low cost. Do not require paid services without explaining the alternatives and free-tier limitations.

Start by building the complete portfolio, then provide the project files and setup instructions.
