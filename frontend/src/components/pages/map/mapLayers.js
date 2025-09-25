// mapLayers.js
export const mapLayers = {
  googleSat: {
    url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    attribution: '© Google',
    name: 'Google Satellite (Recommended)',
    maxZoom: 20
  },
  googleHybrid: {
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    attribution: '© Google',
    name: 'Google Hybrid (with labels)',
    maxZoom: 20
  },
  sentinel: {
    url: 'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg',
    attribution: '© ESA Sentinel-2, EOX',
    name: 'Sentinel-2 Cloudless (ESA)',
    maxZoom: 18
  },
  sentinelRecent: {
    url: 'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2021_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg',
    attribution: '© ESA Sentinel-2 2021, EOX',
    name: 'Sentinel-2 Recent (2021)',
    maxZoom: 18
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Esri, Maxar, Earthstar Geographics',
    name: 'Esri World Imagery',
    maxZoom: 18
  },
  usgs: {
    url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}',
    attribution: '© USGS, NASA',
    name: 'USGS/NASA Imagery',
    maxZoom: 16
  },
  osm: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
    name: 'OpenStreetMap',
    maxZoom: 19
  },
  topo: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Esri',
    name: 'Topographic Map',
    maxZoom: 18
  },
  dark: {
    url: 'https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
    attribution: '© CartoDB',
    name: 'Dark Theme',
    maxZoom: 18
  }
};