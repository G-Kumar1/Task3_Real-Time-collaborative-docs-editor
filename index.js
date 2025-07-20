const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socket = require("socket.io");
const dotenv = require("dotenv");
const Document = require("./models/Document");
const activeUsers = {};

dotenv.config();

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  },
});

const DEFAULT_VALUE = "";

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

io.on("connection", (socket) => {
  socket.on("get-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });
});

io.on("connection", (socket) => {
  socket.on("join-document", ({ documentId, userName }) => {
    socket.join(documentId);
    socket.documentId = documentId;
    socket.userName = userName;

    if (!activeUsers[documentId]) activeUsers[documentId] = new Set();
    activeUsers[documentId].add(userName);

    io.to(documentId).emit("active-users", Array.from(activeUsers[documentId]));
  });

  socket.on("disconnect", () => {
    const { documentId, userName } = socket;
    if (documentId && userName && activeUsers[documentId]) {
      activeUsers[documentId].delete(userName);
      io.to(documentId).emit("active-users", Array.from(activeUsers[documentId]));
    }
  });
});


async function findOrCreateDocument(id) {
  if (id == null) return;

  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({ _id: id, data: DEFAULT_VALUE });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
