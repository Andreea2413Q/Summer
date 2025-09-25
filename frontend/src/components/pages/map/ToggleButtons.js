// ToggleButtons.js
import { useAuth } from '../../context/AuthContext'
import React from 'react';

const ToggleButtons = ({ 
  showLocationPanel, 
  setShowLocationPanel, 
  showAI, 
  setShowAI 
}) => {
    const { user, logout } = useAuth();

  return (
    <div className="absolute top-4 right-[50%] z-[1001] flex space-x-2">
      
      <button
        onClick={() => setShowLocationPanel(!showLocationPanel)}
        className="bg-white hover:bg-gray-100 border border-gray-300 rounded-lg p-2 shadow-lg transition-all duration-300 group"
        title={showLocationPanel ? "Hide Location Panel" : "Show Location Panel"}
      >
        <div className="flex items-center space-x-1">
          <span className="text-sm">📍</span>
          <span className={`text-xs font-medium transition-all duration-200 ${showLocationPanel ? 'text-blue-600' : 'text-gray-600'}`}>
            {showLocationPanel ? 'Hide' : 'Show'}
          </span>
        </div>
      </button>

      <button
        onClick={() => setShowAI(!showAI)}
        className="bg-white hover:bg-gray-100 border border-gray-300 rounded-lg p-2 shadow-lg transition-all duration-300 group"
        title={showAI ? "Hide AI Assistant" : "Show AI Assistant"}
      >
        <div className="flex items-center space-x-1">
          <span className="text-sm">🤖</span>
          <span className={`text-xs font-medium transition-all duration-200 ${showAI ? 'text-green-600' : 'text-gray-600'}`}>
            AI {showAI ? 'Hide' : 'Show'}
          </span>
        </div>
      </button>
      <button
   
        className="bg-white hover:bg-gray-100 border border-gray-300 rounded-lg p-2 shadow-lg transition-all duration-300 group"
        
      >Tester   Welcome, {user?.name}!</button>
    </div>
  );
};

export default ToggleButtons;