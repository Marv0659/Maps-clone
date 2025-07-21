import type { Place } from "../api/Place";
import { Fragment, useState } from "react";
import { search } from "../api/Search";

interface LocationSearchProps {
  onPlaceClick: (place: Place) => void;
}

export default function LocationSearch({ onPlaceClick }: LocationSearchProps) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [term, setTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!term.trim()) return;

    setIsLoading(true);
    try {
      const results = await search(term);
      setPlaces(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search Form */}
      <div className="search-header">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-2">
              🔍 Search for a location
            </label>
            <div className="relative">
              <input className="search-input w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-0" id="term" type="text" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Enter city, address, or landmark..." disabled={isLoading} />
              {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
                </div>
              )}
            </div>
          </div>
          <button type="submit" disabled={isLoading || !term.trim()} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105">
            {isLoading ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      {/* Results */}
      {places.length > 0 && (
        <div className="flex-1 results-container">
          <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center">📍 Found Locations ({places.length})</h2>
          <div className="space-y-2">
            {places.map((place) => (
              <Fragment key={place.id}>
                <div className="location-item flex items-center justify-between group">
                  <div className="flex-1 min-w-0">
                    <p className="location-name text-sm truncate pr-2">{place.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                    </p>
                  </div>
                  <button className="go-button text-white px-4 py-2 rounded-lg text-sm font-medium flex-shrink-0 ml-2" onClick={() => onPlaceClick(place)}>
                    Go →
                  </button>
                </div>
                {places.indexOf(place) < places.length - 1 && <div className="border-b border-gray-200 mx-2" />}
              </Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {places.length === 0 && !isLoading && (
        <div className="flex-1 results-container text-center">
          <div className="mt-8">
            <div className="text-4xl mb-4">🌎</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to explore?</h3>
            <p className="text-gray-500 text-sm">Search for any location to get started. Try searching for cities, landmarks, or addresses.</p>
          </div>
        </div>
      )}
    </div>
  );
}
