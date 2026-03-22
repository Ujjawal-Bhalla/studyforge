const db = require("../config/db");

// Start session
const startSession = async (userId) => {
  const result = await db.query(
    "INSERT INTO pomodoro_sessions (user_id, start_time) VALUES ($1, NOW()) RETURNING *",
    [userId]
  );
  return result.rows[0];
};

// End session
const endSession = async (sessionId, userId) => {
  const result = await db.query(
    `UPDATE pomodoro_sessions
     SET end_time = NOW(),
         duration = EXTRACT(EPOCH FROM (NOW() - start_time))
     WHERE id = $1 AND user_id = $2 AND end_time IS NULL
     RETURNING *`,
    [sessionId, userId]
  );
  return result.rows[0];
};

// Get all inactive sessions
const getSessions = async (userId) => {
  const result = await db.query(
    `SELECT id, start_time, end_time, duration
     FROM pomodoro_sessions
     WHERE user_id = $1 AND end_time IS NOT NULL
     ORDER BY start_time DESC`,
    [userId]
  );
  return result.rows;
};

// Check active session
const getActiveSession = async (userId) => {
  const result = await db.query(
    "SELECT * FROM pomodoro_sessions WHERE user_id = $1 AND end_time IS NULL",
    [userId]
  );
  return result.rows[0];
};

// Total focus time
const getTotalFocusTime = async (userId) => {
  const result = await db.query(
    "SELECT SUM(duration) AS total FROM pomodoro_sessions WHERE user_id = $1",
    [userId]
  );
  return result.rows[0];
};
// Reset Pomodoro sessions
const resetPomodoro = async (userId) => {
  await db.query(
    "DELETE FROM pomodoro_sessions WHERE user_id = $1",
    [userId]
   );
};
module.exports = {
  startSession,
  endSession,
  getSessions,
  getActiveSession,
  getTotalFocusTime,
  resetPomodoro
};

