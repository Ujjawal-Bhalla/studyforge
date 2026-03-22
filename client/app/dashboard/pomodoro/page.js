"use client";

import { useState } from "react";
import { api } from "@/lib/apiClient";
import { useEffect } from "react";

export default function PomodoroPage() {
  const [session, setSession] = useState(null);
  const [time, setTime] = useState(0);
  useEffect(() => {
  let interval;

  if (session) {
    interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
  }

  return () => {
    clearInterval(interval);
  };
}, [session]);
  const handleStart = async () => {
    try {
      const data = await api.post("/pomodoro/start");

      setSession(data);
      setTime(0);
    } catch (err) {
      alert(err.message);
    }
  };
  useEffect(() => {
  const fetchActiveSession = async () => {
    try {
      const sessions = await api.get("/pomodoro");

      const active = sessions.find((s) => !s.end_time);

      if (active) {
        setSession(active);

        const start = new Date(active.start_time);
        const now = new Date();

        const diff = Math.floor((now - start) / 1000);

        setTime(diff);
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchActiveSession();
}, []);
  const handleEnd = async () => {
    if (!session) return;

    try {
      await api.put(`/pomodoro/end/${session.id}`);

      setSession(null);
    } catch (err) {
      alert(err.message);
    }
  };
  
  const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pomodoro</h1>

      <div className="text-4xl mb-4">{formatTime(time)}</div>

      {!session ? (
        <button
          onClick={handleStart}
          className="bg-green-500 text-white px-4 py-2"
        >
          Start
        </button>
      ) : (
        <button
          onClick={handleEnd}
          className="bg-red-500 text-white px-4 py-2"
        >
          Stop
        </button>
      )}
    </div>
  );
}
