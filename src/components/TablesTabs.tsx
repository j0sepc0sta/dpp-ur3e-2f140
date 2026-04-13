// src/components/TablesTabs.tsx
"use client";

import { useMemo, useState } from "react";
// import type { TableData } from "@/lib/db-utils";
type TableData = {
  name: string;
  columns: string[];
  rows: Record<string, unknown>[];
};

export default function TablesTabs({ tables }: { tables: TableData[] }) {
    const [active, setActive] = useState(tables[0]?.name ?? "");

    const activeTable = useMemo(
        () => tables.find((t) => t.name === active),
        [tables, active]
    );

    if (!tables.length) return <div className="p-6">Sem tabelas.</div>;

    return (
        <div className="mt-6">
            <div className="flex flex-wrap gap-2 border-b pb-3">
                {tables.map((t) => (
                    <button
                        key={t.name}
                        onClick={() => setActive(t.name)}
                        className={[
                            "rounded-md px-3 py-1 text-sm border",
                            active === t.name ? "font-semibold" : "opacity-70",
                        ].join(" ")}
                    >
                        {t.name}
                    </button>
                ))}
            </div>

            <div className="mt-4 rounded-lg border p-4">
                <h2 className="text-lg font-semibold">{activeTable?.name}</h2>
                <p className="mt-1 text-sm opacity-70">
                    {activeTable?.rows.length ?? 0} registos
                </p>

                {activeTable ? (
                    <div className="mt-4 overflow-auto">
                        <table className="min-w-full text-sm">
                            <thead className="border-b">
                            <tr>
                                {activeTable.columns.map((c) => (
                                    <th key={c} className="px-3 py-2 text-left font-medium">
                                        {c}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {activeTable.rows.map((r, idx) => (
                                <tr key={idx} className="border-b last:border-b-0">
                                    {activeTable.columns.map((c) => (
                                        <td key={c} className="px-3 py-2 align-top">
                                            {r?.[c] == null ? "" : String(r[c])}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
