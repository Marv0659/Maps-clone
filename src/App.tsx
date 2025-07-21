import "./App.css";
import Map from "./components/Map";
import LocationSearch from "./components/LocationSearch";
import type { Place } from "./api/Place";
import { useState } from "react";

function App() {
  const [place, setPlace] = useState<Place | null>(null);
  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Header */}
      <div className="app-header">
        <h1>🗺️ Maps Explorer</h1>
      </div>

      {/* Main content */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        <div className="col-span-12 md:col-span-4 lg:col-span-3 search-panel">
          <div className="h-full flex flex-col p-4">
            <LocationSearch onPlaceClick={(p) => setPlace(p)} />
          </div>
        </div>
        <div className="col-span-12 md:col-span-8 lg:col-span-9 map-container">
          <Map place={place} />
        </div>
      </div>
    </div>
  );
}

export default App;
