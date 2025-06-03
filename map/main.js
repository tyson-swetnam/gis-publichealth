/* global L, fetch */
/**
 * Leaflet scroll-driven story map of John Snow cholera datasets
 * Author: Cline (2025)
 */
(async function () {
  // --------------------------------------------------------------------- Map
  const map = L.map('map').setView([51.5145, -0.136], 16); // central Soho
  // Soft-contrast grayscale basemap
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors, &copy; CARTO'
  }).addTo(map);

  // --------------------------------------------------------- Colour helpers
  function rampYlOrRd(v, br = [1, 5, 10, 20, 40]) {
    return v > br[4] ? '#800026' :
           v > br[3] ? '#BD0026' :
           v > br[2] ? '#E31A1C' :
           v > br[1] ? '#FC4E2A' :
           v > br[0] ? '#FD8D3C' : '#FEB24C';
  }

  function rampPuBuGn(v, br = [5, 10, 20, 40, 60]) {
    return v > br[4] ? '#014636' :
           v > br[3] ? '#016c59' :
           v > br[2] ? '#02818a' :
           v > br[1] ? '#3690c0' :
           v > br[0] ? '#67a9cf' : '#a6bddb';
  }

  // ------------------------------------------------------------ Factories
  const factories = {
    deaths_nd_by_house: gj => L.geoJSON(gj, {
      /* Colour houses with ≥1 death in red, 0-death houses grey */
      pointToLayer: (f, ll) => {
        const d = f.properties.deaths;
        const colour = d > 0 ? '#bd0026' : '#888';
        return L.circleMarker(ll, {
          radius: Math.sqrt(d || 1) + 2,
          color: colour,
          fillColor: colour,
          weight: 0.5,
          fillOpacity: 0.7
        });
      }
    }),

    deaths_by_bldg: gj => L.geoJSON(gj, {
      /* Amplify size range and grey-out zero-death buildings */
      pointToLayer: (f, ll) => {
        const d = f.properties.deaths;
        const colour = d > 0 ? '#e31a1c' : '#888';
        return L.circleMarker(ll, {
          radius: Math.sqrt(d || 1) * 4 + 2, // stronger size scaling
          color: colour,
          fillColor: colour,
          weight: 0.5,
          fillOpacity: 0.7
        });
      }
    }),

    deaths_by_block: gj => L.geoJSON(gj, {
      /* Breaks tailored to 0 – 0.069 death-density range and inline numeric labels */
      style: f => ({
        fillColor: rampYlOrRd(f.properties.deathdens, [0.005, 0.015, 0.03, 0.05, 0.07]),
        weight: 1,
        color: '#666',
        fillOpacity: 0.6
      }),
      onEachFeature: (f, layer) => {
        // show a tiny permanent tooltip with deaths count at block centroid
        const deaths = f.properties.deaths;
        if (deaths !== undefined) {
          layer.bindTooltip(String(deaths), {
            permanent: true,
            direction: 'center',
            className: 'block-label'
          });
        }
      }
    }),

    deaths_by_bsrings: gj => L.geoJSON(gj, {
      /* deathdens ranges up to ~0.02 → use finer low-value breaks */
      style: f => ({
        fillColor: rampYlOrRd(f.properties.deathdens, [0.001, 0.005, 0.0075, 0.01]),
        weight: 0,
        fillOpacity: 0.6
      })
    }),

    deaths_by_8rings: gj => L.geoJSON(gj, {
      style: f => ({
        fillColor: rampYlOrRd(f.properties.deaths, [1, 3, 5, 10, 20]),
        weight: 0,
        fillOpacity: 0.6
      })
    }),

    pumps: gj => L.geoJSON(gj, {
      pointToLayer: (f, ll) => L.circleMarker(ll, {
        radius: 5,
        color: '#3182bd',
        weight: 1,
        fillColor: '#6baed6',
        fillOpacity: 1
      }).bindTooltip(f.properties.name || 'Pump')
    }),

    sewergrates_ventilators: gj => L.geoJSON(gj, {
      pointToLayer: (f, ll) => L.circleMarker(ll, {
        radius: 3,
        color: (f.properties.ventilator === 1 || f.properties.ventilator === '1')
          ? '#ff7f00' : '#31a354',
        weight: 0,
        fillOpacity: 0.8
      })
    }),

    subdistricts: gj => L.geoJSON(gj, {
      /* Use same YlOrRd palette as other density layers and add click pop-ups */
      style: f => ({
        fillColor: rampYlOrRd(f.properties.rate1854, [10, 20, 30, 40, 60]),
        weight: 1,
        color: '#555',
        fillOpacity: 0.6
      }),
      onEachFeature: (f, layer) => {
        const p = f.properties;
        const html = `
          <strong>${p.name || p.Subdist || 'Subdistrict'}</strong><br/>
          Deaths 1854: ${p.deaths ?? p.Deaths ?? 'n/a'}<br/>
          Pop 1851: ${p.pop1851 ?? p.Pop1851 ?? 'n/a'}<br/>
          Death rate per 10 000: ${p.rate1854}
        `;
        layer.bindPopup(html);
      }
    })
  };

  // ---------------------------------------------------- Dataset meta list
  const datasets = [
    { id: 'deaths_nd_by_house', file: 'deaths_nd_by_house.geojson', zoom: 17 },
    { id: 'deaths_by_bldg', file: 'deaths_by_bldg.geojson', zoom: 17 },
    { id: 'deaths_by_block', file: 'deaths_by_block.geojson', zoom: 16 },
    { id: 'deaths_by_bsrings', file: 'deaths_by_bsrings.geojson', zoom: 16 },
    { id: 'deaths_by_8rings', file: 'deaths_by_8rings.geojson', zoom: 16 },
    { id: 'pumps', file: 'pumps.geojson', zoom: 17 },
    { id: 'sewergrates_ventilators', file: 'sewergrates_ventilators.geojson', zoom: 17 },
    { id: 'subdistricts', file: 'subdistricts.geojson', zoom: 12 }
  ];

  // ---------------------------------------------- Load all GeoJSON layers
  const layers = {};
  await Promise.all(datasets.map(async d => {
    const res = await fetch(d.file);
    const gj = await res.json();
    layers[d.id] = factories[d.id](gj);
  }));

  // ---------------------------------------------------------- Scroll logic
  let currentLayer = null;
  const steps = document.querySelectorAll('.step');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id.replace('chapter-', '');
        showLayer(id);
      }
    });
  }, { root: document.querySelector('#story'), threshold: 0.5 });

  steps.forEach(s => observer.observe(s));

  function showLayer(id) {
    if (currentLayer) {
      map.removeLayer(currentLayer);
    }
    const lyr = layers[id];
    if (!lyr) return;
    lyr.addTo(map);
    currentLayer = lyr;
    // Zoom to layer bounds where sensible
    try {
      map.fitBounds(lyr.getBounds(), { maxZoom: datasets.find(d => d.id === id).zoom });
    } catch (e) {
      /* layer may be point-only; ignore */
    }
  }

  // Kick-start with first chapter
  showLayer(datasets[0].id);
})();
