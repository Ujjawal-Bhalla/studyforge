export default function UpcomingTasksCard({ tasks }) {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
          <p className="text-sm text-gray-500">Pending work from your task list</p>
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
          {tasks.length} shown
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed p-4 text-sm text-gray-500">
            No pending tasks right now. You are all caught up.
          </div>
        ) : (
          tasks.map((task, index) => (
            <div
              key={task.id}
              className="flex items-start gap-3 rounded-xl border p-3"
            >
              <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs font-medium text-white">
                {index + 1}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-900">{task.title}</p>
                <p className="mt-1 text-sm text-gray-500">
                  Created {new Date(task.created_at).toLocaleDateString([], {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
