# SchemaSahayak - AI-Powered Voice Assistant for Indian Government Schemes

SchemaSahayak is a multilingual, voice-first platform designed to help Indian citizens explore government schemes seamlessly.

## Quick Start (Single Command, Any Laptop)

The easiest and most reliable way to run the full stack (PostgreSQL + backend + frontend) on **any laptop** is via Docker.

1. **Prerequisite**: Install Docker / Docker Desktop.
2. **From the `schemasahayak` folder, run**:

   ```bash
   docker compose up --build
   ```

   This will:
   - Start Postgres with the bundled `database_schema.sql`
   - Build and run the Node.js backend on port `5000`
   - Run the React frontend on port `3000`

3. Open the app in your browser:

   - `http://localhost:3000`

> If you prefer running without Docker, you can still start backend and frontend manually as before.

### Manual Dev Setup (Optional)

1. **Prerequisites**: Node.js, PostgreSQL.
2. **Backend**:

   ```bash
   cd backend
   npm install
   node server.js
   ```

3. **Frontend**:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Key Features
- **Voice Recognition**: Tap the mic and talk in Hindi, Tamil, or English.
- **AI Chatbot**: Naturally extracts your profile (age, income, job) as you chat.
- **Smart Eligibility**: Color-coded badges (✅ Eligible, ⚠️ Docs Needed) for 10+ major schemes.
- **Indian Theme**: Saffron-White-Green palette with Government of India branding.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express.
- **AI**: Claude API compatible (mocked for demo).
- **Design**: Glassmorphism, WhatsApp-style chat, and Tri-color theme.
