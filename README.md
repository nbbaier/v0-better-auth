# Better Auth Implementation

This is a real Better Auth implementation using email OTP and magic link authentication with SQLite database.

## Features

-  ✅ Email OTP Authentication
-  ✅ Magic Link Authentication
-  ✅ SQLite Database
-  ✅ Console-based email logging (for development)
-  ✅ Hono API server
-  ✅ React + Vite frontend

## Getting Started

### Prerequisites

-  Node.js 18+
-  npm or pnpm

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

Copy `.env.example` to `.env` and update the values:

```bash
BETTER_AUTH_SECRET=your-secret-key-here-change-this-in-production
BETTER_AUTH_URL=http://localhost:5173
DATABASE_URL=sqlite.db
```

⚠️ **Important**: Change the `BETTER_AUTH_SECRET` to a secure random string in production.

### Running the Application

You need to run **both** the backend server and the frontend:

#### Terminal 1 - Backend Server (Port 3000)

```bash
npm run dev:server
```

#### Terminal 2 - Frontend (Port 5173)

```bash
npm run dev
```

Then open your browser to `http://localhost:5173`

## How It Works

### Authentication Flow

**Email OTP:**

1. User enters their email and name
2. Backend generates a 6-digit OTP code
3. OTP is logged to the **server console** (terminal running `dev:server`)
4. User enters the OTP to complete sign-in

**Magic Link:**

1. User enters their email and name
2. Backend generates a magic link
3. Link is logged to the **server console** (terminal running `dev:server`)
4. User clicks the link to complete sign-in

### Architecture

```
Frontend (React + Vite)
    ↓ API calls via proxy
Backend (Hono Server on :3000)
    ↓ /api/auth/*
Better Auth
    ↓
SQLite Database (sqlite.db)
```

## File Structure

```
/server
  ├── auth.ts         # Better Auth configuration
  └── index.ts        # Hono API server

/src
  ├── components/
  │   ├── login-form.tsx       # OTP and Magic Link forms
  │   └── user-dashboard.tsx   # User dashboard after login
  ├── lib/
  │   └── auth-client.ts       # Better Auth React client
  └── App.tsx                  # Main app component

.env                  # Environment variables
sqlite.db            # SQLite database (auto-created)
```

## Development Notes

-  **Email Sending**: In development, OTPs and magic links are logged to the server console instead of being sent via email
-  **Database**: SQLite database is automatically created on first run
-  **Sessions**: Better Auth handles session cookies automatically
-  **Hot Reload**: Both frontend and backend support hot reload during development

## Production Deployment

For production:

1. **Generate a secure secret**:

```bash
openssl rand -base64 32
```

Update `BETTER_AUTH_SECRET` in your production environment.

2. **Configure real email sending**:
   Update `server/auth.ts` to use a real email provider (Resend, SendGrid, etc.) instead of console logging.

3. **Update `BETTER_AUTH_URL`**:
   Set this to your production domain.

4. **Use a production database**:
   Consider PostgreSQL or MySQL for production instead of SQLite.

## Troubleshooting

**"Cannot connect to server"**

-  Make sure the backend server is running on port 3000 (`npm run dev:server`)
-  Check that the Vite proxy is configured correctly in `vite.config.ts`

**"OTP not working"**

-  Check the **server console** (terminal running `dev:server`) for the OTP code
-  OTP codes expire after 5 minutes

**"Magic link not working"**

-  Check the **server console** for the magic link URL
-  Copy and paste the entire URL into your browser
-  Magic links expire after 5 minutes

## Built With

-  [Better Auth](https://better-auth.com) - Authentication framework
-  [Hono](https://hono.dev) - Web framework for the API server
-  [React](https://react.dev) - Frontend framework
-  [Vite](https://vitejs.dev) - Build tool
-  [SQLite](https://sqlite.org) - Database
-  [Tailwind CSS](https://tailwindcss.com) - Styling
