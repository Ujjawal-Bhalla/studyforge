import { useEffect, useState } from "react";
import { getPomodoroHistory} from "@/lib/pomodoroApi";

export default function PomodoroHistory({refreshTrigger=false}) {
  const [sessions, setSessions] = useState([]);
  
useEffect(() => {
  if (refreshTrigger !== undefined) {
    fetchHistory();
  }
}, [refreshTrigger]);
  const fetchHistory = async () => {
    try {
      const res = await getPomodoroHistory();
      setSessions(res);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const hrs = Math.floor(mins / 60);

  if (hrs > 0) return `${hrs}h ${mins % 60}m`;
  return `${mins}m`;
};

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-3">History</h2>

      <div className="space-y-2">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex justify-between items-center bg-gray-800 p-3 rounded-lg"
          >
            <div>
              <p className="text-sm text-gray-300">
                {new Date(session.start_time).toLocaleString()}
              </p>
            </div>

            <div className="font-medium">
              {formatDuration(session.duration)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
