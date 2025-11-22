require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookie = require("cookie-parser");

const urlShorterRouter = require("./routes/cut");
const getUsUrlsRouter = require("./routes/myurls");
const userRouter = require("./routes/user");
const shareRouter = require("./routes/share");
const auth = require("./middleware/auth");
const redirectRouter = require("./routes/redirect");

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;
const HOST_NAME = process.env.HOST_NAME;

app.use(
  cors({
    origin: HOST_NAME,
    methods: ["POST", "GET", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookie());

app.use("/api/cut", urlShorterRouter);
app.use("/api/myurls", auth, getUsUrlsRouter);
app.use("/api/user", userRouter);
app.use("/api/share", shareRouter);

app.use("/", redirectRouter);

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
