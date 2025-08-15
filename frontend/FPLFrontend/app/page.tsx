'use client';

import { useEffect, useState } from "react";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
      <div className="bg-[#393939] rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl text-center font-bold mb-4">
          Welcome to the Fantasy Piping League!
        </h2>
        <p className="text-center mb-6">
          This website is under construction. Please check back later for
          updates.
          <br />
          If this is your first time here, please{" "}
          <a href="/sign-up" className="hover:underline hover:text-[#888DA7]">
            sign up
          </a>{" "}
          or using the button below.
        </p>
        <div className="flex justify-center space-x-4">
          {loggedIn ? (
            <a
              href="/my-band"
              className="bg-[#FF8A00] text-white font-bold py-2 px-6 rounded hover:bg-[#E52E71] transition ease-in-out duration-300 w-40 text-center"
            >
              My Band
            </a>
          ) : (
            <a
              href="/login"
              className="bg-[#FF8A00] text-white font-bold py-2 px-6 rounded hover:bg-[#E52E71] transition ease-in-out duration-300 w-40 text-center"
            >
              Login
            </a>
          )}
          <a
            href="/how-to-play"
            className="bg-[#FF8A00] text-white font-bold py-2 px-6 rounded hover:bg-[#E52E71] transition ease-in-out duration-300 w-40 text-center"
          >
            How to Play
          </a>
        </div>
      </div>
    </div>
  );
}