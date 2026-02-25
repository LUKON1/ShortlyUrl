require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookie = require("cookie-parser");
const compression = require("compression");

const urlShorterRouter = require("./routes/cut");
const getUsUrlsRouter = require("./routes/myurls");
const userRouter = require("./routes/user");
const shareRouter = require("./routes/share");
const auth = require("./middleware/auth");
const redirectRouter = require("./routes/redirect");

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;
const HOST_NAME = process.env.HOST_NAME;

app.use(compression());
app.use(helmet());

// Allowed origins
const allowedOrigins = [
  HOST_NAME, // Production URL from .env
  "http://localhost:5173", // Local Frontend
  "http://localhost:4173", // Local Preview
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["POST", "GET", "DELETE", "PATCH", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    credentials: true,
  })
);

app.use(express.json());
const mongoSanitize = require("express-mongo-sanitize");
app.use((req, res, next) => {
  const options = { replaceWith: "_" };
  if (req.body) mongoSanitize.sanitize(req.body, options);
  if (req.params) mongoSanitize.sanitize(req.params, options);
  if (req.query) mongoSanitize.sanitize(req.query, options);
  next();
});
app.use(cookie());

const apiLimiter = require("./middleware/rateLimiter");
// Stricter limit for auth routes to prevent brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts, please try again later." },
});

app.use("/api/cut", apiLimiter, urlShorterRouter);
app.use("/api/myurls", auth, getUsUrlsRouter);
app.use("/api/user", authLimiter, userRouter);
app.use("/api/share", shareRouter);

app.use("/", redirectRouter);

const startAggregation = require("./cron/aggregateStats");
const startCleanupJob = require("./cron/cleanupExpiredUrls");

startAggregation();
startCleanupJob();

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("mongo db connected");
  })
  .catch((err) => {
    console.error(`mongo db connected with error:${err.message}`);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Shortly url server is started on port:${PORT}`);
});
