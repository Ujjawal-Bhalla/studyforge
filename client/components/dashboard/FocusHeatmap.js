const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["M", "Tue", "W", "Thu", "F", "Sat", "Sun"];
const WEEKS = 53;

const getIntensityClass = (weekIndex, dayIndex) => {
  const level = (weekIndex * 3 + dayIndex * 2) % 5;

  if (level === 0) return "bg-gray-100";
  if (level === 1) return "bg-gray-200";
  if (level === 2) return "bg-gray-400";
  if (level === 3) return "bg-gray-600";
  return "bg-gray-900";
};

export default function FocusHeatmap() {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Focus Intensity Heatmap</h2>
          <p className="text-sm text-gray-500">
            Full-year visual placeholder for study consistency and deep-focus patterns
          </p>
        </div>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
          Visual preview
        </span>
      </div>

      <div className="mt-6 overflow-x-auto">
        <div className="min-w-[920px]">
          <div className="mb-3 grid grid-cols-[32px_repeat(53,minmax(0,1fr))] gap-1 text-xs text-gray-400">
            <div />
            {Array.from({ length: WEEKS }).map((_, index) => (
              <div key={`month-${index}`} className="text-center">
                {index % 4 === 0 ? MONTHS[Math.floor(index / 4)] || "" : ""}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[32px_1fr] gap-2">
            <div className="grid grid-rows-7 gap-1 text-xs text-gray-400">
              {DAYS.map((day) => (
                <div key={day} className="flex h-4 items-center">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-53 gap-1">
              {Array.from({ length: WEEKS }).map((_, weekIndex) => (
                <div key={`week-${weekIndex}`} className="grid grid-rows-7 gap-1">
                  {DAYS.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`h-4 w-4 rounded-[4px] ${getIntensityClass(weekIndex, dayIndex)}`}
                      title={`${day} / week ${weekIndex + 1}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 text-xs text-gray-500">
        <span>Less</span>
        <span className="h-3 w-3 rounded bg-gray-100" />
        <span className="h-3 w-3 rounded bg-gray-200" />
        <span className="h-3 w-3 rounded bg-gray-400" />
        <span className="h-3 w-3 rounded bg-gray-600" />
        <span className="h-3 w-3 rounded bg-gray-900" />
        <span>More</span>
      </div>
    </div>
  );
}
