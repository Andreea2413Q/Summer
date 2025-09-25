import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, logout, getAuthHeaders } = useAuth();
  const [users, setUsers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    try {
      setError('');
      const res = await fetch('/api/admin/users', { headers: { 'Content-Type': 'application/json', ...getAuthHeaders() } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load users');
      setUsers(data.users || []);
    } catch (e) {
      setError(e.message);
    }
  };

  const fetchAlerts = async () => {
    try {
      setError('');
      const res = await fetch('/api/admin/alerts', { headers: { 'Content-Type': 'application/json', ...getAuthHeaders() } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load alerts');
      setAlerts(data.alerts || []);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchAlerts()]);
      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateAlertStatus = async (alertId, status) => {
    try {
      setUpdatingId(alertId);
      const res = await fetch(`/api/alerts/${alertId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update alert');
      // refresh list
      await fetchAlerts();
    } catch (e) {
      setError(e.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-2 text-gray-600">Welcome, {user?.name}!</p>
              <p className="text-sm text-blue-600">You have admin privileges</p>
            </div>
            <div className="space-x-2">
              <button 
                onClick={() => { fetchUsers(); fetchAlerts(); }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Refresh
              </button>
              <button 
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
          )}

          {loading ? (
            <div className="mt-8 text-gray-600">Loading data...</div>
          ) : (
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Users table */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-semibold mb-4">Users</h2>
                <div className="overflow-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map(u => (
                        <tr key={u.id}>
                          <td className="px-3 py-2 text-sm text-gray-900">{u.name}</td>
                          <td className="px-3 py-2 text-sm text-gray-500">{u.email}</td>
                          <td className="px-3 py-2 text-sm"><span className={`px-2 py-1 rounded text-white ${u.role === 'admin' ? 'bg-blue-600' : 'bg-gray-600'}`}>{u.role}</span></td>
                          <td className="px-3 py-2 text-sm text-gray-500">{u.created_at ? new Date(u.created_at).toLocaleString() : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Alerts table */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-semibold mb-4">Alerts</h2>
                <div className="overflow-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {alerts.map(a => (
                        <tr key={a.id}>
                          <td className="px-3 py-2 text-sm text-gray-900">{a.title}</td>
                          <td className="px-3 py-2 text-sm text-gray-500">{a.type}</td>
                          <td className="px-3 py-2 text-sm">
                            <span className="px-2 py-1 rounded bg-gray-200 text-gray-800">{a.status}</span>
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-500">{a.user_id}</td>
                          <td className="px-3 py-2 text-sm text-gray-500">{a.created_at ? new Date(a.created_at).toLocaleString() : '-'}</td>
                          <td className="px-3 py-2 text-sm space-x-2">
                            {['pending','investigating','resolved','rejected'].map(s => (
                              <button
                                key={s}
                                onClick={() => updateAlertStatus(a.id, s)}
                                disabled={updatingId === a.id}
                                className={`px-2 py-1 rounded border text-xs ${a.status === s ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                              >
                                {s}
                              </button>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;