"use client";

import BandPark from "../components/bandpark";
import AddBand from "../components/addBand";
import React, { useState } from "react";

export default function Page() {
  const [selectedShield, setSelectedShield] = useState(null);

  const handleShieldClick = (shieldType: React.SetStateAction<null>) => {
    setSelectedShield(shieldType);
  };

  const handleClosePanel = () => {
    setSelectedShield(null);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)] pt-1">
      {selectedShield && (
        <div className="bg-[#393939] rounded-lg shadow-lg p-8 max-w-md w-full mr-4 relative">
          <button
            onClick={handleClosePanel}
            className="absolute top-2 right-2 text-white hover:text-red-500 transition-colors duration-300 text-xl font-bold w-8 h-8 rounded-full hover:bg-red-500/20 flex items-center justify-center leading-none "
          >
            &times;
          </button>

          <h2 className="text-2xl text-center font-bold mb-4 text-white">{selectedShield}</h2>
          <div className="bg-[#222] rounded p-4 text-white text-center">
            <AddBand judgeType={selectedShield} />
          </div>
        </div>
      )}

      <div className="bg-[#393939] rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl text-center font-bold mb-4">My Band</h2>
        <div className="flex flex-col space-y-4">
          <div className="bg-[#222] rounded p-4 text-white text-center">
            <BandPark onShieldClick={handleShieldClick} />
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