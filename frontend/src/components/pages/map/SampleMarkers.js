// SampleMarkers.js
import React from 'react';
import { Marker, Popup } from 'react-leaflet';

const SampleMarkers = () => {
  const sampleLocations = [
    {
      id: 1,
      position: [45.9432, 24.9668], // București
      title: "Illegal Deforestation",
      description: "Reported by community",
      type: "alert",
      timestamp: "2025-09-20 14:30"
    },
    {
      id: 2,
      position: [46.7712, 23.6236], // Cluj
      title: "Protected Area",
      description: "Active monitoring",
      type: "protected",
      timestamp: "2025-09-20 10:15"
    },
    {
      id: 3,
      position: [44.4268, 26.1025], // București Sud
      title: "Controlled Fire",
      description: "Investigation ongoing",
      type: "fire",
      timestamp: "2025-09-20 16:45"
    }
  ];

  return (
    <>
      {sampleLocations.map((location) => (
        <Marker key={location.id} position={location.position}>
          <Popup>
            <div className="min-w-[200px]">
              <h3 className="font-bold text-red-600 mb-2">{location.title}</h3>
              <p className="text-sm text-gray-700 mb-2">{location.description}</p>
              <div className="text-xs text-gray-500">
                <p>Type: {location.type}</p>
                <p>Time: {location.timestamp}</p>
              </div>
              <button className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                View Details
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default SampleMarkers;