"use client";

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div className="border p-2 rounded flex justify-between items-center">
      <span
        onClick={() => onToggle(task)}
        className={`cursor-pointer ${
          task.completed ? "line-through text-gray-500" : ""
        }`}
      >
        {task.title}
      </span>

      <button
        onClick={() => onDelete(task.id)}
        className="text-red-500"
      >
        Delete
      </button>
    </div>
  );
}
