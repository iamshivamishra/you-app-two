"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");

  const createRoom = () => {
    if (!username.trim()) {
      alert("Enter username");
      return;
    }

    const id = crypto.randomUUID();

    router.push(
      `/room/${id}?username=${encodeURIComponent(username)}`
    );
  };

  const joinRoom = () => {
    if (!username.trim()) {
      alert("Enter username");
      return;
    }

    if (!roomId.trim()) {
      alert("Enter Room ID");
      return;
    }

    router.push(
      `/room/${roomId}?username=${encodeURIComponent(username)}`
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-4 border p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-center">
          YouTube Watch Party
        </h1>

        <input
          className="w-full border p-2 rounded"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button
          onClick={createRoom}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Create Room
        </button>

        <hr />

        <input
          className="w-full border p-2 rounded"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />

        <button
          onClick={joinRoom}
          className="w-full bg-green-500 text-white p-2 rounded"
        >
          Join Room
        </button>
      </div>
    </div>
  );
}