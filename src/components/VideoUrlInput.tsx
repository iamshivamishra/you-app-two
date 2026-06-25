"use client";

import { useState } from "react";

interface Props {
  canControl: boolean;
  onChangeVideo: (videoId: string) => void;
}

export default function VideoUrlInput({
  canControl,
  onChangeVideo,
}: Props) {
  const [url, setUrl] = useState("");

  const extractVideoId = (
    youtubeUrl: string
  ) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;

    const match =
      youtubeUrl.match(regExp);

    return match &&
      match[2].length === 11
      ? match[2]
      : null;
  };

  const handleSubmit = () => {
    const videoId =
      extractVideoId(url);

      console.log("URL:", url);
  console.log("Video ID:", videoId);

    if (!videoId) {
      alert("Invalid URL");
      return;
    }

    onChangeVideo(videoId);
  };

  return (
    <div className="flex gap-2 mb-4">
      <input
        className="border p-2 flex-1"
        placeholder="YouTube URL"
        value={url}
        disabled={!canControl}
        onChange={(e) =>
          setUrl(e.target.value)
        }
      />

      <button
        disabled={!canControl}
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4"
      >
        Change Video
      </button>
    </div>
  );
}