// UserAlerts.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const UserAlerts = () => {
  const { getAuthHeaders } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dismissingId, setDismissingId] = useState(null);

  useEffect(() => {
    fetchUserAlerts();
  }, []);

  const fetchUserAlerts = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/alerts/user', {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });

      const data = await response.json();

      if (response.ok) {
        setAlerts(data.alerts);
      } else {
        setError(data.error || 'Failed to fetch alerts');
      }
    } catch (error) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const dismissAlert = async (alertId) => {
    setDismissingId(alertId);
    
    try {
      const response = await fetch(`/api/alerts/${alertId}/dismiss`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });

      const data = await response.json();

      if (response.ok) {
        // Update the alert in the list
        setAlerts(alerts.map(alert => 
          alert.id === alertId 
            ? { ...alert, status: 'solved', updated_at: new Date().toISOString() }
            : alert
        ));
      } else {
        alert(`Failed to dismiss alert: ${data.error}`);
      }
    } catch (error) {
      alert('Failed to dismiss alert. Please try again.');
    } finally {
      setDismissingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', text: '⏳ Pending' },
      'investigating': { color: 'bg-blue-100 text-blue-800', text: '🔍 Investigating' },
      'resolved': { color: 'bg-green-100 text-green-800', text: '✅ Resolved' },
      'rejected': { color: 'bg-red-100 text-red-800', text: '❌ Rejected' },
      'solved': { color: 'bg-green-100 text-green-800', text: '✅ Solved' }
    };

    const config = statusConfig[status] || statusConfig['pending'];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
          <span className="text-gray-600">Loading your alerts...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center">
          <div className="text-red-600 mb-2">❌ Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchUserAlerts}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">My Alerts</h3>
        <button
          onClick={fetchUserAlerts}
          className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">📋</div>
          <p className="text-gray-600">You haven't created any alerts yet.</p>
          <p className="text-sm text-gray-500 mt-1">
            Use the map to create alerts about environmental issues.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{alert.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>📍 {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}</span>
                    <span>📅 {formatDate(alert.created_at)}</span>
                    <span className="capitalize">🏷️ {alert.type}</span>
                  </div>
                </div>
                <div className="ml-4 flex flex-col items-end space-y-2">
                  {getStatusBadge(alert.status)}
                  {alert.status !== 'solved' && alert.status !== 'resolved' && (
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      disabled={dismissingId === alert.id}
                      className="px-3 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {dismissingId === alert.id ? 'Dismissing...' : '✅ Mark Solved'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserAlerts;