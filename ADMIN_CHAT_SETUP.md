# Admin Chat System - Setup Guide

## Overview

This admin chat system allows you to:
1. View all incoming chat messages from visitors
2. Respond directly to users (messages marked from "Emman")
3. Manage multiple conversations in real-time

## Setup Steps

### 1. Environment Variables (DO THIS FIRST!)

Add to your `.env.local`:

```env
# Already existing
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# New - required for admin operations (IMPORTANT!)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
APIKEY=your_groq_api_key
```

**How to get `SUPABASE_SERVICE_ROLE_KEY`:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **Settings** (gear icon, bottom of left sidebar)
4. Click **API**
5. Under "Project API keys", copy the **"service_role"** key (NOT the "anon" key)
6. Paste it in `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **IMPORTANT:** Keep this key secret! Never commit it to git or expose it publicly.

### 2. Database Setup (Supabase)

Now create the database tables in Supabase:

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **"New query"**
4. Copy and paste the contents of [`lib/supabase.sql`](../lib/supabase.sql)
5. Click **Run** to execute

This creates:
- `chat_sessions` - Stores chat conversation sessions
- `chat_messages` - Stores individual messages
- `admin_users` - Stores admin credentials

### 3. Restart Development Server

After adding `.env.local`, restart your dev server:
```bash
# Stop the dev server (Ctrl+C)
# Then restart it
npm run dev
```

### 4. Create Admin Account

1. Open http://localhost:3000/admin/setup (or your deployed URL)
2. Enter your email and password
3. Your admin account is created and stored in the database

### 5. Access Admin Dashboard

1. Go to http://localhost:3000/admin/login
2. Enter your credentials
3. You'll be taken to the admin dashboard

## How It Works

### User Flow

```
Visitor Opens Chat
    ↓
Chat Session Created (stored in DB)
    ↓
Visitor sends message
    ↓
Message saved to DB + AI responds + AI response saved
    ↓
Admin can see conversation and respond
    ↓
Admin response appears in visitor's chat with "from Emman" label
    ↓
Visitor can reply to admin message
    ↓
Conversation continues...
```

### Admin Dashboard Features

**Left Sidebar - Chat List**
- Shows all active conversations
- Red badge shows unread message count
- Click to select conversation

**Center - Message View**
- All messages in conversation
- Different colors for: Visitor (blue), AI (gray), Admin (green)
- Real-time updates every 3 seconds

**Bottom - Response Input**
- Type your response
- Click "Send" to send directly to visitor
- Messages show as from "Emman"

## API Endpoints

### Public (Visitor)

- `POST /api/chat` - Send message (saves to DB, calls Groq AI)
  ```json
  {
    "message": "user message",
    "sessionId": "uuid",
    "visitorId": "unique-visitor-id"
  }
  ```

### Admin (Protected)

All admin endpoints require `Authorization: Bearer {token}` header

- `GET /api/admin/chat/sessions` - Get all sessions
- `GET /api/admin/chat/:sessionId` - Get specific chat history
- `POST /api/admin/respond` - Send response to user
  ```json
  {
    "sessionId": "uuid",
    "message": "response text"
  }
  ```

## Security Notes

1. **Admin tokens** are JWT-like tokens that expire after 7 days
2. **Passwords** are hashed with SHA-256 (use bcrypt in production)
3. **RLS policies** are set up to prevent unauthorized access
4. **Server-side verification** checks all admin requests
5. **Middleware** protects `/admin` routes

## Real-time Updates

Currently, the admin dashboard fetches updates every:
- **Sessions list**: Every 5 seconds
- **Chat messages**: Every 3 seconds

Optional: Upgrade to WebSockets for instant updates

## Database Schema

```
chat_sessions
├── id (UUID) - Primary key
├── visitor_id (string) - Unique visitor identifier
├── visitor_name (string) - Optional visitor name
├── visitor_email (string) - Optional visitor email
├── created_at (timestamp)
├── last_message_time (timestamp)
├── status (active/closed)
├── admin_responded (boolean)
└── created_by_ip (inet)

chat_messages
├── id (UUID) - Primary key
├── session_id (UUID FK) - References chat_sessions
├── sender (user/bot/admin)
├── content (text) - Message text
├── created_at (timestamp)
├── is_read (boolean)
└── processed_by_ai (boolean)

admin_users
├── id (UUID) - Primary key
├── email (string) - Unique
├── password_hash (string) - SHA-256 hash
├── created_at (timestamp)
└── last_login (timestamp)
```

## Troubleshooting

### "Unauthorized" when accessing admin dashboard
- Check if token cookie is set
- Try logging in again at `/admin/login`
- Clear browser cookies and try again

### Messages not appearing in real-time
- Check if Supabase connection is working
- Check browser console for errors
- Ensure `NEXT_PUBLIC_SUPABASE_URL` and keys are correct

### Admin response not showing in visitor chat
- Check if visitor's chat page is subscribed to updates
- Look at browser console for WebSocket errors
- Admin message sender should be "admin", not "bot"

## Future Enhancements

- [ ] WebSocket for instant real-time updates
- [ ] Message search and filtering
- [ ] Chat history export
- [ ] Typing indicators
- [ ] File attachments
- [ ] Auto-response templates
- [ ] Multiple admin support
- [ ] Chat statistics and analytics
- [ ] Better password hashing (bcrypt)
- [ ] 2FA for admin accounts
