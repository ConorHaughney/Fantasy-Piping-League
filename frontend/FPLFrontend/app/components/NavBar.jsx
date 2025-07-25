const Links = [
    { href: "/", text: "Home" },
    { href: "/my-band", text: "My Band" },
    { href: "/leaderboard", text: "Leaderboard" },
    { href: "/how-to-play", text: "How to Play" },
    { href: "/login", text: "Log In / Sign Up" },
]

import React from "react";

const NavBar = () => {
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
      </div>
    </nav>
  );
};

export default NavBar;
