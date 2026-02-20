import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationMapProps {
    center: [number, number];
    providers: any[];
    userLocation?: [number, number] | null;
}

export default function LocationMap({ center, providers, userLocation }: LocationMapProps) {
    return (
        <div className="h-[400px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-glow relative z-0">
            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                {userLocation && (
                    <Circle
                        center={userLocation}
                        radius={1000}
                        pathOptions={{ fillColor: '#e11d48', color: '#e11d48', fillOpacity: 0.2 }}
                    />
                )}

                {providers.map((p) => {
                    // If provider has lat/lng, show markers. For now we use random offsets around center for demo
                    const lat = center[0] + (Math.random() - 0.5) * 0.02;
                    const lng = center[1] + (Math.random() - 0.5) * 0.02;

                    return (
                        <Marker key={p.id} position={[lat, lng]}>
                            <Popup>
                                <div className="text-black p-2">
                                    <p className="font-bold">{p.full_name}</p>
                                    <p className="text-xs">{p.category}</p>
                                    <p className="text-pink-600 font-bold">₹{p.hourly_rate}</p>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
