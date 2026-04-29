const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  startSession,
  getActiveSession,
  pauseSession,
  resumeSession,
  endSession,
  getSessions,
  getTotalFocusTime,
  resetPomodoro,
} = require("../controllers/pomodoroController");

router.post("/start", authMiddleware, startSession);
router.get("/active", authMiddleware, getActiveSession);
router.put("/pause/:id", authMiddleware, pauseSession);
router.put("/resume/:id", authMiddleware, resumeSession);
router.put("/end/:id", authMiddleware, endSession);
router.get("/", authMiddleware, getSessions);
router.get("/total", authMiddleware, getTotalFocusTime);
router.delete("/reset", authMiddleware, resetPomodoro);

module.exports = router;
