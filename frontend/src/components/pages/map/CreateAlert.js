// CreateAlert.js
import React, { useState, useEffect } from 'react';

const CreateAlert = ({ userLocation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({
    title: '',
    description: '',
    type: 'deforestation'
  });

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    console.log('=== Checking user status ===');
    
    try {
  const token = localStorage.getItem('token');
      console.log('Token found:', !!token);
      console.log('Token value:', token ? token.substring(0, 20) + '...' : 'null');
      
      if (!token) {
        console.log('No token found, user not logged in');
        setLoading(false);
        return;
      }

      console.log('Making request to profile endpoint...');
  const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Profile data received:', data);
        console.log('User role:', data.user?.role);
        
        setIsLoggedIn(true);
        setUserRole(data.user.role);
      } else {
        console.log('Profile request failed:', response.status);
        const errorText = await response.text();
        console.log('Error response:', errorText);
  localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error in checkUserStatus:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlert = async () => {
    if (!userLocation) {
      alert('Please detect your location first');
      return;
    }

    try {
  const token = localStorage.getItem('token');
      const alertPayload = {
        ...alertData,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        accuracy: userLocation.accuracy,
        timestamp: new Date().toISOString()
      };

  const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(alertPayload)
      });

      console.log('Alert creation response:', response.status);
      if (response.ok) {
        alert('Alert created successfully!');
        setShowAlert(false);
        setAlertData({ title: '', description: '', type: 'deforestation' });
      } else {
        const error = await response.json();
        console.log('Alert creation error:', error);
        alert(`Error: ${error.error || error.message}`);
      }
    } catch (error) {
      console.error('Error creating alert:', error);
      alert('Failed to create alert. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="mt-3 pt-2 border-t border-gray-200">
        <div className="flex items-center justify-center p-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          <span className="text-xs text-gray-600">Checking user status...</span>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="mt-3 pt-2 border-t border-gray-200">
        <h4 className="font-medium text-gray-700 text-sm mb-2">🚨 Create Alert</h4>
        <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
          <p className="text-xs text-yellow-800 mb-2">
            Please log in to create environmental alerts
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full bg-blue-600 text-white px-3 py-2 rounded-md text-xs hover:bg-blue-700 transition-colors"
          >
            Login to Create Alert
          </button>
        </div>
      </div>
    );
  }

  if (!['user', 'admin'].includes(userRole)) {
    return (
      <div className="mt-3 pt-2 border-t border-gray-200">
        <h4 className="font-medium text-gray-700 text-sm mb-2">🚨 Create Alert</h4>
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
          <p className="text-xs text-gray-600">
            Alert creation is available for registered users only
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='h-[200px] overflow-auto'>
    <div className="mt-3 pt-2 border-t border-gray-200">
      <h4 className="font-medium text-gray-700 text-sm mb-2">🚨 Create Alert</h4>
      
      {!showAlert ? (
        <div className="space-y-2">
          <div className="bg-green-50 p-2 rounded-md border border-green-200">
            <p className="text-xs text-green-800 mb-1">
              ✅ Logged in as user
            </p>
            <p className="text-xs text-green-700">
              Ready to report environmental issues
            </p>
          </div>
          
          <button
            onClick={() => setShowAlert(true)}
            disabled={!userLocation}
            className="w-full bg-red-600 text-white px-3 py-2 rounded-md text-xs hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {userLocation ? '🚨 Create New Alert' : '📍 Location Required'}
          </button>
          
          {!userLocation && (
            <p className="text-xs text-gray-500 mt-1">
              Please detect your location first
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Alert Type:
            </label>
            <select
              value={alertData.type}
              onChange={(e) => setAlertData({...alertData, type: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-red-500 focus:border-red-500"
            >
              <option value="deforestation">🌲 Illegal Deforestation</option>
              <option value="fire">🔥 Forest Fire</option>
              <option value="pollution">🏭 Environmental Pollution</option>
              <option value="wildlife">🦌 Wildlife Threat</option>
              <option value="other">⚠️ Other Environmental Issue</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Title:
            </label>
            <input
              type="text"
              value={alertData.title}
              onChange={(e) => setAlertData({...alertData, title: e.target.value})}
              placeholder="Brief description of the issue"
              className="w-full p-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-red-500 focus:border-red-500"
              maxLength="100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Description:
            </label>
            <textarea
              value={alertData.description}
              onChange={(e) => setAlertData({...alertData, description: e.target.value})}
              placeholder="Detailed description of what you observed"
              className="w-full p-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-red-500 focus:border-red-500 resize-none"
              rows="3"
              maxLength="500"
            />
          </div>

          {userLocation && (
            <div className="bg-blue-50 p-2 rounded-md border border-blue-200">
              <p className="text-xs text-blue-800 font-medium">Location:</p>
              <p className="text-xs text-blue-700">
                📍 {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}
              </p>
            </div>
          )}

          <div className="flex space-x-2">
            <button
              onClick={handleCreateAlert}
              disabled={!alertData.title.trim() || !alertData.description.trim()}
              className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md text-xs hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Submit Alert
            </button>
            <button
              onClick={() => setShowAlert(false)}
              className="flex-1 bg-gray-500 text-white px-3 py-2 rounded-md text-xs hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default CreateAlert;