"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PomodoroHistory from "@/components/pomodoro/PomodoroHistory";
import {
  endPomodoro,
  getActivePomodoro,
  pausePomodoro,
  resumePomodoro,
  startPomodoro,
} from "@/lib/pomodoroApi";

const MODES = {
  pomodoro: "Pomodoro",
  custom_timer: "Custom Timer",
  stopwatch: "Stopwatch",
};

const PRESETS = {
  classic: {
    label: "Classic",
    focus: 1500,
    short_break: 300,
    long_break: 900,
  },
  deep: {
    label: "Deep Work",
    focus: 3000,
    short_break: 600,
    long_break: 1200,
  },
  extended: {
    label: "Extended",
    focus: 5400,
    short_break: 1200,
    long_break: 1800,
  },
};

const PHASE_LABELS = {
  focus: "Focus",
  short_break: "Short Break",
  long_break: "Long Break",
  custom: "Custom Timer",
  stopwatch: "Stopwatch",
};

const DEFAULT_CUSTOM_INPUT = {
  hours: "0",
  minutes: "25",
  seconds: "0",
};

const formatDisplayTime = (seconds) => {
  const safeSeconds = Math.max(0, seconds);
  const hrs = Math.floor(safeSeconds / 3600);
  const mins = Math.floor((safeSeconds % 3600) / 60);
  const secs = safeSeconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatDurationSummary = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
};

