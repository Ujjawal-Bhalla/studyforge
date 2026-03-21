const pomodoroModel = require("../models/pomodoroModel");

// Start
const startSession = async (req, res) => {
  try {
    const userId = req.user.id;

    // check active session
    const active = await pomodoroModel.getActiveSession(userId);

    if (active) {
      return res.status(400).json({
        message: "You already have an active session",
      });
    }

    const session = await pomodoroModel.startSession(userId);

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// End
const endSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const sessionId = req.params.id;

    const session = await pomodoroModel.endSession(sessionId, userId);

    if (!session) {
      return res.status(404).json({ message: "Session not found or already ended" });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get
const getSessions = async (req, res) => {
  try {
    const userId = req.user.id;

    const sessions = await pomodoroModel.getSessions(userId);

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get total focus time
const getTotalFocusTime = async (req, res) => {
  try {
    const userId = req.user.id;

    const data = await pomodoroModel.getTotalFocusTime(userId);

    res.json({ totalSeconds: data.total || 0 });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  startSession,
  endSession,
  getSessions,
  getTotalFocusTime
};
