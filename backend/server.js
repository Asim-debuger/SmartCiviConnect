const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const http = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const operationsRoutes = require("./routes/operationsRoutes");
const publicRoutes = require("./routes/publicRoutes");
const authRoutes = require("./routes/authRoutes");
const platformRoutes = require("./routes/platformRoutes");
const communityRoutes = require("./routes/communityRoutes");
const { ensureDefaultDepartments } = require("./services/departmentService");

const app = express();
const server = http.createServer(app);

const frontendOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

const io = new Server(server, {
  cors: {
    origin: frontendOrigin,
    credentials: true,
  },
});

app.set("io", io);

connectDB().then(() => ensureDefaultDepartments().catch((error) => console.error("Department seed failed", error.message)));

const corsOptions = {
  origin: frontendOrigin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  exposedHeaders: ["Content-Disposition", "X-Resume-Reupload"],
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));
app.post("/api/payments/webhook", express.raw({ type: "application/json" }), (req, res, next) => {
  require("./controllers/paymentController").webhook(req, res, next);
});
app.use(express.json({ limit: "1mb" }));

app.use("/api/users", userRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/operations", operationsRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", platformRoutes);
app.use("/api", communityRoutes);

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next();
  try {
    const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
    const payload = jwt.verify(token, secret, { issuer: "smartciviconnect" });
    socket.userId = payload.sub;
    socket.userRole = payload.role;
    return next();
  } catch {
    return next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  if (socket.userId) {
    socket.join(`user:${socket.userId}`);
    if (socket.userRole) socket.join(`role:${socket.userRole}`);
    socket.broadcast.emit("presence:online", { userId: socket.userId });
  }
  socket.on("complaint:join", (complaintId) => socket.join(`complaint:${complaintId}`));
  socket.on("chat:join", (conversationId) => socket.join(`conversation:${conversationId}`));
  socket.on("chat:typing", (payload) => {
    if (!socket.userId || !payload?.conversationId) return;
    io.to(`conversation:${payload.conversationId}`).emit("chat:typing", { userId: socket.userId, typing: Boolean(payload.typing) });
  });
  socket.on("location:update", (payload) => {
    if (!socket.userId) return;
    const data = { ...payload, staffId: socket.userId };
    if (payload?.complaintId) {
      io.to(`complaint:${payload.complaintId}`).emit("location:update", data);
      io.to(`complaint:${payload.complaintId}`).emit("location:updated", data);
    }
    ["Officer", "Head Officer", "Admin", "Super Admin"].forEach((role) => io.to(`role:${role}`).emit("location:update", data));
  });
  socket.on("disconnect", () => {
    if (socket.userId) socket.broadcast.emit("presence:offline", { userId: socket.userId });
  });
});

app.get("/", (req, res) => {
  res.send("SmartciviConnect Backend Running");
});

app.use((error, req, res, next) => {
  console.error(error.message);
  if (res.headersSent) return next(error);
  const status = error.status || (error.name === "ValidationError" || error.name === "CastError" ? 400 : 500);
  res.status(status).json({ success: false, message: error.message || "Internal server error" });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
