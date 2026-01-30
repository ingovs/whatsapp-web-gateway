# WhatsApp Web Gateway

A Dockerized wrapper around `whatsapp-web.js` with a management dashboard.

## Features
- **API**: Send text and media messages via REST API.
- **Dashboard**: Real-time QR Code scanning and status monitoring.
- **Dockerized**: specific `Dockerfile` configs for running Puppeteer (Chrome) in containers.
- **Monorepo**: Managed with NPM Workspaces.

## Architecture
- **Backend**: Node.js, Express, `whatsapp-web.js`, Socket.io.
- **Frontend**: React, Vite.
- **Infrastructure**: Docker, Docker Compose.

## Quick Start
1. `docker-compose up --build`
2. Open `http://localhost:8080`
3. Scan QR Code or use pairing code to authenticate.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.
