"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login", { email, password });

      localStorage.setItem("token", response.data.token); // Save JWT token
      router.push("/my-band"); // Redirect to My Band page
    } catch (error) {
      // Handle login error (e.g., show an error message)
      console.error("Login failed:", error);
    }
  };

    // This function is now handled by the useState hook

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
      <div className="bg-[#393939] rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl text-center font-bold mb-4">Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 rounded bg-[#222] text-white focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 rounded bg-[#222] text-white focus:outline-none"
            required
          />
          <button
            type="submit"
            className="bg-[#FF8A00] text-white font-bold py-2 px-6 rounded hover:bg-[#E52E71] transition"
          >
            Login
          </button>
          <p className="text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <a href="/sign-up" className="text-[#FF8A00] hover:underline">
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}