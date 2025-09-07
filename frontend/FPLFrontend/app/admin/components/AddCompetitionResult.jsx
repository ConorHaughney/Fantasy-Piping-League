import React, { useState, useEffect, useRef } from "react";
import { getBandsFromCache, searchBands } from "../../components/bandDataManager";

const emptyResult = {
    bandId: "",
    bandName: "",
    pipingJudge1Score: "",
    pipingJudge2Score: "",
    drummingJudgeScore: "",
    ensambleJudgeScore: "",
    position: "",
    onEp: false,
};

const AddCompetitionWithResults = ({ onComplete }) => {
    const [competitionName, setCompetitionName] = useState("");
    const [competitionDate, setCompetitionDate] = useState("");
    const [location, setLocation] = useState("");
    const [majorMinor, setMajorMinor] = useState(false);
    const [results, setResults] = useState([{ ...emptyResult }]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [dropdownStyle, setDropdownStyle] = useState({ top: 0, left: 0, width: 0 });
    const inputRefs = useRef([]);

    // Initialize bands cache for admin if needed
    useEffect(() => {
        const initializeBandsForAdmin = async () => {
            const cachedBands = getBandsFromCache();
            if (cachedBands.length === 0) {
                try {
                    const token = localStorage.getItem("adminToken");
                    const response = await fetch('http://localhost:8080/api/fantasy-teams/test-bands', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.bands && data.bands.length > 0) {
                            localStorage.setItem('cached_bands', JSON.stringify(data.bands));
                            localStorage.setItem('bands_cache_expiry', Date.now().toString());
                        }
                    }
                } catch (error) {
                    console.error('Error fetching bands for admin:', error);
                }
            }
        };

        initializeBandsForAdmin();
    }, []);

    const handleResultChange = (idx, field, value) => {
        setResults(results =>
            results.map((row, i) =>
                i === idx ? { ...row, [field]: value || "" } : row
            )
        );
    };

    const handleBandNameChange = (idx, value) => {
        const bands = getBandsFromCache();
        const exactMatch = bands.find(band =>
            band.bands.toLowerCase() === value.toLowerCase()
        );

        setResults(results =>
            results.map((row, i) =>
                i === idx ? {
                    ...row,
                    bandName: value || "",
                    bandId: exactMatch ? exactMatch.id : ""
                } : row
            )
        );

        if (value.length >= 2) {
            setActiveDropdown(idx);
            const input = inputRefs.current[idx];
            if (input) {
                const rect = input.getBoundingClientRect();
                setDropdownStyle({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width,
                });
            }
        } else {
            setActiveDropdown(null);
        }
    };

    const handleBandNameFocus = (idx) => {
        if ((results[idx]?.bandName || "").length >= 2) {
            setActiveDropdown(idx);
            const input = inputRefs.current[idx];
            if (input) {
                const rect = input.getBoundingClientRect();
                setDropdownStyle({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width,
                });
            }
        }
    };

    const getBandSuggestions = (idx) => {
        const currentBandName = results[idx]?.bandName || "";
        if (currentBandName.length < 2 || activeDropdown !== idx) return [];
        return searchBands(currentBandName);
    };

    const selectBand = (idx, band) => {
        setResults(results =>
            results.map((row, i) =>
                i === idx ? {
                    ...row,
                    bandName: band.bands,
                    bandId: band.id
                } : row
            )
        );
        setActiveDropdown(null);
    };

    const addResultRow = () => setResults([...results, { ...emptyResult }]);
    const removeResultRow = idx => setResults(results => results.filter((_, i) => i !== idx));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");
        try {
            const token = localStorage.getItem("adminToken");
            const compRes = await fetch("http://localhost:8080/api/competitions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    competitionName,
                    competitionDate,
                    location,
                    majorMinor,
                }),
            });
            if (!compRes.ok) throw new Error("Failed to create competition");
            const compData = await compRes.json();
            const competitionId = compData.competitionId || compData.id;

            for (const row of results) {
                if (!row.bandId) continue;
                const resultRes = await fetch("http://localhost:8080/api/competition-results", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        competitionId,
                        bandId: row.bandId,
                        pipingJudge1Score: Number(row.pipingJudge1Score),
                        pipingJudge2Score: Number(row.pipingJudge2Score),
                        drummingJudgeScore: Number(row.drummingJudgeScore),
                        ensambleJudgeScore: Number(row.ensambleJudgeScore),
                        position: Number(row.position),
                        onEp: !!row.onEp,
                    }),
                });
                if (!resultRes.ok) throw new Error("Failed to add a result row");
            }

            setMessage("Competition and results added successfully!");
            setCompetitionName("");
            setCompetitionDate("");
            setLocation("");
            setMajorMinor(false);
            setResults([{ ...emptyResult }]);
            if (onComplete) onComplete();
        } catch (err) {
            setMessage(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDateChange = (e) => {
        const val = e.target.value || "";
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(val)) {
            const [dd, mm, yyyy] = val.split("/");
            setCompetitionDate(`${yyyy}-${mm}-${dd}`);
        } else {
            setCompetitionDate(val);
        }
    };

    // Render dropdown outside the table/grid
    const renderDropdown = () => {
        if (activeDropdown === null) return null;
        const suggestions = getBandSuggestions(activeDropdown);
        if (!suggestions.length) return null;
        return (
            <div
                style={{
                    position: "absolute",
                    top: dropdownStyle.top + 5, // 5px gap down
                    left: dropdownStyle.left,
                    width: dropdownStyle.width,
                    zIndex: 9999,
                    background: "white",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.375rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    maxHeight: "160px",
                    overflowY: "auto",
                    color: "black", // Make text black
                }}
            >
                {suggestions.map((band) => (
                    <div
                        key={band.id}
                        className="px-3 py-2 cursor-pointer hover:bg-blue-100 text-sm border-b border-gray-100 last:border-b-0"
                        onMouseDown={() => selectBand(activeDropdown, band)}
                        style={{ color: "black" }} // Ensure text is black in each item
                    >
                        {band.bands}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4 bg-white rounded shadow text-black">
                <h2 className="text-xl font-bold mb-4 text-center">Add Competition & Results</h2>
                {message && (
                    <div className={`mb-2 text-center ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
                        {message}
                    </div>
                )}
                <div className="mb-3 flex flex-wrap gap-4 justify-center">
                    <div className="flex-1 min-w-[200px] flex flex-col items-center">
                        <label className="block mb-1 font-medium text-center">Competition Name</label>
                        <input
                            type="text"
                            value={competitionName}
                            onChange={e => setCompetitionName(e.target.value || "")}
                            className="w-full border rounded px-2 py-1 text-black text-center"
                            required
                        />
                    </div>
                    <div className="flex-1 min-w-[200px] flex flex-col items-center">
                        <label className="block mb-1 font-medium text-center">Date</label>
                        <input
                            type="text"
                            value={competitionDate}
                            onChange={handleDateChange}
                            className="w-full border rounded px-2 py-1 text-black text-center"
                            placeholder="DD/MM/YYYY"
                            required
                        />
                    </div>
                    <div className="flex-1 min-w-[200px] flex flex-col items-center">
                        <label className="block mb-1 font-medium text-center">Location</label>
                        <input
                            type="text"
                            value={location}
                            onChange={e => setLocation(e.target.value || "")}
                            className="w-full border rounded px-2 py-1 text-black text-center"
                            required
                        />
                    </div>
                    <div className="flex items-center mt-6">
                        <input
                            type="checkbox"
                            checked={majorMinor}
                            onChange={e => setMajorMinor(e.target.checked)}
                            className="mr-2"
                            id="majorMinor"
                        />
                        <label htmlFor="majorMinor" className="font-medium">Major Competition</label>
                    </div>
                </div>
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Results</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border text-black">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 border">Band</th>
                                    <th className="p-2 border">Piping 1</th>
                                    <th className="p-2 border">Piping 2</th>
                                    <th className="p-2 border">Drumming</th>
                                    <th className="p-2 border">Ensemble</th>
                                    <th className="p-2 border">Position</th>
                                    <th className="p-2 border">On EP</th>
                                    <th className="p-2 border">Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((row, idx) => (
                                    <tr key={idx}>
                                        <td className="p-2 border relative">
                                            <input
                                                ref={el => inputRefs.current[idx] = el}
                                                type="text"
                                                value={row.bandName || ""}
                                                onChange={e => handleBandNameChange(idx, e.target.value)}
                                                onFocus={() => handleBandNameFocus(idx)}
                                                onBlur={() => setTimeout(() => setActiveDropdown(null), 150)}
                                                className="w-full border rounded px-2 py-1 text-black"
                                                placeholder="Type band name..."
                                                required
                                            />
                                        </td>
                                        <td className="p-2 border text-center">
                                            <input
                                                type="number"
                                                value={row.pipingJudge1Score || ""}
                                                onChange={e => handleResultChange(idx, "pipingJudge1Score", e.target.value)}
                                                className="w-16 border rounded px-1 py-1 text-black"
                                                min="1"
                                                required
                                            />
                                        </td>
                                        <td className="p-2 border text-center">
                                            <input
                                                type="number"
                                                value={row.pipingJudge2Score || ""}
                                                onChange={e => handleResultChange(idx, "pipingJudge2Score", e.target.value)}
                                                className="w-16 border rounded px-1 py-1 text-black"
                                                min="1"
                                                required
                                            />
                                        </td>
                                        <td className="p-2 border text-center">
                                            <input
                                                type="number"
                                                value={row.drummingJudgeScore || ""}
                                                onChange={e => handleResultChange(idx, "drummingJudgeScore", e.target.value)}
                                                className="w-16 border rounded px-1 py-1 text-black"
                                                min="1"
                                                required
                                            />
                                        </td>
                                        <td className="p-2 border text-center">
                                            <input
                                                type="number"
                                                value={row.ensambleJudgeScore || ""}
                                                onChange={e => handleResultChange(idx, "ensambleJudgeScore", e.target.value)}
                                                className="w-16 border rounded px-1 py-1 text-black"
                                                min="1"
                                                required
                                            />
                                        </td>
                                        <td className="p-2 border text-center">
                                            <input
                                                type="number"
                                                value={row.position || ""}
                                                onChange={e => handleResultChange(idx, "position", e.target.value)}
                                                className="w-16 border rounded px-1 py-1 text-black"
                                                min="1"
                                                required
                                            />
                                        </td>
                                        <td className="p-2 border text-center">
                                            <input
                                                type="checkbox"
                                                checked={!!row.onEp}
                                                onChange={e => handleResultChange(idx, "onEp", e.target.checked)}
                                            />
                                        </td>
                                        <td className="p-2 border">
                                            <button
                                                type="button"
                                                onClick={() => removeResultRow(idx)}
                                                disabled={results.length === 1}
                                                className={`px-2 py-1 rounded transition ${results.length === 1
                                                    ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                                                    : 'bg-red-500 hover:bg-red-700 text-white'
                                                    }`}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button
                        type="button"
                        onClick={addResultRow}
                        className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition"
                    >
                        Add Row
                    </button>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition"
                >
                    {isLoading ? "Submitting..." : "Submit Competition & Results"}
                </button>
            </form>
            {renderDropdown()}
        </>
    );
};

export default AddCompetitionWithResults;