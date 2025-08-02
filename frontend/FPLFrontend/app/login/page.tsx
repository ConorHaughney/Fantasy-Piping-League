"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8080';

export default function Page() {
  const [username, setUsername] = useState("");  // Change from email to username
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const loginResponse = await axios.post("/auth/login", { username, password });  // Send username instead of email

      localStorage.setItem("token", loginResponse.data.token);

      const userResponse = await axios.get("/users/me", {
        headers: {
          Authorization: `Bearer ${loginResponse.data.token}`,
        },
      });

      const firstName = userResponse.data.firstName ||
                       userResponse.data.first_name ||
                       userResponse.data.name ||
                       "User123";

      localStorage.setItem("firstName", firstName);

      // Force a page refresh to update NavBar
      window.location.href = "/my-band";
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials and verify your account if needed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
      <div className="bg-[#393939] rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl text-center font-bold mb-4">Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          <input
            type="text"  // Change from email to text
            placeholder="Username"  // Change placeholder
            value={username}  // Change value
            onChange={(e) => setUsername(e.target.value)}  // Change handler
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