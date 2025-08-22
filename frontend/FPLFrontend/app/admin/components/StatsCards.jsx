import React, { useState, useEffect } from 'react';

export default function StatsCards() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:8080/api/admin/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading statistics...</div>;
    }

    if (!stats) {
        return <div className="text-center py-8 text-red-600">Failed to load statistics</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Users</h3>
                <p className="text-3xl font-bold text-blue-900">{stats.totalUsers}</p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Active Users</h3>
                <p className="text-3xl font-bold text-green-900">{stats.activeUsers}</p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">Total Teams</h3>
                <p className="text-3xl font-bold text-purple-900">{stats.totalTeams}</p>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Total Bands</h3>
                <p className="text-3xl font-bold text-yellow-900">{stats.totalBands}</p>
            </div>
        </div>
    );
}