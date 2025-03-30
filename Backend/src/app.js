
const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors())

const authRoutes = require("./routes/auth.routes");
const questionRoutes = require("./routes/question.routes")

app.use("/api/auth", authRoutes)
app.use("/api/questions", questionRoutes)

module.exports = app;