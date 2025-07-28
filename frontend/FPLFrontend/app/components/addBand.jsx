import React, { useState } from "react";

const AddBand = ({ judgeType }) => {
  const [bandName, setBandName] = useState("");
  const [selectedBand, setSelectedBand] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  const mockBands = [
    { id: 1, name: "78th Fraser Highlanders", grade: "Grade 1" },
    { id: 2, name: "Simon Fraser University", grade: "Grade 1" },
    { id: 3, name: "Shotts and Dykehead", grade: "Grade 1" },
    { id: 4, name: "Field Marshal Montgomery", grade: "Grade 1" },
    { id: 5, name: "Inveraray & District", grade: "Grade 1" },
  ];

  const handleSearch = (searchTerm) => {
    setBandName(searchTerm);
    if (searchTerm.length > 1) {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        const filtered = mockBands.filter(band =>
          band.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(filtered);
        setIsLoading(false);
      }, 100);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectBand = (band) => {
    setSelectedBand(band);
    setBandName(band.name);
    setSearchResults([]);
  };

  const handleAddBand = () => {
    if (selectedBand) {
      // Handle adding band to the team
      console.log(`Adding ${selectedBand.name} as ${judgeType}`);
      alert(`${selectedBand.name} added as ${judgeType}!`);
      // Reset form
      setBandName("");
      setSelectedBand(null);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-white">
        Add Band for {judgeType}
      </h3>

      <div className="relative mb-4">
        <input
          type="text"
          value={bandName}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search for a band..."
          className="w-full px-4 py-2 rounded-lg bg-[#393939] text-white border border-gray-600 focus:border-[#FF8A00] focus:outline-none"
        />

        {isLoading && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#FF8A00]"></div>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-[#393939] border border-gray-600 rounded-lg shadow-lg max-h-40 overflow-y-auto">
            {searchResults.map((band) => (
              <div
                key={band.id}
                onClick={() => handleSelectBand(band)}
                className="px-4 py-2 hover:bg-[#555] cursor-pointer border-b border-gray-600 last:border-b-0"
              >
                <div className="text-white font-medium">{band.name}</div>
                <div className="text-gray-400 text-sm">{band.grade}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedBand && (
        <div className="mb-4 p-3 bg-[#555] rounded-lg">
          <div className="text-white font-medium">Selected:</div>
          <div className="text-[#FF8A00]">{selectedBand.name}</div>
          <div className="text-gray-400 text-sm">{selectedBand.grade}</div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleAddBand}
          disabled={!selectedBand}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
            selectedBand
              ? "bg-[#FF8A00] hover:bg-[#E52E71] text-white"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          Add Band
        </button>

        <button
          onClick={() => {
            setBandName("");
            setSelectedBand(null);
            setSearchResults([]);
          }}
          className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default AddBand;