"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/apiClient";

export default function JournalPage() {
  const [entries, setEntries] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await api.get("/journal");
        setEntries(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load journal");
      }
    };

    fetchEntries();
  }, []);

  const handleCreate = async () => {
    if (!content) return;

    try {
      const data = await api.post("/journal", { content });

      setEntries((prev) => [data, ...prev]);
      setContent("");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Journal</h1>

      {/* Input */}
      <div className="mb-4 flex flex-col gap-2">
        <textarea
          placeholder="Write your thoughts..."
          className="border p-2"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          onClick={handleCreate}
          className="bg-black text-white p-2 w-fit"
        >
          Add Entry
        </button>
      </div>

      {/* Entries */}
      <div className="flex flex-col gap-3">
        {entries.map((entry) => (
          <div key={entry.id} className="border p-3 rounded">
            <p>{entry.content}</p>
            <span className="text-sm text-gray-500">
              {new Date(entry.created_at).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
