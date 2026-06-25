"use client";

import { useEffect, useRef } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";

interface Props {
  videoId: string;
  canControl: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onReady?: (player: YouTubePlayer) => void;
  externalSeekTime?: number;
}

export default function VideoPlayer({
  videoId,
  canControl,
  onPlay,
  onPause,
  onSeek,
  onReady,
  externalSeekTime,
}: Props) {
  const playerRef =
    useRef<YouTubePlayer | null>(null);

  const lastTimeRef =
    useRef<number>(0);

  useEffect(() => {
    if (
      playerRef.current &&
      externalSeekTime !== undefined
    ) {
      playerRef.current.seekTo(
        externalSeekTime,
        true
      );
    }
  }, [externalSeekTime]);

  useEffect(() => {
    if (!canControl) return;

    const interval = setInterval(() => {
      if (!playerRef.current) return;

      const currentTime =
        playerRef.current.getCurrentTime();

      if (
        Math.abs(
          currentTime -
            lastTimeRef.current
        ) > 2
      ) {
        onSeek(currentTime);
      }

      lastTimeRef.current =
        currentTime;
    }, 1000);

    return () =>
      clearInterval(interval);
  }, [canControl, onSeek]);

  return (
    <YouTube
       key={videoId}
  videoId={videoId}
      opts={{
        width: "100%",
        height: "500",
        playerVars: {
          controls: canControl ? 1 : 0,
          disablekb: canControl ? 0 : 1,
          rel: 0,
          hd: 1,
        },
      }}
      onReady={(e) => {
        playerRef.current = e.target;

        if (onReady) {
          onReady(e.target);
        }
      }}
      onPlay={() => {
        if (canControl) {
          onPlay();
        }
      }}
      onPause={() => {
        if (canControl) {
          onPause();
        }
      }}
    />
  );
}