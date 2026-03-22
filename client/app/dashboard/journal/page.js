"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/apiClient";
import JournalItem from "@/components/journal/JournalItem";

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

  const handleUpdate = (updatedEntry) => {
  setEntries((prev) =>
    prev.map((e) => (e.id === updatedEntry.id ? updatedEntry : e))
  );
};

const handleDelete = (id) => {
  setEntries((prev) => prev.filter((e) => e.id !== id));
};
  return (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Journal</h1>

    {/* Input */}
    <div className="mb-4 flex flex-col gap-2">
      <textarea
        placeholder="Write your thoughts..."
        className="bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        onClick={handleCreate}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
      >
        Add Entry
      </button>
    </div>

    {/* Entries */}
    <div className="flex flex-col gap-3">
      {entries.length === 0 ? (
        <p className="text-gray-400 text-center mt-4">
          No journal entries yet.
        </p>
      ) : (
        entries.map((entry) => (
          <JournalItem
            key={entry.id}
            entry={entry}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  </div>
);
}
