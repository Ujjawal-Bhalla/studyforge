const pomodoroModel = require("../models/pomodoroModel");

const PRESETS = {
  classic: {
    focus: 1500,
    short_break: 300,
    long_break: 900,
  },
  deep: {
    focus: 3000,
    short_break: 600,
    long_break: 1200,
  },
  extended: {
    focus: 5400,
    short_break: 1200,
    long_break: 1800,
  },
};

const VALID_MODES = ["pomodoro", "custom_timer", "stopwatch"];
const VALID_PHASES = ["focus", "short_break", "long_break", "custom", "stopwatch"];
const VALID_OUTCOMES = ["completed", "cancelled"];

const isCountdownMode = (modeType) => modeType !== "stopwatch";

const getElapsedSeconds = (session) => {
  const baseDuration = session.duration || 0;

  if (session.status === "paused") {
    return baseDuration;
  }

  const startedAt = new Date(session.start_time).getTime();
  const now = Date.now();
  const elapsedThisRun = Math.max(0, Math.floor((now - startedAt) / 1000));

  if (session.mode_type === "stopwatch") {
    return baseDuration + elapsedThisRun;
  }

  const previousElapsed = session.remaining_seconds != null
    ? Math.max(baseDuration, session.target_duration - session.remaining_seconds)
    : baseDuration;

  return Math.min(session.target_duration, previousElapsed + elapsedThisRun);
};

const getRemainingSeconds = (session) => {
  if (!isCountdownMode(session.mode_type)) {
    return null;
  }

  if (session.status === "paused") {
    return Math.max(0, session.remaining_seconds ?? session.target_duration ?? 0);
  }

  return Math.max(0, (session.target_duration ?? 0) - getElapsedSeconds(session));
};

const getSuggestedNextPhase = (lastCompletedPhase, focusStreak) => {
  if (!lastCompletedPhase) return null;

  if (lastCompletedPhase.phase_type === "focus") {
    return focusStreak > 0 && focusStreak % 4 === 0 ? "long_break" : "short_break";
  }

  if (lastCompletedPhase.phase_type === "short_break" || lastCompletedPhase.phase_type === "long_break") {
    return "focus";
  }

  return null;
};

const serializeSession = (session) => {
  if (!session) return null;

  return {
    ...session,
    elapsed_seconds: getElapsedSeconds(session),
    remaining_seconds: getRemainingSeconds(session),
  };
};

const buildActivePayload = async (userId) => {
  let currentSession = await pomodoroModel.getCurrentSession(userId);

  if (
    currentSession &&
    currentSession.status === "active" &&
    isCountdownMode(currentSession.mode_type) &&
    getRemainingSeconds(currentSession) <= 0
  ) {
    await pomodoroModel.endSession(
      currentSession.id,
      userId,
      "completed",
      currentSession.target_duration,
      new Date()
    );
    currentSession = null;
  }

  const focusStreak = await pomodoroModel.getFocusStreak(userId);
  const lastCompletedPhase = await pomodoroModel.getLastCompletedPomodoroPhase(userId);
  const totalTrackedSeconds = await pomodoroModel.getTotalTrackedTime(userId);

  return {
    activeSession: serializeSession(currentSession),
    focusStreak,
    suggestedNextPhase: getSuggestedNextPhase(lastCompletedPhase, focusStreak),
    totalTrackedSeconds,
  };
};

const getPomodoroTargetDuration = (presetKey, phaseType) => {
  return PRESETS[presetKey]?.[phaseType] || null;
};

const validateStartPayload = ({ modeType, phaseType, presetKey, targetDuration }) => {
  if (!VALID_MODES.includes(modeType)) {
    return "Invalid timer mode selected";
  }

  if (!VALID_PHASES.includes(phaseType)) {
    return "Invalid timer phase selected";
  }

  if (modeType === "pomodoro") {
    if (!PRESETS[presetKey]) {
      return "Invalid preset selected";
    }

    if (!["focus", "short_break", "long_break"].includes(phaseType)) {
      return "Invalid Pomodoro phase selected";
    }
  }

  if (modeType === "custom_timer") {
    if (phaseType !== "custom") {
      return "Custom timer must use the custom phase";
    }

    if (!Number.isInteger(targetDuration) || targetDuration <= 0) {
      return "Custom timer duration must be greater than 0";
    }
  }

  if (modeType === "stopwatch" && phaseType !== "stopwatch") {
    return "Stopwatch must use the stopwatch phase";
  }

  return null;
};

const startSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const modeType = req.body?.modeType || "pomodoro";
    const phaseType = req.body?.phaseType || (modeType === "stopwatch" ? "stopwatch" : "focus");
    const presetKey = req.body?.presetKey || null;
    const customDuration = Number(req.body?.targetDuration);

    const validationError = validateStartPayload({
      modeType,
      phaseType,
      presetKey,
      targetDuration: customDuration,
    });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const active = await pomodoroModel.getCurrentSession(userId);
    if (active) {
      return res.status(400).json({ message: "You already have an active study timer session" });
    }

    const targetDuration = modeType === "pomodoro"
      ? getPomodoroTargetDuration(presetKey, phaseType)
      : modeType === "custom_timer"
        ? customDuration
        : null;

    const session = await pomodoroModel.createSession(
      userId,
      modeType,
      phaseType,
      modeType === "pomodoro" ? presetKey : null,
      targetDuration
    );

    res.status(201).json(serializeSession(session));
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getActiveSession = async (req, res) => {
  try {
    const payload = await buildActivePayload(req.user.id);
    res.json(payload);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const pauseSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const sessionId = Number(req.params.id);
    const currentSession = await pomodoroModel.getCurrentSession(userId);

    if (!currentSession || currentSession.id !== sessionId || currentSession.status !== "active") {
      return res.status(404).json({ message: "Active session not found" });
    }

    const remainingSeconds = getRemainingSeconds(currentSession);
    const duration = getElapsedSeconds(currentSession);
    const session = await pomodoroModel.pauseSession(sessionId, userId, remainingSeconds, duration);

    if (!session) {
      return res.status(404).json({ message: "Active session not found" });
    }

    res.json(serializeSession(session));
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const resumeSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const sessionId = Number(req.params.id);
    const currentSession = await pomodoroModel.getCurrentSession(userId);

    if (!currentSession || currentSession.id !== sessionId || currentSession.status !== "paused") {
      return res.status(404).json({ message: "Paused session not found" });
    }

    const session = await pomodoroModel.resumeSession(sessionId, userId);

    if (!session) {
      return res.status(404).json({ message: "Paused session not found" });
    }

    res.json(serializeSession(session));
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const endSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const sessionId = Number(req.params.id);
    const outcome = req.body?.outcome || "completed";

    if (!VALID_OUTCOMES.includes(outcome)) {
      return res.status(400).json({ message: "Invalid session outcome" });
    }

    const currentSession = await pomodoroModel.getCurrentSession(userId);

    if (!currentSession || currentSession.id !== sessionId) {
      return res.status(404).json({ message: "Session not found or already ended" });
    }

    const elapsedSeconds = getElapsedSeconds(currentSession);
    const remainingSeconds = getRemainingSeconds(currentSession);
    const completedByExpiry = isCountdownMode(currentSession.mode_type) && remainingSeconds === 0;
    const duration = outcome === "completed"
      ? completedByExpiry
        ? currentSession.target_duration
        : elapsedSeconds
      : elapsedSeconds;

    const completedAt = outcome === "completed" ? new Date() : null;
    const session = await pomodoroModel.endSession(sessionId, userId, outcome, duration, completedAt);

    if (!session) {
      return res.status(404).json({ message: "Session not found or already ended" });
    }

    const payload = await buildActivePayload(userId);

    res.json({
      session,
      focusStreak: payload.focusStreak,
      suggestedNextPhase: payload.suggestedNextPhase,
      totalTrackedSeconds: payload.totalTrackedSeconds,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getSessions = async (req, res) => {
  try {
    const sessions = await pomodoroModel.getCompletedSessions(req.user.id);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getTotalFocusTime = async (req, res) => {
  try {
    const totalSeconds = await pomodoroModel.getTotalTrackedTime(req.user.id);
    res.json({ totalSeconds });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const resetPomodoro = async (req, res) => {
  try {
    await pomodoroModel.resetPomodoro(req.user.id);
    res.json({ message: "Pomodoro history cleared" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  startSession,
  getActiveSession,
  pauseSession,
  resumeSession,
  endSession,
  getSessions,
  getTotalFocusTime,
  resetPomodoro,
};
