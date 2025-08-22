import React from 'react';
import { useRouter } from 'next/navigation';

export default function AdminNavbar() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:8080/api/admin/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Remove all tokens and user info
            localStorage.removeItem('adminToken');
            localStorage.removeItem('token');
            localStorage.removeItem('firstName');
            // Notify other tabs/components if needed
            window.dispatchEvent(new Event("authChanged"));
            // Force a full page refresh to clear all state
            window.location.href = '/admin/login';
        }
    };

    return (
        <nav className="bg-red-800 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold">FPL Admin Panel</h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}