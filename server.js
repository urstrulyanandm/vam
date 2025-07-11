import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = process.env.PORT || 3000;

// static files
app.use(express.static("public"));

// in‑memory pads
const pads = new Map();

io.on("connection", socket => {
  let room = "/";
  socket.on("join", path => {
    room = path || "/";
    socket.join(room);
    socket.emit("init", pads.get(room) || "");
  });
  socket.on("update", text => {
    pads.set(room, text);
    socket.to(room).emit("update", text);
  });
});

// ➊ catch‑all route
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

httpServer.listen(PORT, () =>
  console.log(`✏️  Dontpad clone running on http://localhost:${PORT}`)
);
