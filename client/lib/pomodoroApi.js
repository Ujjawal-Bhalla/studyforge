import { api } from "./apiClient";

export const getPomodoroHistory = () => {
  return api.get("/pomodoro");
};
