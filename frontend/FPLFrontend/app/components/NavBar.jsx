"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedFirstName = localStorage.getItem("firstName");
    if (token && storedFirstName) {
      setIsLoggedIn(true);
      setFirstName(storedFirstName);
    } else {
      setIsLoggedIn(false);
      setFirstName("");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("firstName");
    setIsLoggedIn(false);
    setFirstName("");
    router.push("/");
  };

  const Links = [
    { href: "/", text: "Home" },
    { href: "/my-band", text: "My Band" },
    { href: "/leaderboard", text: "Leaderboard" },
    { href: "/how-to-play", text: "How to Play" },
  ];

  return (
    <nav className="bg-gray-800 py-2">
      <div className="flex justify-center space-x-6">
        {Links.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="text-white px-8 py-2 rounded hover:bg-gray-700 transition"
          >
            {link.text}
          </a>
        ))}
        {isLoggedIn ? (
          <>
            <span className="text-white px-8 py-2 rounded">Hi, {firstName}</span>
            <button
              onClick={handleLogout}
              className="text-white px-8 py-2 rounded hover:bg-gray-700 transition"
            >
              Log Out
            </button>
          </>
        ) : (
          <a
            href="/login"
            className="text-white px-8 py-2 rounded hover:bg-gray-700 transition"
          >
            Log In / Sign Up
          </a>
        )}
      </div>
    </nav>
  );
};

export default NavBar;