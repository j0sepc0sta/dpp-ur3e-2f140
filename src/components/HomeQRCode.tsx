// src/components/HomeQRCode.tsx
"use client";

import { QRCodeSVG } from "qrcode.react";
import { useEffect, useMemo, useState } from "react";

export default function HomeQRCode() {
    const [origin, setOrigin] = useState("");

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    const shareUrl = useMemo(() => {
        if (!origin) return "";
        return `${origin}/`;
    }, [origin]);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4">
            <div className="flex items-start gap-4">
                <div className="rounded-xl bg-white p-2 border border-gray-200">
                    <QRCodeSVG value={shareUrl || "/"} size={96} />
                </div>

                <div className="min-w-0">
                    <div className="text-xs font-medium text-gray-600">Menu (Home) QR</div>
                    <div className="mt-1 break-all font-mono text-[11px] text-gray-600">
                        {shareUrl || "—"}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                        {shareUrl ? (
                            <>
                                <a
                                    href={shareUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 hover:bg-gray-50"
                                >
                                    Open
                                </a>

                                <button
                                    type="button"
                                    onClick={() => navigator.clipboard.writeText(shareUrl)}
                                    className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 hover:bg-gray-50"
                                >
                                    Copy
                                </button>
                            </>
                        ) : null}

                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 hover:bg-gray-50"
                        >
                            Print
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
