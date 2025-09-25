// SatelliteMap.js
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import AI from '../../AI/components/ai';
import LocationMarker from './LocationMarker';
import SampleMarkers from './SampleMarkers';
import MapControlPanel from './MapControlPanel';
import ToggleButtons from './ToggleButtons';
import { mapLayers } from './mapLayers';

// Fix pentru iconițele Leaflet în React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const SatelliteMap = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [mapLayer, setMapLayer] = useState('googleSat');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAI, setShowAI] = useState(true);
  const [showLocationPanel, setShowLocationPanel] = useState(true);
  const mapRef = useRef();

  const romaniaCenter = [45.9432, 24.9668];

  const handleLocationRequest = () => {
    if (!mapRef.current) return;
    
    setIsLoading(true);
    setError('');
    
    const map = mapRef.current;
    
    map.locate({
      setView: true,
      maxZoom: 15,
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    });
    
    setTimeout(() => setIsLoading(false), 3000);
  };

  const handleLayerChange = (newLayer) => {
    setMapLayer(newLayer);
    if (userLocation) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  useEffect(() => {
    if (userLocation && mapRef.current) {
      setTimeout(() => {
        handleLocationRequest();
      }, 500);
    }
  }, [mapLayer]);

  // UseEffect pentru redimensionarea hărții când se schimbă showAI, cu o animație lină
  useEffect(() => {
    if (mapRef.current) {
      const t = setTimeout(() => {
        const map = mapRef.current;
        map.invalidateSize();
      }, 500);
      return () => clearTimeout(t);
    }
  }, [showAI]);

  return (
    <div className='w-full flex h-screen relative'>
      <ToggleButtons 
        showLocationPanel={showLocationPanel}
        setShowLocationPanel={setShowLocationPanel}
        showAI={showAI}
        setShowAI={setShowAI}
      />

      <div className={`h-screen relative transition-[width] duration-500 ease-in-out ${
        showAI ? 'w-2/3' : 'w-full'
      }`}>
        
        <MapControlPanel 
          showLocationPanel={showLocationPanel}
          setShowLocationPanel={setShowLocationPanel}
          mapLayer={mapLayer}
          setMapLayer={handleLayerChange}
          mapLayers={mapLayers}
          userLocation={userLocation}
          isLoading={isLoading}
          error={error}
          handleLocationRequest={handleLocationRequest}
        />

        <MapContainer
          center={romaniaCenter}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
          zoomControl={false}
        >
          <TileLayer
            url={mapLayers[mapLayer].url}
            attribution={mapLayers[mapLayer].attribution}
            maxZoom={mapLayers[mapLayer].maxZoom || 18}
          />
          
          <LocationMarker 
            userLocation={userLocation} 
            setUserLocation={setUserLocation} 
          />
          
          <SampleMarkers />
        </MapContainer>

        <div className="absolute bottom-4 right-4 z-[1000] flex flex-col space-y-2">
          <button
            onClick={() => mapRef.current?.zoomIn()}
            className="bg-white hover:bg-gray-100 border border-gray-300 rounded-md p-2 shadow-lg transition-colors"
          >
            <span className="text-lg font-bold">+</span>
          </button>
          <button
            onClick={() => mapRef.current?.zoomOut()}
            className="bg-white hover:bg-gray-100 border border-gray-300 rounded-md p-2 shadow-lg transition-colors"
          >
            <span className="text-lg font-bold">−</span>
          </button>
        </div>

        <div className="absolute bottom-4 left-4 z-[1000] bg-black/75 text-white text-xs p-2 rounded-md max-w-xs">
          Click "Find My Location" to detect your position. Change map type from control panel. Sentinel-2 provides the most recent satellite imagery.
        </div>
      </div>
      
      <div className={`h-screen overflow-y-auto border-l-2 border-black transition-transform duration-500 ease-in-out 
        ${showAI ? 'w-2/6 translate-x-0' : 'w-0 -translate-x-4'} `} style={{willChange:'transform,width'}}>
        {showAI && <AI userLocation={userLocation} />}
      </div>
    </div>
  );
};

export default SatelliteMap;