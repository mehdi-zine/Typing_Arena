import io from "socket.io-client";

// Assuming your Next.js API is at the root of the project
const socket = io("/api/socket");

socket.on("connect", () => {
  console.log("Connected to Socket.IO server!");
});
