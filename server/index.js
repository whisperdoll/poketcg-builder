// index.js
const { env } = require("process");
const WebSocket = require("ws");

const tryParseInt = (value, fallback) => {
  const parsed = parseInt(value);
  return isNaN(parsed) ? fallback : parsed;
};

const port = tryParseInt(env["port"], 8080);
const server = new WebSocket.Server({ port: port });

server.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("message", (message) => {
    console.log(`Received: ${message}`);
    socket.send(`Server received: ${message}`);
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log(`WebSocket server is running on ws://localhost:${port}`);
