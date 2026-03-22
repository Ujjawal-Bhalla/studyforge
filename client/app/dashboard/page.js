"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API_URL from "@/lib/api";

export default function Dashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await fetch(`${API_URL}/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }

        setTasks(data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch tasks");
      }
    };

    fetchTasks();
  }, []);

const handleCreateTask = async () => {
  const token = localStorage.getItem("token");

  if (!title) {
    alert("Enter a task");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    // ✅ update UI instantly
    setTasks((prev) => [data, ...prev]);
    setTitle("");
  } catch (err) {
    console.error(err);
    alert("Failed to create task");
  }
};

const handleToggleTask = async (task) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${API_URL}/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ completed: !task.completed }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

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
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Delete failed");
    }

    // ✅ update UI
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  } catch (err) {
    console.error(err);
    alert("Failed to delete task");
  }
};
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="mb-4 flex gap-2">
      <input
      type="text"
      placeholder="New task"
      className="border p-2 flex-1"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      />

      <button
      onClick={handleCreateTask}
      className="bg-black text-white px-4"
      >
      Add
      </button>
      </div>
      <h2 className="text-xl mb-2">Your Tasks</h2>

      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <div
  key={task.id}
  className="border p-2 rounded flex justify-between items-center"
>
  <span
    onClick={() => handleToggleTask(task)}
    className={`cursor-pointer ${
      task.completed ? "line-through text-gray-500" : ""
    }`}
  >
    {task.title}
  </span>

  <button
    onClick={() => handleDeleteTask(task.id)}
    className="text-red-500"
  >
    Delete
  </button>
</div>
        ))}
      </div>
    </div>
  );
}
