// @ts-nocheck
"use client";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";

import { useEffect, useMemo } from "react";

export type TraceLocation = {
    id: string;
    name: string;
    city?: string | null;
    country?: string | null;
    lat?: number | null;
    lon?: number | null;
};

function FitBounds({ points }: { points: [number, number][] }) {
    const map = useMap();
    useEffect(() => {
        if (!points.length) return;
        const bounds = points.reduce(
            (b, p) => b.extend(p),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).L?.latLngBounds?.() ?? null
        );

        // fallback sem L global: fit manual via setView
        if (!bounds || typeof bounds.extend !== "function") {
            const [lat, lon] = points[0];
            map.setView([lat, lon], 5);
            return;
        }

        map.fitBounds(bounds, { padding: [30, 30] });
    }, [map, points]);

    return null;
}

export default function TraceabilityMap({ locations }: { locations: TraceLocation[] }) {
    const points = useMemo(() => {
        return (locations ?? [])
            .filter((l) => typeof l.lat === "number" && typeof l.lon === "number")
            .map((l) => [l.lat as number, l.lon as number] as [number, number]);
    }, [locations]);

const center: [number, number] = points.length ? points[0] : [20, 0];

    return (
        <div className="relative h-[380px] w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
// AFTER
{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
<MapContainer {...{ center } as any} zoom={points.length ? 5 : 2} scrollWheelZoom={true} className="h-full w-full z-0">        <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {points.length ? <FitBounds points={points} /> : null}

                {(locations ?? [])
                    .filter((l) => typeof l.lat === "number" && typeof l.lon === "number")
                    .map((l) => (
                        <CircleMarker key={l.id} center={[l.lat as number, l.lon as number]} radius={8}>
                            <Popup>
                                <div className="text-sm font-medium">{l.name}</div>
                                <div className="text-xs text-gray-600">
                                    {[l.city, l.country].filter(Boolean).join(", ")}
                                </div>
                            </Popup>
                        </CircleMarker>
                    ))}
            </MapContainer>
        </div>
    );
}