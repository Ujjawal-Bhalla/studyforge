"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getToken } from "@/lib/auth";

export default function DashboardLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
     const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4 flex flex-col gap-4">
        <h2 className="text-xl font-bold mb-4">StudyForge</h2>

        <Link href="/dashboard">Home</Link>
        <Link href="/dashboard/tasks">Tasks</Link>
        <Link href="/dashboard/pomodoro">Pomodoro</Link>
        <Link href="/dashboard/journal">Journal</Link>
        <Link href="/dashboard/settings">Settings</Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
