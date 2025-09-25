// src/pages/account/Account.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserProfile from './UserProfile';
import AdminPanel from './AdminPanel';
import UserAlerts from '../alert/UserAlerts';

const Account = () => {
  const { user, isAdmin, logout, login } = useAuth();
  const [adminPin, setAdminPin] = useState('');
  const [pinLoading, setPinLoading] = useState(false);
  const [pinMessage, setPinMessage] = useState('');

  const handleAdminUpgrade = async (e) => {
    e.preventDefault();
    if (!adminPin.trim()) {
      setPinMessage('Please enter the admin PIN');
      return;
    }

    setPinLoading(true);
    setPinMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/upgrade-to-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pin: adminPin })
      });

      const data = await response.json();

      if (response.ok) {
        // Update token and user data
        localStorage.setItem('token', data.access_token);
        // Force context refresh by calling login with new token
        await login(null, null, data.access_token);
        setPinMessage('✅ Successfully upgraded to admin!');
        setAdminPin('');
      } else {
        setPinMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      setPinMessage('❌ Failed to upgrade to admin');
    } finally {
      setPinLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                My Account
              </h1>
              <p className="mt-2 text-gray-600">
                Manage your profile and account settings
              </p>
              {isAdmin() && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Administrator
                  </span>
                </div>
              )}
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Admin PIN Upgrade Section (only for non-admins) */}
        {!isAdmin() && (
          <div className="mb-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                🔐 Upgrade to Administrator
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Have an admin PIN? Enter it below to upgrade your account to administrator privileges.
              </p>
              
              <form onSubmit={handleAdminUpgrade} className="flex gap-3 items-end">
                <div className="flex-1">
                  <label htmlFor="adminPin" className="block text-sm font-medium text-gray-700 mb-1">
                    Admin PIN Code
                  </label>
                  <input
                    type="password"
                    id="adminPin"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    placeholder="Enter admin PIN..."
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    disabled={pinLoading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={pinLoading || !adminPin.trim()}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {pinLoading ? 'Upgrading...' : 'Upgrade'}
                </button>
              </form>
              
              {pinMessage && (
                <div className={`mt-3 text-sm ${pinMessage.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                  {pinMessage}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* User Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            <UserProfile />
            <UserAlerts />
          </div>

          {/* Admin Panel (doar pentru admini) */}
          {isAdmin() && (
            <div className="lg:col-span-1">
              <AdminPanel />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;