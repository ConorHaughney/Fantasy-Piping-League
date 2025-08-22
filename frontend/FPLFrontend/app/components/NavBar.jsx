"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Simple JWT decoder (does not verify signature)
function decodeJWT(token) {
    try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
    } catch {
        return {};
    }
}

const NavBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminUsername, setAdminUsername] = useState("");
    const router = useRouter();

    useEffect(() => {
        const adminToken = localStorage.getItem("adminToken");
        if (adminToken) {
            setIsLoggedIn(true);
            setIsAdmin(true);
            const payload = decodeJWT(adminToken);
            setAdminUsername(payload.sub || "Admin");
            return;
        }
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
            setIsAdmin(false);
            const storedFirstName = localStorage.getItem("firstName");
            setFirstName(storedFirstName || "User");
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("firstName");
        localStorage.removeItem("adminToken");
        setIsLoggedIn(false);
        setFirstName("");
        setIsAdmin(false);
        setAdminUsername("");
        router.push("/");
    };

    const Links = [
        { href: "/", text: "Home" },
        { href: "/my-band", text: "My Band" },
        { href: "/leaderboard", text: "Leaderboard" },
        { href: "/how-to-play", text: "How to Play" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 bg-[#393939] shadow-md border-b border-gray-600 z-50">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
                <div className="flex justify-between items-center h-12">
                    <div className="flex items-center h-full">
                        <Link
                            href="/"
                            className="text-lg font-bold text-white hover:text-[#FF8A00] transition-colors duration-200 flex items-center h-full"
                        >
                            Fantasy Piping League
                        </Link>
                    </div>

                    <div className="flex items-center space-x-6 h-full">
                        {Links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                className="text-gray-300 hover:text-[#FF8A00] px-2 py-1 text-sm font-medium transition-colors duration-200 relative group flex items-center h-full"
                            >
                                {link.text}
                                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#FF8A00] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                            </Link>
                        ))}

                        {/* Admin Link - only show if admin */}
                        {isAdmin && (
                            <Link
                                href="/admin/dashboard"
                                className="text-[#FF8A00] hover:text-white px-2 py-1 text-sm font-bold transition-colors duration-200 relative group flex items-center h-full"
                            >
                                Admin
                                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                            </Link>
                        )}

                        {/* User Section */}
                        {isLoggedIn ? (
                            <div className="flex items-center space-x-3 h-full">
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-[#FF8A00] rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-semibold">
                                            {isAdmin
                                                ? (adminUsername.charAt(0).toUpperCase() || "A")
                                                : (firstName.charAt(0).toUpperCase() || "U")}
                                        </span>
                                    </div>
                                    <span className="text-gray-300 text-sm font-medium">
                                        Hi, {isAdmin ? adminUsername : firstName || "User"}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-400 hover:text-[#E52E71] px-2 py-1 text-sm font-medium transition-colors duration-200 flex items-center"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3 h-full">
                                <Link
                                    href="/login"
                                    className="text-gray-300 hover:text-[#FF8A00] px-2 py-1 text-sm font-medium transition-colors duration-200 flex items-center"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/sign-up"
                                    className="bg-[#FF8A00] text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-[#E52E71] transition-colors duration-200 flex items-center"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;