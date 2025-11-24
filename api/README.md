# NEXUS Grok/xAI Secure Proxy

This is a secure Node.js (Express) backend proxy for Grok/xAI chat completions.

## Features
- Accepts POST requests from your frontend (React, etc.)
- Forwards chat messages to the xAI API using a secret API key (never exposed to the client)
- Handles CORS for cross-origin requests
- Returns the Grok/xAI response to the frontend

## Usage

### 1. Install dependencies
```
npm install express cors node-fetch dotenv
```

### 2. Set your xAI API key
Edit `.env` and set:
```
XAI_API_KEY=your-xai-api-key-here
PORT=4321
```

### 3. Start the server
```
node api/index.js
```

### 4. Frontend Usage
Send a POST request to `/grok` with JSON:
```
{
  "messages": [
    { "role": "user", "content": "Who are you?" }
  ],
  "userFaction": "syndicate" // or "security"
}
```

The response will be:
```
{
  "content": "...NEXUS AI reply..."
}
```

## Deployment
- You can deploy this as a standalone Node.js server (e.g., on Render, Railway, DigitalOcean, etc.)
- Or adapt it for serverless (Netlify Functions, Vercel, etc.)

## Security
- **Never** expose your xAI API key to the frontend.
- This proxy ensures all secrets stay server-side.

---

*The war for the Core just got real.*
