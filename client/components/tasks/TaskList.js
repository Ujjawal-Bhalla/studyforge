"use client";

import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onToggle, onDelete }) {
  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
