"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API_URL from "@/lib/api";
import TaskInput from "@/components/tasks/TaskInput";
import TaskList from "@/components/tasks/TaskList";
import { getToken } from "@/lib/auth";
import { api } from "@/lib/apiClient";

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchTasks = async () => {
      try {
        const data = await api.get("/tasks");
        setTasks(data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch tasks");
      }
    };

    fetchTasks();
  }, [router]);

const handleCreateTask = async () => {
  const token = getToken();

  if (!title) {
    alert("Enter a task");
    return;
  }

  try {
    const data = await api.post("/tasks", { title });
    // ✅ update UI instantly
    setTasks((prev) => [data, ...prev]);
    setTitle("");
  } catch (err) {
    console.error(err);
    alert("Failed to create task");
  }
};

const handleToggleTask = async (task) => {
  const token = getToken();

  try {
    const data = await api.put(`/tasks/${task.id}`, {
  completed: !task.completed,
  });
    // ✅ update UI
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? data : t))
    );
  } catch (err) {
    console.error(err);
    alert("Failed to update task");
  }
};

const handleDeleteTask = async (taskId) => {
  const token = getToken();

  try {
    await api.delete(`/tasks/${taskId}`);
    // ✅ update UI
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  } catch (err) {
    console.error(err);
    alert("Failed to delete task");
  }
};
  return (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Tasks</h1>

    <TaskInput
      title={title}
      setTitle={setTitle}
      onAdd={handleCreateTask}
    />

    <TaskList
      tasks={tasks}
      onToggle={handleToggleTask}
      onDelete={handleDeleteTask}
    />
  </div>
);
}

