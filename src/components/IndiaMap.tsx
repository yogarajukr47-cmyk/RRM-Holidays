'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ALL_STATES } from '@/lib/places-data';
import { PLACE_COORDINATES } from '@/lib/map-coordinates';
import 'leaflet/dist/leaflet.css';

/* ── Color scheme per state ── */
const STATE_COLORS: Record<string, string> = {
  karnataka: '#f59e0b',
  kerala: '#06b6d4',
  tamilnadu: '#a855f7',
  andhra: '#f97316',
  goa: '#ec4899',
};

const STATE_HOVER: Record<string, string> = {
  karnataka: '#fbbf24',
  kerala: '#22d3ee',
  tamilnadu: '#c084fc',
  andhra: '#fb923c',
  goa: '#f472b6',
};

/* ── Build markers data ── */
interface MarkerData {
  slug: string;
  name: string;
  state: string;
  stateSlug: string;
  category: string;
  emoji: string;
  img: string;
  lat: number;
  lng: number;
  color: string;
  hoverColor: string;
}

function buildMarkerData(): MarkerData[] {
  const markers: MarkerData[] = [];
  for (const state of ALL_STATES) {
    const sColor = STATE_COLORS[state.slug] || '#f59e0b';
    const sHover = STATE_HOVER[state.slug] || '#fbbf24';
    for (const place of state.places) {
      const coords = PLACE_COORDINATES[place.slug];
      if (!coords) continue;
      markers.push({
        slug: place.slug,
        name: place.name,
        state: state.name,
        stateSlug: state.slug,
        category: place.category,
        emoji: place.emoji,
        img: place.img || '/states/karnataka-cover.jpg',
        lat: coords.lat,
        lng: coords.lng,
        color: sColor,
        hoverColor: sHover,
      });
    }
  }
  return markers;
}

