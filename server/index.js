require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const pomodoroRoutes = require("./routes/pomodoroRoutes");
const journalRoutes = require("./routes/journalRoutes");

app.get("/", (req, res) => {
  res.send("StudyForge API running");
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/pomodoro", pomodoroRoutes);
app.use("/api/journal", journalRoutes);

pool.connect()
  .then(() => console.log("DB connected"))
  .catch(err => console.error(err));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

const journalRoutes = require("./routes/journalRoutes");

app.use("/api/journal", journalRoutes);
