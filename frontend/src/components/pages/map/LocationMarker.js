// LocationMarker.js
import React from 'react';
import { Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const userLocationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMzYjgyZjYiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMyIgZmlsbD0id2hpdGUiLz4KPC9zdmc+',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

const LocationMarker = ({ userLocation, setUserLocation }) => {
  const map = useMap();

  useMapEvents({
    locationfound(e) {
      const { lat, lng } = e.latlng;
      const newLocation = {
        latitude: lat,
        longitude: lng,
        accuracy: e.accuracy,
        timestamp: new Date().toLocaleString('en-US')
      };
      setUserLocation(newLocation);
      map.flyTo(e.latlng, 15);
    },
    locationerror(e) {
      console.error('Location access denied:', e.message);
    }
  });

  return userLocation ? (
    <Marker 
      position={[userLocation.latitude, userLocation.longitude]} 
      icon={userLocationIcon}
    >
      <Popup>
        <div className="text-center">
          <h3 className="font-bold text-blue-600">Your Location</h3>
          <p className="text-sm text-gray-600">
            Lat: {userLocation.latitude.toFixed(6)}<br/>
            Lng: {userLocation.longitude.toFixed(6)}<br/>
            Accuracy: ±{Math.round(userLocation.accuracy)}m
          </p>
          <small className="text-xs text-gray-500">
            Detected: {userLocation.timestamp}
          </small>
        </div>
      </Popup>
    </Marker>
  ) : null;
};

export default LocationMarker;