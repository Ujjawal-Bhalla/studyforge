"use client";

import { useState } from "react";
import API_URL from "@/lib/api";
import { useRouter } from "next/navigation";
import { api } from "@/lib/apiClient";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const data = await api.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", data.token);

    router.push("/dashboard");

  } catch (err) {
    alert(err.message);
  }
};
  return (
    <div className="h-screen flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 p-6 border rounded w-80"
      >
        <h2 className="text-xl font-bold">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-black text-white p-2">Login</button>
        <p className="text-sm mt-2 text-gray-400">
  Don’t have an account?{" "}
  <span
    className="text-blue-400 cursor-pointer"
    onClick={() => router.push("/signup")}
  >
    Sign up
  </span>
  </p>
      </form>
    </div>
  );
}
