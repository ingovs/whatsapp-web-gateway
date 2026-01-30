# whatsapp-web-gateway
A Node.js REST API gateway built on top of whatsapp-web.js that transforms WhatsApp into a programmable service. This project provides a containerized environment to manage WhatsApp sessions, automate messaging, and handle media via simple HTTP requests. It features a built-in dashboard for real-time QR code and Pairing code authentication

🚀 Key Features
- RESTful API: Send text messages and media (images/PDFs) via standard POST requests.
- Session Management: Persistent login state using localized or cloud storage (Docker-ready).
- QR and Pairing Code Dashboard: A mini-frontend to visualize the authentication process and connection status.
- Automated Headless Browser: Powered by Puppeteer to handle the WhatsApp Web interface.

Cloud Ready: Optimized for AWS deployment with Docker and integrated CI/CD workflows.

🛠 Tech Stack
- Core: Node.js, whatsapp-web.js, Express
- Automation: Puppeteer (Headless Chromium)
- DevOps: Docker, GitHub Actions, AWS
- 
