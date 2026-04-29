const PEAK_HOUR_BARS = [
  { label: "Morning", value: 42 },
  { label: "Afternoon", value: 68 },
  { label: "Evening", value: 88 },
  { label: "Night", value: 54 },
];

export default function PeakHoursChart() {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Peak Study Hours</h2>
          <p className="text-sm text-gray-500">
            Visual preview of when focus tends to be strongest
          </p>
        </div>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
          Visual preview
        </span>
      </div>

      <div className="mt-6 flex h-56 items-end gap-4 rounded-2xl border bg-gray-50 px-4 py-5">
        {PEAK_HOUR_BARS.map((bar) => (
          <div key={bar.label} className="flex flex-1 flex-col items-center gap-3">
            <div className="flex h-40 w-full items-end rounded-xl bg-white p-2">
              <div
                className="w-full rounded-lg bg-gradient-to-t from-gray-900 via-gray-700 to-gray-400"
                style={{ height: `${bar.value}%` }}
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-800">{bar.label}</p>
              <p className="text-xs text-gray-500">{bar.value}% intensity</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
