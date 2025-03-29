
const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors())

const authRoutes = require("./routes/auth.routes");

app.use("/api/auth", authRoutes)

module.exports = app;