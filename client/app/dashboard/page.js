"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API_URL from "@/lib/api";
import TaskInput from "@/components/tasks/TaskInput";
import TaskList from "@/components/tasks/TaskList";

export default function DashboardHome() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard Home</h1>
    </div>
  );
}
