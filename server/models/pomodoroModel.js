const db = require("../config/db");

const createSession = async (userId, modeType, phaseType, presetKey, targetDuration) => {
  const result = await db.query(
    `INSERT INTO pomodoro_sessions (
      user_id,
      mode_type,
      phase_type,
      preset_key,
      target_duration,
      status,
      start_time,
      duration,
      remaining_seconds,
      end_time,
      completed_at
    )
    VALUES ($1, $2, $3, $4, $5, 'active', NOW(), 0, $6, NULL, NULL)
    RETURNING *`,
    [
      userId,
      modeType,
      phaseType,
      presetKey,
      targetDuration,
      modeType === "stopwatch" ? null : targetDuration,
    ]
  );

  return result.rows[0];
};

const getCurrentSession = async (userId) => {
  const result = await db.query(
    `SELECT *
     FROM pomodoro_sessions
     WHERE user_id = $1 AND status IN ('active', 'paused')
     ORDER BY id DESC
     LIMIT 1`,
    [userId]
  );

  return result.rows[0] || null;
};

const pauseSession = async (sessionId, userId, remainingSeconds, duration) => {
  const result = await db.query(
    `UPDATE pomodoro_sessions
     SET status = 'paused',
         remaining_seconds = $1,
         duration = $2,
         end_time = NOW()
     WHERE id = $3 AND user_id = $4 AND status = 'active'
     RETURNING *`,
    [remainingSeconds, duration, sessionId, userId]
  );

  return result.rows[0] || null;
};

const resumeSession = async (sessionId, userId) => {
  const result = await db.query(
    `UPDATE pomodoro_sessions
     SET status = 'active',
         start_time = NOW(),
         end_time = NULL
     WHERE id = $1 AND user_id = $2 AND status = 'paused'
     RETURNING *`,
    [sessionId, userId]
  );

  return result.rows[0] || null;
};

const endSession = async (sessionId, userId, outcome, duration, completedAt) => {
  const status = outcome === "completed" ? "completed" : "cancelled";

  const result = await db.query(
    `UPDATE pomodoro_sessions
     SET status = $1,
         duration = $2,
         end_time = NOW(),
         completed_at = $3,
         remaining_seconds = NULL
     WHERE id = $4 AND user_id = $5 AND status IN ('active', 'paused')
     RETURNING *`,
    [status, duration, completedAt, sessionId, userId]
  );

  return result.rows[0] || null;
};

const getCompletedSessions = async (userId) => {
  const result = await db.query(
    `SELECT id, mode_type, phase_type, preset_key, target_duration, duration, start_time, end_time, completed_at
     FROM pomodoro_sessions
     WHERE user_id = $1
       AND status = 'completed'
     ORDER BY completed_at DESC NULLS LAST, id DESC`,
    [userId]
  );

  return result.rows;
};

const getTotalTrackedTime = async (userId) => {
  const result = await db.query(
    `SELECT COALESCE(SUM(duration), 0) AS total
     FROM pomodoro_sessions
     WHERE user_id = $1
       AND status = 'completed'`,
    [userId]
  );

  return Number(result.rows[0]?.total || 0);
};

const getLastCompletedPomodoroPhase = async (userId) => {
  const result = await db.query(
    `SELECT *
     FROM pomodoro_sessions
     WHERE user_id = $1
       AND status = 'completed'
       AND mode_type = 'pomodoro'
     ORDER BY completed_at DESC NULLS LAST, id DESC
     LIMIT 1`,
    [userId]
  );

  return result.rows[0] || null;
};

const getFocusStreak = async (userId) => {
  const result = await db.query(
    `WITH last_long_break AS (
       SELECT completed_at
       FROM pomodoro_sessions
       WHERE user_id = $1
         AND status = 'completed'
         AND mode_type = 'pomodoro'
         AND phase_type = 'long_break'
       ORDER BY completed_at DESC NULLS LAST, id DESC
       LIMIT 1
     )
     SELECT COUNT(*)::int AS streak
     FROM pomodoro_sessions
     WHERE user_id = $1
       AND status = 'completed'
       AND mode_type = 'pomodoro'
       AND phase_type = 'focus'
       AND completed_at > COALESCE((SELECT completed_at FROM last_long_break), TO_TIMESTAMP(0))`,
    [userId]
  );

  return result.rows[0]?.streak || 0;
};

const resetPomodoro = async (userId) => {
  await db.query("DELETE FROM pomodoro_sessions WHERE user_id = $1", [userId]);
};

module.exports = {
  createSession,
  getCurrentSession,
  pauseSession,
  resumeSession,
  endSession,
  getCompletedSessions,
  getTotalTrackedTime,
  getLastCompletedPomodoroPhase,
  getFocusStreak,
  resetPomodoro,
};
