'use client';

import { useEffect, useState } from "react";

export default function Page() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check for token in localStorage
    setLoggedIn(!!localStorage.getItem("token"));
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
      <div className="bg-[#393939] rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl text-center font-bold mb-4">How to Play</h2>
        <p className="text-left mb-6">
          <strong>Rules:</strong>
          <br />
          You will start with a budget of 100 points.
          <br />
          <br />
          You must select a team of 4 bands total:
          <br />
          &nbsp;&nbsp;- 2 bands for their piping scores,
          <br />
          &nbsp;&nbsp;- 1 band for their drumming score,
          <br />
          &nbsp;&nbsp;- 1 band for their ensemble score.
          <br />
          <br />
          <strong>Scoring:</strong>
          <br />
          Each band will be scored out of 100 points in total by combining the
          piping, drumming, and ensemble scores (50 / 25 / 25).
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
        </div>
      </div>
    </div>
  );
}