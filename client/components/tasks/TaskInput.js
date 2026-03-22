"use client";

export default function TaskInput({ title, setTitle, onAdd }) {
  return (
    <div className="mb-4 flex gap-2">
      <input
        type="text"
        placeholder="New task"
        className="border p-2 flex-1"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button
        onClick={onAdd}
        className="bg-black text-white px-4"
      >
        Add
      </button>
    </div>
  );
}
