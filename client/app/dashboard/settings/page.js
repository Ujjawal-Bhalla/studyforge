"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";
import { api } from "@/lib/apiClient";

export default function SettingsPage() {
  const router = useRouter();

  const [newName, setNewName] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleChangeName = async () => {
    if (!newName.trim()) {
      alert("Name required");
      return;
    }

    await api.put("/auth/name", { name: newName });

    alert("Name updated");

    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleResetPomodoro = async () => {
    if (!confirm("Clear all pomodoro history?")) return;

    await api.delete("/pomodoro/reset");

    alert("Pomodoro history cleared");
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure? This cannot be undone.")) return;

    await api.delete("/auth/delete");

    alert("Account deleted");

    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="max-w-md space-y-6">

      {/* Change Name */}
      <div className="p-4 border rounded-xl">
        <h2 className="font-semibold mb-2">Change Name</h2>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="New name"
        />
        <button
          onClick={handleChangeName}
          className="mt-2 px-4 py-2 border rounded"
        >
          Update
        </button>
      </div>

      {/* Reset Pomodoro */}
      <div className="p-4 border rounded-xl">
        <h2 className="font-semibold mb-2">Reset Pomodoro</h2>
        <button
          onClick={handleResetPomodoro}
          className="px-4 py-2 border rounded"
        >
          Clear History
        </button>
      </div>

      {/* Delete Account */}
      <div className="p-4 border rounded-xl">
        <h2 className="font-semibold mb-2 text-red-600">Danger Zone</h2>
        <button
          onClick={handleDeleteAccount}
          className="px-4 py-2 border rounded text-red-600"
        >
          Delete Account
        </button>
      </div>

    </div>
  );
}
