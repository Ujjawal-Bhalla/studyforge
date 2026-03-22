"use client";

import { useState } from "react";
import { api } from "@/lib/apiClient";

export default function JournalItem({ entry, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(entry.content);

  const handleUpdate = async () => {
    try {
      const updated = await api.put(`/journal/${entry.id}`, { content });

      onUpdate(updated); // update parent state
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await api.del(`/journal/${entry.id}`);
      onDelete(entry.id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow">
      {isEditing ? (
        <>
          <textarea
            className="w-full p-2 bg-gray-700 text-white rounded"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleUpdate}
              className="bg-green-500 px-3 py-1 text-white"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 px-3 py-1 text-white"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
          {entry.content}
          </p>
          <p className="text-xs text-gray-400 mt-2">
          {new Date(entry.created_at).toLocaleString([], {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
  })}
</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-blue-400 hover:underline"
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="text-sm text-red-400 hover:underline"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
