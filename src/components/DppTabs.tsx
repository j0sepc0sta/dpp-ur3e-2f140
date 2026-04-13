// src/components/DppTabs.tsx
"use client";

import { useMemo, useState } from "react";

type Props = {
    identification: Record<string, any>;
    characterization: Record<string, any> | null;
    lifecycleEvents: Record<string, any>[];
};

function KeyValueTable({ data }: { data: Record<string, any> }) {
    const rows = useMemo(() => {
        return Object.entries(data ?? {})
            .filter(([_, v]) => v !== null && v !== undefined && v !== "")
            .map(([k, v]) => [k, typeof v === "object" ? JSON.stringify(v) : String(v)]);
    }, [data]);

    return (
        <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
                <tbody>
                {rows.map(([k, v]) => (
                    <tr key={k} className="border-t first:border-t-0">
                        <td className="w-1/3 bg-gray-50 px-3 py-2 font-medium">{k}</td>
                        <td className="px-3 py-2 font-mono break-all">{v}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default function DppTabs({ identification, characterization, lifecycleEvents }: Props) {
    const [tab, setTab] = useState<"id" | "char" | "life">("id");

    const tabBtn = (key: typeof tab, label: string) => (
        <button
            type="button"
            onClick={() => setTab(key)}
            className={[
                "rounded-md px-3 py-2 text-sm border",
                tab === key ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-900 border-gray-200",
            ].join(" ")}
        >
            {label}
        </button>
    );

    return (
        <section className="space-y-4">
            <div className="flex gap-2">
                {tabBtn("id", "Identification")}
                {tabBtn("char", "Characterization")}
                {tabBtn("life", "Lifecycle events")}
            </div>

            {tab === "id" && (
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold">Product identification</h2>
                    <KeyValueTable data={identification} />
                </div>
            )}

            {tab === "char" && (
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold">Product characterization</h2>
                    {characterization ? (
                        <KeyValueTable data={characterization} />
                    ) : (
                        <p className="text-sm text-gray-600">Sem registo correspondente.</p>
                    )}
                </div>
            )}

            {tab === "life" && (
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold">Lifecycle events</h2>
                    {lifecycleEvents?.length ? (
                        <div className="space-y-3">
                            {lifecycleEvents.map((ev, i) => (
                                <div key={ev.id ?? i} className="rounded-lg border p-3">
                                    <KeyValueTable data={ev} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-600">Sem eventos.</p>
                    )}
                </div>
            )}
        </section>
    );
}
