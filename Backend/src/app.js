const express = require("express");
const app = express();
const cors = require("cors");
const morgon = require("morgan");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgon("dev"));

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const questionRoutes = require("./routes/question.routes");
const answerRoutes = require("./routes/answer.routes");
const roomRoutes = require("./routes/room.routes");
const commentRoutes = require("./routes/comment.routes")

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/comments", commentRoutes);

module.exports = app;
