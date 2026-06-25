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

A simple real-time watch party application that lets multiple users watch YouTube videos together in a shared room. Video playback stays synchronized for everyone in the room, so when the host or moderator plays, pauses, seeks, or changes a video, all participants see the same thing at the same time.

## What It Does

The application allows users to create a room, invite others using a room code, and watch YouTube videos together without manually syncing playback.

### Main Features

* Create and join watch party rooms
* Watch YouTube videos in sync with other participants
* Real-time play, pause, and seek synchronization
* Change videos for everyone in the room instantly
* Live participant list with role indicators
* Host and Moderator roles with different permissions
* Server-side permission checks for secure event handling

## User Roles

### Host

The room creator has full control over the session.

Host permissions:

* Play and pause videos
* Seek to any timestamp
* Change the current video
* Promote or demote participants
* Remove users from the room

### Moderator

Moderators help manage playback.

Moderator permissions:

* Play and pause videos
* Seek through videos
* Change videos

### Participant

Participants can watch the session but cannot control playback.

## Technology Used

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Socket.IO Client
* YouTube IFrame API

### Backend

* Node.js
* Express.js
* Socket.IO
* CORS
* dotenv

## Project Structure

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

## Environment Variables

### Frontend

Create a `.env.local` file inside the frontend directory.

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### Backend

Create a `.env` file inside the backend directory.

```env
PORT=5000
CLIENT_URL=http://localhost:3000
```

## Running Locally

### Clone the Repository

```bash
git clone <repository-url>
cd watch-party
```

### Start the Backend

```bash
cd backend
npm install
npm run dev
```

Server runs on:

```text
http://localhost:5000
```

### Start the Frontend

Open a new terminal and run:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

## How It Works

1. A user creates a room.
2. Other users join using the room code.
3. The host selects a YouTube video.
4. Playback actions are sent through Socket.IO.
5. Connected clients receive updates instantly and stay synchronized.

## Socket Events

### Client → Server

* join_room
* play
* pause
* seek
* change_video
* assign_role
* remove_participant

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

## Deployment

### Frontend (Vercel)

```env
NEXT_PUBLIC_SOCKET_URL=https://your-backend.onrender.com
```

### Backend (Render)

```env
CLIENT_URL=https://your-frontend.vercel.app
```

## Future Plans

Some improvements that could be added later:

* Group chat
* Room passwords
* Authentication system
* Playlist support
* Persistent room storage
* Automatic host transfer
* Watch history

## Author

Shivam Kumar Mishra

This project was built to learn and practice real-time application development using Socket.IO, Next.js, and TypeScript.

