// public/script.js

// Initialize Leaflet map
const map = L.map('map').setView([51.5133, -0.1366], 15);

// Basemap layer (Carto Positron)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap &copy; CARTO'
}).addTo(map);

// Load and display only the first GeoJSON layer (houses)
fetch('data/snow1/deaths_nd_by_house.geojson')
  .then(res => res.json())
  .then(data => {
    const housesLayer = L.geoJSON(data, {
      pointToLayer: (feature, latlng) => {
        const deathCount = feature.properties.deaths;
        let radius;
        if (deathCount === 0) {
          radius = 2.5;
        } else if (deathCount > 1) {
          radius = 10;
        } else {
          radius = 7;
        }
        return L.circleMarker(latlng, {
          radius: radius,
          fillColor: deathCount > 0 ? '#d62728' : '#666666',
          color: '#000',
          weight: 1,
          fillOpacity: 0.7
        });
      }
    }).addTo(map);
    map.fitBounds(housesLayer.getBounds().pad(0.2));
  })
  .catch(err => console.error('Failed to load GeoJSON:', err));
