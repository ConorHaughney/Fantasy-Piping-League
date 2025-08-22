import React, { useState, useEffect, useRef } from 'react';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const didFetch = useRef(false); // Prevent double-fetch in Strict Mode

    useEffect(() => {
        if (didFetch.current) return;
        didFetch.current = true;
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:8080/api/admin/users', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                // Deduplicate users by id
                const uniqueUsers = Array.from(new Map(data.map(u => [u.id, u])).values());
                setUsers(uniqueUsers);
            } else if (response.status === 403) {
                setError('You are not authorized to view users.');
            } else {
                setError('Failed to fetch users.');
            }
        } catch (error) {
            setError('Error fetching users.');
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleUserStatus = async (userId) => {
        setError('');
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:8080/api/admin/users/${userId}/toggle-status`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                fetchUsers(); // Refresh the user list
            } else if (response.status === 403) {
                setError('You are not authorized to perform this action.');
            } else {
                setError('Failed to toggle user status.');
            }
        } catch (error) {
            setError('Error toggling user status.');
            console.error('Error toggling user status:', error);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading users...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">{error}</div>;
    }

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">User Management</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Username
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {user.username}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.enabled
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                        {user.enabled ? 'Active' : 'Disabled'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => toggleUserStatus(user.id)}
                                        className={`px-3 py-1 rounded text-xs font-semibold ${user.enabled
                                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                                : 'bg-green-600 hover:bg-green-700 text-white'
                                            }`}
                                    >
                                        {user.enabled ? 'Disable' : 'Enable'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}