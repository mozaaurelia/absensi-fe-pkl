"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  latitude: number;
  longitude: number;
  radiusMeters: number;
  onMove: (lat: number, lng: number) => void;
}

interface SearchResult {
  lat: string;
  lon: string;
  display_name: string;
}

const PIN_ICON = L.divIcon({
  className: "",
  html: `<svg width="26" height="38" viewBox="0 0 26 38" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 3px 4px rgba(0,0,0,0.3))">
    <path d="M13 0C5.8 0 0 5.8 0 13c0 9.8 13 25 13 25s13-15.2 13-25C26 5.8 20.2 0 13 0z" fill="#DC2626"/>
    <circle cx="13" cy="13" r="5.5" fill="#fff"/>
  </svg>`,
  iconSize: [26, 38],
  iconAnchor: [13, 38],
});

export default function LocationMap({ latitude, longitude, radiusMeters, onMove }: Props) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = L.map(containerRef.current, {
      center: [latitude, longitude],
      zoom: 15,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker([latitude, longitude], {
      icon: PIN_ICON,
      draggable: true,
    }).addTo(map);

    const circle = L.circle([latitude, longitude], {
      radius: radiusMeters,
      color: "#A855F7",
      weight: 2,
      fillColor: "#A855F7",
      fillOpacity: 0.15,
    }).addTo(map);

    const update = (lat: number, lng: number) => {
      marker.setLatLng([lat, lng]);
      circle.setLatLng([lat, lng]);
      onMove(lat, lng);
    };

    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      update(pos.lat, pos.lng);
    });

    map.on("click", (e: L.LeafletMouseEvent) => {
      update(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current = map;
    markerRef.current = marker;
    circleRef.current = circle;

    const timer = setTimeout(() => map.invalidateSize(), 250);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      circleRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    markerRef.current?.setLatLng([latitude, longitude]);
    circleRef.current?.setLatLng([latitude, longitude]);
  }, [latitude, longitude]);

  useEffect(() => {
    circleRef.current?.setRadius(radiusMeters);
  }, [radiusMeters]);

  const runSearch = (value: string) => {
    const q = value.trim();
    if (!q) {
      setResults([]);
      return;
    }
    setSearching(true);
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(q)}`
    )
      .then((r) => r.json())
      .then((data: SearchResult[]) => setResults(Array.isArray(data) ? data : []))
      .catch(() => setResults([]))
      .finally(() => setSearching(false));
  };

  const selectResult = (res: SearchResult) => {
    const lat = parseFloat(res.lat);
    const lng = parseFloat(res.lon);
    mapRef.current?.flyTo([lat, lng], 16);
    markerRef.current?.setLatLng([lat, lng]);
    circleRef.current?.setLatLng([lat, lng]);
    onMove(lat, lng);
    setQuery("");
    setResults([]);
  };

  return (
    <div className="relative">
      <div className="absolute top-3 left-3 right-3 z-[1200]">
        <div className="flex items-center gap-2 bg-white rounded-lg shadow-md px-3 py-2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="shrink-0 text-gray-400">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (debounceRef.current) clearTimeout(debounceRef.current);
              debounceRef.current = setTimeout(() => runSearch(e.target.value), 600);
            }}
            placeholder={t("locationModal.searchPlaceholder")}
            className="flex-1 text-sm text-gray-700 outline-none placeholder:text-gray-400 bg-transparent"
          />
          {searching && (
            <span className="w-3.5 h-3.5 border-2 border-gray-300 border-t-[#1E3A5F] rounded-full animate-spin shrink-0" />
          )}
        </div>
        <p className="text-[10px] text-gray-400 mt-1 ml-1">{t("locationModal.searchHint")}</p>
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg mt-1 overflow-hidden max-h-44 overflow-y-auto">
            {results.map((res, i) => (
              <button
                key={i}
                onClick={() => selectResult(res)}
                className="block w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0"
              >
                {res.display_name}
              </button>
            ))}
          </div>
        )}
      </div>
      <div ref={containerRef} className="w-full h-72 rounded-xl overflow-hidden bg-gray-100" />
    </div>
  );
}
