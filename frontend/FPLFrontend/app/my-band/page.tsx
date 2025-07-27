import BandPark from "../components/bandpark";
import React from "react";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
      <div className="bg-[#393939] rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl text-center font-bold mb-4">My Band</h2>
        <div className="flex flex-col space-y-4">
          <div className="bg-[#222] rounded p-4 text-white text-center">
            <BandPark />
          </div>
          <a
            href="/how-to-play"
            className="bg-[#FF8A00] text-white font-bold py-2 px-6 rounded hover:bg-[#E52E71] transition w-40 text-center mx-auto"
          >
            How to Play
          </a>
        </div>
      </div>
    </div>
  );
}
