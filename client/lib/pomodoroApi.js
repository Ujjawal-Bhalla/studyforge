import { api } from "./apiClient";

export const getPomodoroHistory = () => api.get("/pomodoro");
export const getPomodoroTotal = () => api.get("/pomodoro/total");
export const getActivePomodoro = () => api.get("/pomodoro/active");
export const startPomodoro = (payload) => api.post("/pomodoro/start", payload);
export const pausePomodoro = (sessionId) => api.put(`/pomodoro/pause/${sessionId}`);
export const resumePomodoro = (sessionId) => api.put(`/pomodoro/resume/${sessionId}`);
export const endPomodoro = (sessionId, outcome) =>
  api.put(`/pomodoro/end/${sessionId}`, { outcome });
