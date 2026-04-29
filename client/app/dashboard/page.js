"use client";

import { useEffect, useMemo, useState } from "react";
import ProfileCard from "@/components/dashboard/ProfileCard";
import FocusHeatmap from "@/components/dashboard/FocusHeatmap";
import PeakHoursChart from "@/components/dashboard/PeakHoursChart";
import SummaryCard from "@/components/dashboard/SummaryCard";
import UpcomingTasksCard from "@/components/dashboard/UpcomingTasksCard";
import { api } from "@/lib/apiClient";
import { getUser } from "@/lib/auth";

const formatTrackedTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);

  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
};

export default function DashboardHome() {
  const [userName, setUserName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [timerSummary, setTimerSummary] = useState({
    totalTrackedSeconds: 0,
    focusStreak: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const user = getUser();
        const [taskData, timerData, journalData] = await Promise.all([
          api.get("/tasks"),
          api.get("/pomodoro/active"),
          api.get("/journal"),
        ]);

        setUserName(user?.name || "User");
        setTasks(taskData);
        setTimerSummary({
          totalTrackedSeconds: timerData.totalTrackedSeconds || 0,
          focusStreak: timerData.focusStreak || 0,
        });
        setJournalEntries(journalData);
      } catch (err) {
        console.error(err);
        alert("Failed to load dashboard overview");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const pendingTasks = useMemo(
    () => tasks.filter((task) => !task.completed),
    [tasks]
  );

  const upcomingTasks = pendingTasks.slice(0, 5);
  const totalTrackedLabel = formatTrackedTime(timerSummary.totalTrackedSeconds || 0);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-white px-6 py-7">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-gray-500">
          Study Overview
        </p>
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              Welcome back, {userName}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              Keep an eye on your pending work, study consistency, and focus momentum from one place.
            </p>
          </div>
          <div className="rounded-2xl border bg-gray-50 px-4 py-3 text-sm text-gray-600">
            {isLoading
              ? "Loading dashboard summary..."
              : `${pendingTasks.length} pending tasks and ${journalEntries.length} journal entries in your workspace.`}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Pending Tasks"
          value={pendingTasks.length}
          detail="Incomplete tasks waiting for attention"
        />
        <SummaryCard
          label="Total Study Time"
          value={totalTrackedLabel}
          detail="Tracked across Pomodoro, custom timer, and stopwatch"
        />
        <SummaryCard
          label="Focus Streak"
          value={timerSummary.focusStreak || 0}
          detail="Pomodoro focus sessions since the last long break"
        />
        <SummaryCard
          label="Journal Entries"
          value={journalEntries.length}
          detail="Reflections stored in your study journal"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <UpcomingTasksCard tasks={upcomingTasks} />
        <ProfileCard name={userName} />
      </section>

      <section className="grid gap-6">
        <PeakHoursChart />
        <FocusHeatmap />
      </section>
    </div>
  );
}
