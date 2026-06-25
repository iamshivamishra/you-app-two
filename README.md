This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



------------------------------------------------------------------------------------------------------------------------------------




# YouTube Watch Party

A real-time YouTube Watch Party application built with **Next.js, Express.js, Socket.IO, and TypeScript**. Users can create rooms, join with a room code, and watch YouTube videos together with synchronized playback.

---

##  Features

### Room Management

* Create a new watch party room
* Unique Room ID generation
* Join rooms using Room ID
* Real-time participant updates

### YouTube Integration

* YouTube IFrame Player API
* Change video using YouTube URL
* Shared video experience across all participants

### Real-Time Synchronization

* Play synchronization
* Pause synchronization
* Seek synchronization
* Video change synchronization
* New participants receive current room state

### Role-Based Access Control

#### Host

* Play / Pause video
* Seek video
* Change video
* Assign roles
* Remove participants

#### Moderator

* Play / Pause video
* Seek video
* Change video

#### Participant

* View-only access
* Controls disabled

### Participant Management

* Live participant list
* Real-time join/leave updates
* Role visibility
* Remove participants
* Promote/Demote users

### Backend Security

* Server-side permission validation
* Unauthorized socket events are rejected
* Frontend restrictions are backed by backend authorization

---

##  Tech Stack

### Frontend

* Next.js 15
* React
* TypeScript
* Tailwind CSS
* Socket.IO Client
* React YouTube

### Backend

* Node.js
* Express.js
* Socket.IO
* CORS
* dotenv

---

##  Project Structure

```text
watch-party/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── types/
│
├── backend/
│   ├── src/
│   │   └── server.js
│   └── .env
│
└── README.md
```

---

##  Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### Backend (.env)

```env
PORT=5000
CLIENT_URL=http://localhost:3000
```

---

##  Local Setup

### Clone Repository

```bash
git clone <your-repository-url>
cd watch-party
```

---

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

---

## 🎯 Usage

### Create Room

1. Enter your username
2. Click "Create Room"
3. Share the Room ID with others

### Join Room

1. Enter username
2. Enter Room ID
3. Click "Join Room"

### Change Video

1. Paste a YouTube URL
2. Click "Change Video"
3. All participants receive the new video instantly

---

## 🔒 Permission Matrix

| Action       | Host | Moderator | Participant |
| ------------ | ---- | --------- | ----------- |
| Play         | ✅    | ✅         | ❌           |
| Pause        | ✅    | ✅         | ❌           |
| Seek         | ✅    | ✅         | ❌           |
| Change Video | ✅    | ✅         | ❌           |
| Assign Roles | ✅    | ❌         | ❌           |
| Remove User  | ✅    | ❌         | ❌           |

---

## 🔄 Real-Time Events

### Client → Server

* join_room
* play
* pause
* seek
* change_video
* assign_role
* remove_participant
* sync_state_update

### Server → Client

* sync_state
* user_joined
* user_left
* play
* pause
* seek
* change_video
* role_assigned
* participant_removed
* kicked

---

## 🌐 Deployment

### Frontend

Deploy on Vercel

```bash
NEXT_PUBLIC_SOCKET_URL=https://your-backend.onrender.com
```

### Backend

Deploy on Render

```bash
CLIENT_URL=https://your-frontend.vercel.app
```

---

## 🏗️ Architecture

```text
Frontend (Next.js)
        │
        ▼
 Socket.IO Client
        │
        ▼
 Express + Socket.IO Server
        │
        ▼
   Room State Store
        │
        ▼
 Connected Participants
```

---

##  Future Improvements

* Chat system
* Room password protection
* Persistent room storage
* Host transfer on disconnect
* Video queue / playlist
* Authentication
* Room history

---

##  Live Demo

Frontend:
https://your-frontend.vercel.app

Backend:
https://your-backend.onrender.com

---

## 👨‍💻 Author

Shivam Kumar Mishra

Built as a Full Stack Real-Time Watch Party Application using Next.js and Socket.IO.