export default function PomodoroPage() {
  const [selectedMode, setSelectedMode] = useState("pomodoro");
  const [selectedPreset, setSelectedPreset] = useState("classic");
  const [pomodoroPhase, setPomodoroPhase] = useState("focus");
  const [customInput, setCustomInput] = useState(DEFAULT_CUSTOM_INPUT);
  const [activeSession, setActiveSession] = useState(null);
  const [displaySeconds, setDisplaySeconds] = useState(PRESETS.classic.focus);
  const [refreshHistory, setRefreshHistory] = useState(false);
  const [focusStreak, setFocusStreak] = useState(0);
  const [suggestedNextPhase, setSuggestedNextPhase] = useState(null);
  const [totalTrackedTime, setTotalTrackedTime] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [isWorking, setIsWorking] = useState(false);

  const timerAnchorRef = useRef(null);
  const timerBaseRef = useRef(null);
  const isCompletingRef = useRef(false);

  const getCustomTargetSeconds = useCallback(() => {
    const hours = Number(customInput.hours || 0);
    const minutes = Number(customInput.minutes || 0);
    const seconds = Number(customInput.seconds || 0);

    if ([hours, minutes, seconds].some((value) => Number.isNaN(value) || value < 0)) {
      return 0;
    }

    return (hours * 3600) + (minutes * 60) + seconds;
  }, [customInput]);

  const getPomodoroTargetDuration = useCallback(
    (presetKey, phaseType) => PRESETS[presetKey][phaseType],
    []
  );

  const getIdleDisplaySeconds = useCallback((modeType = selectedMode) => {
    if (modeType === "pomodoro") {
      return getPomodoroTargetDuration(selectedPreset, pomodoroPhase);
    }

    if (modeType === "custom_timer") {
      return getCustomTargetSeconds();
    }

    return 0;
  }, [getCustomTargetSeconds, getPomodoroTargetDuration, pomodoroPhase, selectedMode, selectedPreset]);

  const setIdleDisplay = useCallback((modeType = selectedMode) => {
    setDisplaySeconds(getIdleDisplaySeconds(modeType));
  }, [getIdleDisplaySeconds, selectedMode]);

  const syncFromSession = useCallback((session) => {
    setActiveSession(session);
    setSelectedMode(session.mode_type);
    setSessionComplete(false);

    if (session.mode_type === "pomodoro") {
      setSelectedPreset(session.preset_key || "classic");
      setPomodoroPhase(session.phase_type);
    }

    if (session.mode_type === "custom_timer" && session.target_duration) {
      const hours = Math.floor(session.target_duration / 3600);
      const minutes = Math.floor((session.target_duration % 3600) / 60);
      const seconds = session.target_duration % 60;
      setCustomInput({
        hours: String(hours),
        minutes: String(minutes),
        seconds: String(seconds),
      });
    }

    const baseValue = session.mode_type === "stopwatch"
      ? session.elapsed_seconds
      : session.remaining_seconds;

    setDisplaySeconds(baseValue ?? 0);
    timerBaseRef.current = baseValue ?? 0;
    timerAnchorRef.current = session.status === "active" ? Date.now() : null;
    isCompletingRef.current = false;
  }, []);

  const clearActiveTimer = useCallback((modeType = selectedMode, nextDisplaySeconds = null) => {
    setActiveSession(null);
    timerBaseRef.current = null;
    timerAnchorRef.current = null;
    isCompletingRef.current = false;
    if (nextDisplaySeconds != null) {
      setDisplaySeconds(nextDisplaySeconds);
      return;
    }
    setIdleDisplay(modeType);
  }, [selectedMode, setIdleDisplay]);

  const loadTimerState = useCallback(async () => {
    const activeData = await getActivePomodoro();

    setFocusStreak(activeData.focusStreak || 0);
    setSuggestedNextPhase(activeData.suggestedNextPhase || null);
    setTotalTrackedTime(activeData.totalTrackedSeconds || 0);

    if (activeData.activeSession) {
      syncFromSession(activeData.activeSession);
      return;
    }

    if (selectedMode === "pomodoro" && activeData.suggestedNextPhase) {
      setPomodoroPhase(activeData.suggestedNextPhase);
      setSessionComplete(true);
      clearActiveTimer(
        selectedMode,
        getPomodoroTargetDuration(selectedPreset, activeData.suggestedNextPhase)
      );
      return;
    }

    clearActiveTimer(selectedMode);
  }, [clearActiveTimer, getPomodoroTargetDuration, selectedMode, selectedPreset, syncFromSession]);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await loadTimerState();
      } catch (err) {
        console.error(err);
        alert("Failed to load study timer");
      }
    };

    bootstrap();
  }, [loadTimerState]);

  useEffect(() => {
    if (activeSession || sessionComplete) return;
    setIdleDisplay(selectedMode);
  }, [activeSession, selectedMode, pomodoroPhase, selectedPreset, customInput, sessionComplete, setIdleDisplay]);

  useEffect(() => {
    if (!activeSession || activeSession.status !== "active") return;

    const updateDisplay = () => {
      const elapsedSinceAnchor = Math.floor((Date.now() - timerAnchorRef.current) / 1000);
      const nextValue = activeSession.mode_type === "stopwatch"
        ? timerBaseRef.current + elapsedSinceAnchor
        : Math.max(0, timerBaseRef.current - elapsedSinceAnchor);

      setDisplaySeconds(nextValue);
    };

    updateDisplay();
    const interval = setInterval(updateDisplay, 1000);

    return () => clearInterval(interval);
  }, [activeSession]);

  useEffect(() => {
    if (!activeSession || activeSession.status !== "active") return;
    if (activeSession.mode_type === "stopwatch") return;
    if (displaySeconds > 0 || isCompletingRef.current) return;

    const completeCountdown = async () => {
      try {
        isCompletingRef.current = true;
        const data = await endPomodoro(activeSession.id, "completed");
        setFocusStreak(data.focusStreak || 0);
        setSuggestedNextPhase(data.suggestedNextPhase || null);
        setTotalTrackedTime(data.totalTrackedSeconds || 0);
        setSessionComplete(true);
        setRefreshHistory((prev) => !prev);
        if (activeSession.mode_type === "pomodoro") {
          const nextPhase = data.suggestedNextPhase || "focus";
          setPomodoroPhase(nextPhase);
          clearActiveTimer(
            activeSession.mode_type,
            getPomodoroTargetDuration(selectedPreset, nextPhase)
          );
        } else if (activeSession.mode_type === "custom_timer") {
          clearActiveTimer(activeSession.mode_type, getCustomTargetSeconds());
        } else {
          clearActiveTimer(activeSession.mode_type, 0);
        }
        alert(`${PHASE_LABELS[activeSession.phase_type]} complete`);
      } catch (err) {
        alert(err.message);
      } finally {
        isCompletingRef.current = false;
      }
    };

    completeCountdown();
  }, [activeSession, clearActiveTimer, displaySeconds, getCustomTargetSeconds, getPomodoroTargetDuration, selectedPreset]);

  const handleModeChange = (modeType) => {
    if (activeSession || isWorking) return;
    setSelectedMode(modeType);
    setSessionComplete(false);
    if (modeType === "pomodoro" && suggestedNextPhase) {
      setPomodoroPhase(suggestedNextPhase);
    }
  };

  const handleCustomInputChange = (field, value) => {
    if (activeSession || isWorking) return;
    if (!/^\d*$/.test(value)) return;

    setCustomInput((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSessionComplete(false);
  };

  const handleStart = async () => {
    try {
      setIsWorking(true);
      let payload;

      if (selectedMode === "pomodoro") {
        payload = {
          modeType: "pomodoro",
          phaseType: pomodoroPhase,
          presetKey: selectedPreset,
        };
      } else if (selectedMode === "custom_timer") {
        const targetDuration = getCustomTargetSeconds();
        if (targetDuration <= 0) {
          alert("Custom timer duration must be greater than 0");
          return;
        }

        payload = {
          modeType: "custom_timer",
          phaseType: "custom",
          targetDuration,
        };
      } else {
        payload = {
          modeType: "stopwatch",
          phaseType: "stopwatch",
        };
      }

      const session = await startPomodoro(payload);
      syncFromSession(session);
      setSuggestedNextPhase(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsWorking(false);
    }
  };

  const handlePause = async () => {
    if (!activeSession) return;

    try {
      setIsWorking(true);
      const session = await pausePomodoro(activeSession.id);
      syncFromSession(session);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsWorking(false);
    }
  };

  const handleResume = async () => {
    if (!activeSession) return;

    try {
      setIsWorking(true);
      const session = await resumePomodoro(activeSession.id);
      syncFromSession(session);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsWorking(false);
    }
  };

  const handleStop = async () => {
    if (!activeSession) return;

    try {
      setIsWorking(true);
      const data = await endPomodoro(activeSession.id, "completed");
      setFocusStreak(data.focusStreak || 0);
      setSuggestedNextPhase(data.suggestedNextPhase || null);
      setTotalTrackedTime(data.totalTrackedSeconds || 0);
      setSessionComplete(true);
      setRefreshHistory((prev) => !prev);
      if (activeSession.mode_type === "pomodoro") {
        const nextPhase = data.suggestedNextPhase || "focus";
        setPomodoroPhase(nextPhase);
        clearActiveTimer(
          activeSession.mode_type,
          getPomodoroTargetDuration(selectedPreset, nextPhase)
        );
      } else if (activeSession.mode_type === "custom_timer") {
        clearActiveTimer(activeSession.mode_type, getCustomTargetSeconds());
      } else {
        clearActiveTimer(activeSession.mode_type, 0);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setIsWorking(false);
    }
  };

  const handleReset = async () => {
    try {
      setIsWorking(true);

      if (activeSession) {
        await endPomodoro(activeSession.id, "cancelled");
      }

      setSessionComplete(false);
      clearActiveTimer(selectedMode);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsWorking(false);
    }
  };

  const currentMode = activeSession?.mode_type || selectedMode;
  const currentPhase = activeSession?.phase_type || (selectedMode === "pomodoro" ? pomodoroPhase : selectedMode === "custom_timer" ? "custom" : "stopwatch");
  const startLabel = sessionComplete && currentMode === "pomodoro"
    ? `Start ${PHASE_LABELS[pomodoroPhase]}`
    : "Start";

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Study Timer</h1>

      <div className="border rounded-xl p-5 bg-white space-y-5">
        <div>
          <p className="text-sm text-gray-500 mb-2">Mode</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(MODES).map(([modeType, label]) => (
              <button
                key={modeType}
                onClick={() => handleModeChange(modeType)}
                disabled={Boolean(activeSession) || isWorking}
                className={`px-4 py-2 border rounded-lg text-sm transition ${
                  selectedMode === modeType
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } ${activeSession ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {selectedMode === "pomodoro" && (
          <>
            <div>
              <p className="text-sm text-gray-500 mb-2">Preset</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => {
                      if (activeSession) return;
                      setSelectedPreset(key);
                      setSessionComplete(false);
                    }}
                    disabled={Boolean(activeSession) || isWorking}
                    className={`px-4 py-2 border rounded-lg text-sm transition ${
                      selectedPreset === key
                        ? "bg-gray-200 text-gray-900 border-gray-300"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    } ${activeSession ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Phase</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(PHASE_LABELS)
                  .filter(([phaseKey]) => ["focus", "short_break", "long_break"].includes(phaseKey))
                  .map(([phaseKey, label]) => (
                    <button
                      key={phaseKey}
                      onClick={() => {
                        if (activeSession) return;
                        setPomodoroPhase(phaseKey);
                        setSessionComplete(false);
                      }}
                      disabled={Boolean(activeSession) || isWorking}
                      className={`px-4 py-2 border rounded-lg text-sm transition ${
                        pomodoroPhase === phaseKey
                          ? "bg-gray-200 text-gray-900 border-gray-300"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      } ${activeSession ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      {label}
                    </button>
                  ))}
              </div>
            </div>
          </>
        )}

        {selectedMode === "custom_timer" && (
          <div>
            <p className="text-sm text-gray-500 mb-2">Custom Duration</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                ["hours", "Hours"],
                ["minutes", "Minutes"],
                ["seconds", "Seconds"],
              ].map(([field, label]) => (
                <input
                  key={field}
                  type="text"
                  inputMode="numeric"
                  value={customInput[field]}
                  onChange={(e) => handleCustomInputChange(field, e.target.value)}
                  disabled={Boolean(activeSession) || isWorking}
                  className="border rounded-lg p-2 text-sm"
                  placeholder={label}
                />
              ))}
            </div>
          </div>
        )}

        <div className="bg-gray-100 border rounded-xl p-6 text-center">
          <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">
            {PHASE_LABELS[currentPhase]}
          </p>
          <div className="text-5xl font-bold text-gray-900 mb-3">
            {formatDisplayTime(displaySeconds)}
          </div>
          <p className="text-sm text-gray-600">
            {activeSession
              ? activeSession.status === "paused"
                ? "Paused"
                : currentMode === "stopwatch"
                  ? "Stopwatch running"
                  : "Timer running"
              : sessionComplete
                ? currentMode === "pomodoro"
                  ? "Session saved. Start the next phase when you are ready."
                  : "Session saved. Start again when you are ready."
                : currentMode === "stopwatch"
                  ? "Ready to start the stopwatch."
                  : `Ready for a ${PHASE_LABELS[currentPhase].toLowerCase()} session.`}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {!activeSession && (
            <button
              onClick={handleStart}
              disabled={isWorking}
              className="bg-green-500 text-white px-4 py-2 rounded-lg disabled:opacity-60"
            >
              {startLabel}
            </button>
          )}

          {activeSession?.status === "active" && (
            <button
              onClick={handlePause}
              disabled={isWorking}
              className="border px-4 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-60"
            >
              Pause
            </button>
          )}

          {activeSession?.status === "paused" && (
            <button
              onClick={handleResume}
              disabled={isWorking}
              className="border px-4 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-60"
            >
              Resume
            </button>
          )}

          {activeSession && (
            <button
              onClick={handleStop}
              disabled={isWorking}
              className="border px-4 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-60"
            >
              Stop
            </button>
          )}

          <button
            onClick={handleReset}
            disabled={isWorking}
            className="bg-red-500 text-white px-4 py-2 rounded-lg disabled:opacity-60"
          >
            Reset
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div className="border rounded-lg p-4 bg-white">
            <p className="text-sm text-gray-500">Total tracked time</p>
            <p className="text-2xl font-semibold mt-1">{formatDurationSummary(totalTrackedTime)}</p>
          </div>

          <div className="border rounded-lg p-4 bg-white">
            <p className="text-sm text-gray-500">Pomodoro focus streak</p>
            <p className="text-2xl font-semibold mt-1">{focusStreak}</p>
          </div>
        </div>

        {selectedMode === "pomodoro" && suggestedNextPhase && !activeSession && (
          <div className="border rounded-lg p-4 bg-white text-sm text-gray-700">
            Suggested next phase: <span className="font-medium">{PHASE_LABELS[suggestedNextPhase]}</span>
          </div>
        )}
      </div>

      <PomodoroHistory refreshTrigger={refreshHistory} />
    </div>
  );
}
