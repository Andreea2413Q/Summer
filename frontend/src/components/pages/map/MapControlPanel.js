// MapControlPanel.js
import React from 'react';
import CreateAlert from './CreateAlert';

const MapControlPanel = ({ 
  showLocationPanel, 
  setShowLocationPanel,
  mapLayer,
  setMapLayer,
  mapLayers,
  userLocation,
  isLoading,
  error,
  handleLocationRequest 
}) => {
  return (
    <div className={`absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-4 w-[1/5] h-[80%] overflow-auto transition-all duration-500 transform 
      ${showLocationPanel ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-4 scale-95 pointer-events-none'}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-800 text-sm">🛰️ Satellite Map Romania</h3>
        <button
          onClick={() => setShowLocationPanel(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Map Type:
        </label>
        <select
          value={mapLayer}
          onChange={(e) => setMapLayer(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {Object.entries(mapLayers).map(([key, layer]) => (
            <option key={key} value={key}>{layer.name}</option>
          ))}
        </select>
        {userLocation && (
          <p className="text-xs text-blue-600 mt-1">
            🔄 Location will auto-update when switching layers
          </p>
        )}
      </div>

      <button
        onClick={handleLocationRequest}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mb-3"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Locating...
          </>
        ) : (
          <>
            📍 Find My Location
          </>
        )}
      </button>

      {userLocation && (
        <div className="bg-green-50 p-3 rounded-md border border-green-200">
          <h4 className="font-medium text-green-800 text-sm">Location Detected:</h4>
          <p className="text-xs text-green-700 mt-1">
            📍 {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}<br/>
            🎯 Accuracy: ±{Math.round(userLocation.accuracy)}m<br/>
            🕐 {userLocation.timestamp}
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 p-3 rounded-md border border-red-200">
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-gray-200">
        <h4 className="font-medium text-gray-700 text-sm mb-2">Legend:</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span>Your Location</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span>Environmental Alerts</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Protected Areas</span>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-gray-200">
        <h4 className="font-medium text-gray-700 text-sm mb-1">Layer Info:</h4>
        <p className="text-xs text-gray-600">
          {mapLayers[mapLayer]?.name.length > 25 ? 
            mapLayers[mapLayer]?.name.substring(0, 22) + '...' : 
            mapLayers[mapLayer]?.name}<br/>
          Zoom: {mapLayers[mapLayer]?.maxZoom || 18}
        </p>
        {mapLayer.includes('sentinel') && (
          <div className="mt-1 p-2 bg-blue-50 rounded text-xs text-blue-700">
            ✨ ESA Sentinel-2: 10m resolution, 5-day updates
          </div>
        )}
        {mapLayer.includes('google') && (
          <div className="mt-1 p-2 bg-green-50 rounded text-xs text-green-700">
            🎯 Highest precision for Romania
          </div>
        )}
      </div>

      <CreateAlert userLocation={userLocation} />
    </div>
  );
};

export default MapControlPanel;