"use client";

import { useState } from "react";
import { api } from "@/lib/apiClient";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [name, setName] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
  try {
    // 1. Signup
    await api.post("/auth/signup", {
      ...form,
      name,
    });

    // 2. Login properly
    const res = await api.post("/auth/login", form);

    localStorage.setItem("token", res.token);

    router.push("/dashboard");

  } catch (err) {
    alert(err.message);
  }
};

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-80">
        <h1 className="text-xl font-bold mb-4 text-white">Sign Up</h1>
        <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
        />
        <input
          name="email"
          placeholder="Email"
          className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
          onChange={handleChange}
        />

        <button
          onClick={handleSignup}
          className="w-full bg-blue-500 py-2 rounded text-white"
        >
          Sign Up
        </button>
        <p className="text-sm mt-3 text-gray-400 text-center">
  Already have an account?{" "}
  <span
    className="text-blue-400 cursor-pointer hover:underline"
    onClick={() => router.push("/login")}
  >
    Login
  </span>
</p>
      </div>
    </div>
  );
}
