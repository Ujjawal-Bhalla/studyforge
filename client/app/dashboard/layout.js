"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken, getUser } from "@/lib/auth";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    const u = getUser();
    setUser(u);
    setMounted(true);
  }, []);

  const navLinks = [
    { href: "/dashboard", label: "Home" },
    { href: "/dashboard/tasks", label: "Tasks" },
    { href: "/dashboard/pomodoro", label: "Pomodoro" },
    { href: "/dashboard/journal", label: "Journal" },
    { href: "/dashboard/settings", label: "Settings" },
  ];

  const handleLogout = () => {
  localStorage.removeItem("token");
  router.push("/login");
   };
  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <div className="w-64 border-r p-6 flex flex-col gap-6">
        <h2 className="text-xl font-bold">StudyForge</h2>

        <nav className="flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition
                  ${
                    isActive
                      ? "bg-gray-200 text-black"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main + Right Section */}
      <div className="flex-1 flex">

        {/* Main Content */}
        <div className="flex-1 flex flex-col">

          {/* Header */}
          <header className="h-16 border-b flex items-center justify-between px-6">
            <h1 className="text-lg font-semibold capitalize">
              {pathname.split("/").pop()}
            </h1>

            {/* User (hydration-safe) */}
            {mounted && (
  <div className="flex items-center gap-4 text-sm text-gray-600">

    {/* User */}
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
        {user?.name?.[0] || "U"}
      </div>
      <span>{user?.name || "User"}</span>
    </div>

    {/* Logout Button */}
    <button
      onClick={handleLogout}
      className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-100 transition"
    >
      Logout
    </button>

  </div>
)}
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 border-l hidden lg:block p-6">
          <p className="text-sm text-gray-500">Stats coming soon</p>
        </div>

      </div>
    </div>
  );
}