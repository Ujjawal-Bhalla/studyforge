require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("StudyForge API running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
const pool = require("./config/db");

pool.connect()
  .then(() => console.log("DB connected"))
  .catch(err => console.error(err));
const taskRoutes = require("./routes/taskRoutes");

app.use("/api/tasks", taskRoutes);
