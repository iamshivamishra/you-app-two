const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
      methods: ["GET", "POST"],
    },
  }); 

  const rooms = {};

  function getParticipant(socketId, roomId) {
    const room = rooms[roomId];
    if (!room) return null;
    return room.participants.find((p) => p.socketId === socketId);
  }

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // JOIN ROOM
    socket.on("join_room", ({ roomId, username }) => {
      socket.join(roomId);

      if (!rooms[roomId]) {
        rooms[roomId] = {
          videoId: "",
          currentTime: 0,
          isPlaying: false,
          participants: [],
        };
      }

      const room = rooms[roomId];
      const existingUser = room.participants.find((p) => p.socketId === socket.id);

      if (!existingUser) {
        const role = room.participants.length === 0 ? "host" : "participant";
        room.participants.push({ socketId: socket.id, username, role });
      }

      socket.emit("sync_state", {
        videoId: room.videoId,
        currentTime: room.currentTime,
        isPlaying: room.isPlaying,
      });

      io.to(roomId).emit("user_joined", { participants: room.participants });
    });

    // PLAY
    socket.on("play", ({ roomId }) => {
      const user = getParticipant(socket.id, roomId);
      if (!user || !["host", "moderator"].includes(user.role)) return;
      rooms[roomId].isPlaying = true;
      socket.to(roomId).emit("play");
    });

    // PAUSE
    socket.on("pause", ({ roomId }) => {
      const user = getParticipant(socket.id, roomId);
      if (!user || !["host", "moderator"].includes(user.role)) return;
      rooms[roomId].isPlaying = false;
      socket.to(roomId).emit("pause");
    });

    // SEEK
    socket.on("seek", ({ roomId, time }) => {
      const user = getParticipant(socket.id, roomId);
      if (!user || !["host", "moderator"].includes(user.role)) return;
      rooms[roomId].currentTime = time;
      socket.to(roomId).emit("seek", { time });
    });

    // CHANGE VIDEO
    socket.on("change_video", ({ roomId, videoId }) => {
      console.log("CHANGE VIDEO:", videoId);
      const user = getParticipant(socket.id, roomId);
      if (!user || !["host", "moderator"].includes(user.role)) {
        console.log("Rejected: no permission");
        return;
      }
      rooms[roomId].videoId = videoId;
      rooms[roomId].currentTime = 0;
      io.to(roomId).emit("change_video", { videoId });
    });

    // CONTINUOUS SYNC
    socket.on("sync_state_update", ({ roomId, currentTime, isPlaying }) => {
      const user = getParticipant(socket.id, roomId);
      if (!user || !["host", "moderator"].includes(user.role)) return;
      rooms[roomId].currentTime = currentTime;
      rooms[roomId].isPlaying = isPlaying;
      socket.to(roomId).emit("sync_state_update", { currentTime, isPlaying });
    });

    // ASSIGN ROLE
    socket.on("assign_role", ({ roomId, targetSocketId, role }) => {
      const user = getParticipant(socket.id, roomId);
      if (!user || user.role !== "host") return;
      const room = rooms[roomId];
      const target = room.participants.find((p) => p.socketId === targetSocketId);
      if (!target) return;
      target.role = role;
      io.to(roomId).emit("role_assigned", { participants: room.participants });
    });

    // REMOVE USER
    socket.on("remove_participant", ({ roomId, targetSocketId }) => {
      const user = getParticipant(socket.id, roomId);
      if (!user || user.role !== "host") return;
      const room = rooms[roomId];
      room.participants = room.participants.filter((p) => p.socketId !== targetSocketId);
      io.to(roomId).emit("participant_removed", { participants: room.participants });
      io.to(targetSocketId).emit("kicked");
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      Object.keys(rooms).forEach((roomId) => {
        const room = rooms[roomId];
        room.participants = room.participants.filter((p) => p.socketId !== socket.id);
        io.to(roomId).emit("user_left", { participants: room.participants });
        if (room.participants.length === 0) {
          delete rooms[roomId];
        }
      });
      console.log("Disconnected:", socket.id);
    });
  });

  server.listen(PORT, () => {
    console.log(`> Ready on port ${PORT}`);
  });
});