export default function IndiaMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedPlace, setSelectedPlace] = useState<MarkerData | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const leafletRef = useRef<any>(null);

  const allMarkers = useMemo(() => buildMarkerData(), []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  /* ── Initialize Leaflet map ── */
  useEffect(() => {
    if (!isClient || !containerRef.current || mapRef.current) return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;

      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const map = L.map(containerRef.current, {
        center: [13.5, 77.5],
        zoom: 7,
        minZoom: 6,
        maxZoom: 14,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true,
      });

      // Dark map tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      // Zoom control bottom-right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Attribution
      L.control.attribution({ position: 'bottomleft', prefix: false })
        .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright" style="color:#78716c">OSM</a> &copy; <a href="https://carto.com/" style="color:#78716c">CARTO</a>')
        .addTo(map);

      // Add markers
      const markerGroup: any[] = [];
      for (const m of allMarkers) {
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div class="marker-outer" style="--mc: ${m.color};" data-slug="${m.slug}">
            <div class="marker-inner">
              <span class="marker-emoji">${m.emoji}</span>
            </div>
            <div class="marker-ring"></div>
          </div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
          popupAnchor: [0, -20],
        });

        const marker = L.marker([m.lat, m.lng], { icon })
          .addTo(map)
          .on('click', () => {
            setSelectedPlace(m);
            map.flyTo([m.lat, m.lng], 10, { duration: 0.8 });
          })
          .on('mouseover', function () {
            this.getElement()?.querySelector('.marker-outer')?.classList.add('marker-hover');
          })
          .on('mouseout', function () {
            this.getElement()?.querySelector('.marker-outer')?.classList.remove('marker-hover');
          });

        markerGroup.push({ marker, data: m });
      }

      // Store references
      mapRef.current = { map, markerGroup, L };
      leafletRef.current = L;

      // Fit bounds to show all markers
      const bounds = L.latLngBounds(allMarkers.map(m => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [30, 30] });
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.map.remove();
        mapRef.current = null;
      }
    };
  }, [isClient, allMarkers]);

  /* ── Filter markers by state ── */
  useEffect(() => {
    if (!mapRef.current) return;
    const { map, markerGroup } = mapRef.current;

    for (const { marker, data } of markerGroup) {
      if (activeFilter === 'all' || data.stateSlug === activeFilter) {
        marker.addTo(map);
      } else {
        map.removeLayer(marker);
      }
    }

    // Refit bounds
    const visible = activeFilter === 'all'
      ? allMarkers
      : allMarkers.filter(m => m.stateSlug === activeFilter);

    if (visible.length > 0) {
      const bounds = leafletRef.current.latLngBounds(visible.map(m => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 9 });
    }
  }, [activeFilter, allMarkers]);

  /* ── Fullscreen toggle ── */
  useEffect(() => {
    if (!containerRef.current) return;
    if (isFullscreen) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, [isFullscreen]);

  const filteredCount = activeFilter === 'all'
    ? allMarkers.length
    : allMarkers.filter(m => m.stateSlug === activeFilter).length;

  if (!isClient) {
    return (
      <div className="w-full h-[500px] md:h-[600px] rounded-2xl bg-neutral-900/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-stone-500 text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeFilter === 'all'
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
              : 'bg-neutral-800/80 text-stone-400 hover:bg-neutral-700/80 hover:text-stone-200'
          }`}
        >
          All ({allMarkers.length})
        </button>
        {ALL_STATES.map(state => (
          <button
            key={state.slug}
            onClick={() => setActiveFilter(state.slug)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeFilter === state.slug
                ? 'text-black shadow-lg'
                : 'bg-neutral-800/80 text-stone-400 hover:bg-neutral-700/80 hover:text-stone-200'
            }`}
            style={activeFilter === state.slug ? {
              backgroundColor: STATE_COLORS[state.slug],
              boxShadow: `0 4px 14px ${STATE_COLORS[state.slug]}33`
            } : {}}
          >
            <span>{state.icon}</span>
            {state.name}
            <span className="opacity-70">({state.places.length})</span>
          </button>
        ))}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="ml-auto px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-800/80 text-stone-400 hover:bg-neutral-700/80 hover:text-stone-200 transition-all"
        >
          {isFullscreen ? '✕ Exit' : '⛶ Fullscreen'}
        </button>
      </div>

      {/* Map container */}
      <div
        ref={containerRef}
        className={`w-full rounded-2xl overflow-hidden border border-white/5 ${isFullscreen ? 'h-screen rounded-none border-0' : 'h-[500px] md:h-[600px]'}`}
        style={{ background: '#0a0a0a' }}
      />

      {/* Selected place panel */}
      {selectedPlace && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 glass rounded-xl overflow-hidden shadow-2xl shadow-black/40 animate-slide-up z-[1000]">
          <button
            onClick={() => setSelectedPlace(null)}
            className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-black/50 text-stone-300 hover:bg-black/80 hover:text-white flex items-center justify-center text-xs transition-all"
          >
            ✕
          </button>
          <div className="relative">
            {/* Photo */}
            <div className="h-32 overflow-hidden">
              <img
                src={selectedPlace.img}
                alt={selectedPlace.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              {/* State badge */}
              <div
                className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-black"
                style={{ backgroundColor: selectedPlace.color }}
              >
                {selectedPlace.state}
              </div>
            </div>
            {/* Info */}
            <div className="p-3">
              <div className="flex items-start gap-2">
                <span className="text-xl">{selectedPlace.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-stone-100 text-sm truncate">{selectedPlace.name}</h3>
                  <p className="text-[11px] text-stone-400 mt-0.5">{selectedPlace.category}</p>
                </div>
              </div>
              {/* CTA */}
              <a
                href={`/destinations/${selectedPlace.stateSlug}/${selectedPlace.slug}`}
                className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-bold text-black transition-all hover:brightness-110"
                style={{ backgroundColor: selectedPlace.color }}
              >
                Explore Destination →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3 text-[11px] text-stone-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Karnataka
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Kerala
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Tamil Nadu
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Andhra
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> Goa
        </span>
        <span className="text-stone-600">|</span>
        <span>Showing {filteredCount} places</span>
      </div>

      {/* Leaflet CSS overrides */}
      <style jsx global>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .marker-outer {
          position: relative;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .marker-outer:hover, .marker-outer.marker-hover {
          transform: scale(1.3);
          z-index: 1000 !important;
        }
        .marker-inner {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: var(--mc);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4), 0 0 12px var(--mc)44;
          border: 2px solid rgba(255,255,255,0.2);
          position: relative;
          z-index: 2;
        }
        .marker-emoji {
          font-size: 14px;
          line-height: 1;
        }
        .marker-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid var(--mc);
          opacity: 0;
          animation: marker-pulse 2.5s ease-out infinite;
        }
        @keyframes marker-pulse {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        /* Leaflet popup overrides for dark theme */
        .leaflet-container {
          background: #0a0a0a !important;
          font-family: inherit !important;
        }
        .leaflet-control-zoom a {
          background: #171717 !important;
          color: #d4d4d4 !important;
          border-color: #262626 !important;
        }
        .leaflet-control-zoom a:hover {
          background: #262626 !important;
        }
        .leaflet-control-attribution {
          background: rgba(10,10,10,0.7) !important;
          color: #78716c !important;
          font-size: 10px !important;
        }
        .leaflet-control-attribution a {
          color: #a8a29e !important;
        }
      `}</style>
    </div>
  );
}
