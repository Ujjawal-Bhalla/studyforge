export default function ProfileCard({ name }) {
  const initial = name?.[0]?.toUpperCase() || "U";

  return (
    <div className="rounded-2xl border bg-white p-5">
      <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
      <p className="text-sm text-gray-500">Your current dashboard identity</p>

      <div className="mt-6 flex items-center gap-4 rounded-2xl border bg-gray-50 p-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-lg font-semibold text-white">
          {initial}
        </div>
        <div>
          <p className="text-sm text-gray-500">Display name</p>
          <p className="text-lg font-medium text-gray-900">{name || "User"}</p>
        </div>
      </div>
    </div>
  );
}
