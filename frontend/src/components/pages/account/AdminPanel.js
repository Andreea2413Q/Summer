// src/components/account/AdminPanel.js
import React from 'react';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Admin Functions</h3>
      </div>
      
      <div className="px-6 py-4 space-y-4">
        
        <Link
          to="/admin/dashboard"
          className="block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Admin Dashboard
        </Link>
        
        <Link
          to="/admin/users"
          className="block w-full bg-green-600 text-white text-center px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Manage Users
        </Link>
        
        <Link
          to="/admin/content"
          className="block w-full bg-purple-600 text-white text-center px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
        >
          Manage Content
        </Link>
        
        <Link
          to="/admin/reports"
          className="block w-full bg-yellow-600 text-white text-center px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors"
        >
          View Reports
        </Link>
      </div>
    </div>
  );
};

export default AdminPanel;