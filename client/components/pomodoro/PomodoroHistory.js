import { useEffect, useState } from "react";
import { getPomodoroHistory } from "@/lib/pomodoroApi";

const MODE_LABELS = {
  pomodoro: "Pomodoro",
  custom_timer: "Custom Timer",
  stopwatch: "Stopwatch",
};

const PHASE_LABELS = {
  focus: "Focus",
  short_break: "Short Break",
  long_break: "Long Break",
  custom: "Custom Timer",
  stopwatch: "Stopwatch",
};

export default function PomodoroHistory({ refreshTrigger = false }) {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await getPomodoroHistory();
        setSessions(res);
      } catch (err) {
        console.error(err);
      }
    };

    loadHistory();
  }, [refreshTrigger]);

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  const getSessionLabel = (session) => {
    if (session.mode_type === "pomodoro") {
      return `Pomodoro ${PHASE_LABELS[session.phase_type] || "Session"}`;
    }

    return MODE_LABELS[session.mode_type] || "Session";
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-3">Session History</h2>

      <div className="space-y-2">
        {sessions.length === 0 ? (
          <div className="bg-gray-100 border p-3 rounded-lg text-sm text-gray-500">
            No completed timer sessions yet.
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="flex justify-between items-center bg-gray-100 border p-3 rounded-lg"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {getSessionLabel(session)}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  {new Date(session.completed_at || session.end_time).toLocaleString()}
                </p>
                {session.mode_type === "pomodoro" && session.preset_key && (
                  <p className="text-xs text-gray-500 mt-1 capitalize">
                    {session.preset_key} preset
                  </p>
                )}
              </div>

              <div className="font-medium text-gray-900">
                {formatDuration(session.duration)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
