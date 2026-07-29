import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Store } from "./data/types";

// Bundled with this component rather than linked in index.html, where it was a
// render-blocking request to a third-party CDN on every page — including all 764
// prerendered paint pages, none of which show a map.
import "leaflet/dist/leaflet.css";

/**
 * The store map, in its own module so it can be loaded on demand.
 *
 * Leaflet and react-leaflet are around a third of the JavaScript this app ships,
 * and only this tab uses them. Everyone arriving on a paint page from a search
 * result was paying for a map they never opened.
 */

/** Clean futuristic map marker — glowing node. */
const makeIcon = (color: string, active: boolean) =>
  L.divIcon({
    className: "",
    html: `<div class="map-pin ${active ? "active" : ""}" style="--pc:${color}"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -12],
  });

/** Pans and zooms the map toward the active store. */
function MapController({ store }: { store: Store | null }) {
  const map = useMap();
  useEffect(() => {
    if (store && store.lat != null && store.lng != null) {
      map.flyTo([store.lat, store.lng], Math.max(map.getZoom(), 14), { duration: 0.7 });
    }
  }, [store, map]);
  return null;
}

export interface StoreMapProps {
  /** Stores to pin. Callers pass only those with coordinates. */
  stores: Store[];
  activeStore: number | null;
  activeStoreObj: Store | null;
  onSelect: (id: number) => void;
}

export default function StoreMap({ stores, activeStore, activeStoreObj, onSelect }: StoreMapProps) {
  if (stores.length === 0) return null;
  return (
    <div className="map-container">
      <MapContainer
        key={stores.map(s => s.id).join(",")}
        bounds={stores.map(s => [s.lat as number, s.lng as number] as [number, number])}
        boundsOptions={{ padding: [50, 50], maxZoom: 13 }}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          attribution="&copy; OpenStreetMap &copy; CARTO"
        />
        <MapController store={activeStoreObj} />
        {stores.map(s => (
          <Marker
            key={s.id}
            position={[s.lat as number, s.lng as number]}
            icon={makeIcon(s.color, activeStore === s.id)}
            eventHandlers={{ click: () => onSelect(s.id) }}
          >
            <Popup><b>{s.name}</b><br />{s.city}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
