const { createServer } = require("http");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");
const jwt = require("jsonwebtoken");

// Spin up dedicated HTTP server for WebSockets on port 3001
const httpServer = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("CreatorOS WebSockets Server Active\n");
});

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Configure JWT authorization handshake
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error("Authentication error: Missing token"));
  }

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "fallback-secret");
    socket.data.userId = decoded.sub || decoded.id;
    socket.data.role = decoded.role;
    next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid signature"));
  }
});

// Setup Redis adapter for clustering/scaling if Redis URL is present
const redisUrl = process.env.REDIS_URL;
if (redisUrl) {
  const pubClient = createClient({ url: redisUrl });
  const subClient = pubClient.duplicate();

  Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    io.adapter(createAdapter(pubClient, subClient));
    console.log("WebSockets: Clustered Redis adapter connected successfully.");
  }).catch((err) => {
    console.error("WebSockets: Failed to initialize Redis Adapter", err);
  });
} else {
  console.log("WebSockets: Running in standalone mode (no REDIS_URL provided).");
}

// Handle socket connections
io.on("connection", (socket) => {
  console.log(`WebSockets: User ${socket.data.userId} connected (socket: ${socket.id})`);

  // Join deal room
  socket.on("join_deal_room", (data) => {
    const { dealId } = data;
    if (dealId) {
      socket.join(`deal_${dealId}`);
      console.log(`WebSockets: Socket ${socket.id} joined room deal_${dealId}`);
    }
  });

  // Handle messages in deal room
  socket.on("send_deal_message", async (data) => {
    const { dealId, text } = data;
    if (dealId && text) {
      const messagePayload = {
        id: `msg_${Date.now()}`,
        senderId: socket.data.userId,
        text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      // Broadcast to other members in the deal room
      socket.to(`deal_${dealId}`).emit("receive_deal_message", messagePayload);

      // In production, we push the write to a background queue (e.g. BullMQ) 
      // to batch save to Neon, avoiding pool exhaustion.
      console.log(`WebSockets: Broadcast message in deal_${dealId} from ${socket.data.userId}`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`WebSockets: User ${socket.data.userId} disconnected`);
  });
});

const PORT = process.env.WS_PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`WebSockets dedicated server listening on port ${PORT}`);
});
