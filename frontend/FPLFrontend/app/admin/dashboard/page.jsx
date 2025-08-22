'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '../components/AdminNavbar';
import StatsCards from '../components/StatsCards';
import UserManagement from '../components/UserManagement';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('stats');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAdminAuth();
    }, []);

    const checkAdminAuth = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/admin/login');
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/api/admin/verify', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                router.push('/admin/login');
                return;
            }
            setLoading(false);
        } catch (error) {
            router.push('/admin/login');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminNavbar />

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

                <div className="bg-white rounded-lg shadow-md mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex">
                            <button
                                onClick={() => setActiveTab('stats')}
                                className={`py-2 px-4 border-b-2 font-medium text-sm ${activeTab === 'stats'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Statistics
                            </button>
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`py-2 px-4 border-b-2 font-medium text-sm ${activeTab === 'users'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                User Management
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'stats' && <StatsCards />}
                        {activeTab === 'users' && <UserManagement />}
                    </div>
                </div>
            </div>
        </div>
    );
}