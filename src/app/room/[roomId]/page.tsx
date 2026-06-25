"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { YouTubePlayer } from "react-youtube";

// import VideoPlayer from "@/components/VideoPlayer";
import VideoPlayer from '@/components/VideoPlayer'
import ParticipantList from "@/components/ParticipantList";
import VideoUrlInput from "@/components/VideoUrlInput";

import { socket } from "@/lib/socket";

interface Participant {
  socketId: string;
  username: string;
  role: string;
}

export default function RoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const roomId = params.roomId as string;
  const username =
    searchParams.get("username") || "Guest";

  const [videoId, setVideoId] =
    useState("VPz9NGNmUcw");

  const [participants, setParticipants] =
    useState<Participant[]>([]);

  const [role, setRole] =
    useState<string>("participant");

  const [seekTime, setSeekTime] =
    useState<number>();

  const playerRef =
    useRef<YouTubePlayer | null>(null);

    const canControl =
  role === "host" ||
  role === "moderator";

    useEffect(() => {
  if (!canControl) return;

  const interval = setInterval(() => {
    if (!playerRef.current) return;

    socket.emit("sync_state_update", {
      roomId,
      currentTime:
        playerRef.current.getCurrentTime(),
      isPlaying:
        playerRef.current.getPlayerState() === 1,
    });
  }, 1000);

  return () => clearInterval(interval);
}, [canControl, roomId]);

  useEffect(() => {
    socket.emit("join_room", {
      roomId,
      username,
    });

    socket.on("sync_state", (data: any) => {
      setVideoId(data.videoId);

      if (
        data.currentTime &&
        playerRef.current
      ) {
        playerRef.current.seekTo(
          data.currentTime,
          true
        );
      }
    });

    socket.on("user_joined", (data: any) => {
      setParticipants(data.participants);

      const me =
        data.participants.find(
          (p: Participant) =>
            p.socketId === socket.id
        );

      if (me) {
        setRole(me.role);
      }
    });

    socket.on("user_left", (data: any) => {
      setParticipants(data.participants);
    });

    socket.on("role_assigned", (data: any) => {
      setParticipants(data.participants);

      const me =
        data.participants.find(
          (p: Participant) =>
            p.socketId === socket.id
        );

      if (me) {
        setRole(me.role);
      }
    });

    socket.on(
      "participant_removed",
      (data: any) => {
        setParticipants(data.participants);
      }
    );

    socket.on("change_video", (data: any) => {
      setVideoId(data.videoId);
    });

    socket.on("play", () => {
      playerRef.current?.playVideo();
    });

    socket.on("pause", () => {
      playerRef.current?.pauseVideo();
    });

    socket.on("seek", ({ time }: any) => {
      setSeekTime(time);
    });

    socket.on(
  "sync_state_update",
  ({ currentTime, isPlaying }: any) => {
    if (!playerRef.current) return;

    const localTime =
      playerRef.current.getCurrentTime();

    if (
      Math.abs(localTime - currentTime) > 2
    ) {
      playerRef.current.seekTo(
        currentTime,
        true
      );
    }

    if (isPlaying) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }
);

    socket.on("kicked", () => {
      alert("Removed by Host");
      window.location.href = "/";
    });

    return () => {
      socket.off("sync_state");
      socket.off("user_joined");
      socket.off("user_left");
      socket.off("role_assigned");
      socket.off("participant_removed");
      socket.off("change_video");
     socket.off("play");
     socket.off("pause");
     socket.off("seek");
     socket.off("sync_state_update");
     socket.off("kicked");
    };
  }, [roomId, username]);

  const handlePlay = () => {
    socket.emit("play", { roomId });
  };

  const handlePause = () => {
    socket.emit("pause", { roomId });
  };

  const handleSeek = (time: number) => {
    socket.emit("seek", {
      roomId,
      time,
    });
  };

  const handleVideoChange = (
    newVideoId: string
  ) => {
    console.log("Changing Video:", newVideoId);
    socket.emit("change_video", {
      roomId,
      videoId: newVideoId,
    });
  };

  const assignModerator = (
    targetSocketId: string
  ) => {
    socket.emit("assign_role", {
      roomId,
      targetSocketId,
      role: "moderator",
    });
  };

  const assignParticipant = (
    targetSocketId: string
  ) => {
    socket.emit("assign_role", {
      roomId,
      targetSocketId,
      role: "participant",
    });
  };

  const removeUser = (
    targetSocketId: string
  ) => {
    socket.emit("remove_participant", {
      roomId,
      targetSocketId,
    });
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">
          Watch Party
        </h1>

        <p>
          Room ID:
          <span className="font-bold">
            {" "}
            {roomId}
          </span>
        </p>

        <p>
          Your Role:
          <span className="font-bold">
            {" "}
            {role}
          </span>
        </p>
      </div>

      <VideoUrlInput
        canControl={canControl}
        onChangeVideo={
          handleVideoChange
        }
      />

      <VideoPlayer
        videoId={videoId}
        canControl={canControl}
        onPlay={handlePlay}
        onPause={handlePause}
        onSeek={handleSeek}
        externalSeekTime={seekTime}
        onReady={(player) => {
          playerRef.current = player;
        }}
      />

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <ParticipantList
          participants={participants}
        />

        {role === "host" && (
          <div className="border p-4">
            <h2 className="font-bold mb-4">
              Host Controls
            </h2>

            {participants.map((user) => {
              if (
                user.socketId === socket.id
              )
                return null;

              return (
                <div
                  key={user.socketId}
                  className="flex gap-2 mb-2 items-center"
                >
                  <span>
                    {user.username} (
                    {user.role})
                  </span>

                  <button
                    onClick={() =>
                      assignModerator(
                        user.socketId
                      )
                    }
                    className="bg-green-500 text-white px-2 py-1"
                  >
                    Moderator
                  </button>

                  <button
                    onClick={() =>
                      assignParticipant(
                        user.socketId
                      )
                    }
                    className="bg-yellow-500 text-white px-2 py-1"
                  >
                    Participant
                  </button>

                  <button
                    onClick={() =>
                      removeUser(
                        user.socketId
                      )
                    }
                    className="bg-red-500 text-white px-2 py-1"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}