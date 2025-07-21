import type { Place } from "../api/Place";
import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix for default markers in Leaflet with Vite
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface MapProps {
  place: Place | null;
}

export default function Map({ place }: MapProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mapRef.current && place) {
      setIsLoading(true);
      mapRef.current.flyTo([place.latitude, place.longitude], 12, {
        duration: 1.5,
      });

      // Hide loading indicator after animation
      setTimeout(() => setIsLoading(false), 1500);
    }
  }, [place]);

  return (
    <div className="relative h-full w-full">
      {/* Map */}
      <MapContainer
        ref={mapRef}
        center={[40.7589, -73.9851]} // NYC default
        zoom={12}
        scrollWheelZoom={true}
        className="h-full w-full"
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
        {place && (
          <Marker position={[place.latitude, place.longitude]}>
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">{place.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  📍 {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                </p>
                <div className="text-xs text-gray-500">Click and drag to explore the area</div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-[1000] pointer-events-none">
          <div className="bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600"></div>
            <span className="text-gray-700 font-medium">Flying to location...</span>
          </div>
        </div>
      )}

      {/* Map info overlay */}
      {!place && (
        <div className="absolute top-4 left-4 right-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg p-4 z-[1000] max-w-md">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🗺️</div>
            <div>
              <h3 className="font-semibold text-gray-900">Welcome to Maps Explorer</h3>
              <p className="text-sm text-gray-600 mt-1">Search for a location in the sidebar to get started exploring!</p>
            </div>
          </div>
        </div>
      )}

      {/* Current location display */}
      {place && (
        <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg p-3 z-[1000]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <span className="text-lg">📍</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 truncate">{place.name}</p>
                <p className="text-xs text-gray-600">
                  {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                </p>
              </div>
            </div>
            <button onClick={() => mapRef.current?.flyTo([place.latitude, place.longitude], 15)} className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200 flex-shrink-0">
              Zoom In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
