"use client";

interface Participant {
  socketId: string;
  username: string;
  role: string;
}

interface Props {
  participants: Participant[];
}

export default function ParticipantList({
  participants,
}: Props) {
  return (
    <div className="border p-4">
      <h2 className="font-bold mb-2">
        Participants
      </h2>

      {participants.map((p) => (
        <div
          key={`${p.socketId}-${p.username}`}
          className="py-1"
        >
          {p.username} ({p.role})
        </div>
      ))}
    </div>
  );
}