// src/components/DppPassport.tsx
"use client";

import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

const TraceabilityMap = dynamic(() => import("./TraceabilityMap"), { ssr: false });

type TraceEvent = {
    id: string;
    event_time: string;
    event_name?: string | null;
    event_type?: string | null;
    biz_step?: string | null;
    disposition?: string | null;
    actor_name?: string | null;
    read_point?: string | null;
    from_location?: string | null;
    to_location?: string | null;
    related_product_label?: string | null;
    notes?: string | null;
};

type TraceabilityData = {
    actors: { id: string; name: string; role: string; website?: string | null; country?: string | null }[];
    locations: { id: string; name: string; city?: string | null; country?: string | null; lat?: number | null; lon?: number | null }[];
    events: TraceEvent[];
};



type KV = Record<string, string>;

type TechnicalRow = { type?: string; submodel?: string; content?: string };

type CarbonFootprintRow = {
    footprint_kind?: string;
    lifecycle_stage?: string;
    emission_value?: number | string | null;
    unit?: string | null;
    standard?: string | null;
    boundary?: string | null;
    reference_period_start?: string | null;
    reference_period_end?: string | null;
};

type BomComponent = {
    component_name: string;
    quantity: number;
    unit?: string | null;
    linked_product?: string | null;
    notes?: string | null;
};

type BomMaterial = {
    material: string;
    percentage?: number | string | null;
    recycled_percentage?: number | string | null;
    notes?: string | null;
};

type BillOfMaterials = {
    components: BomComponent[];
    materials: BomMaterial[];
};

type DocumentRow = {
    category?: string;
    title?: string;
    language?: string;
    version?: string;
    issue_date?: string;
    uri?: string;
    mime_type?: string;
};

type ContactBundle = {
    role_code?: string | null;
    available_time?: string | null;
    org_name?: string | null;
    street?: string | null;
    zipcode?: string | null;
    region?: string | null;
    country?: string | null;
    notes?: string | null;
    phones?: { phone_number: string; phone_type_code?: string | null }[];
    emails?: { email_address: string; email_type_code?: string | null }[];
    links?: { link: string; channel_type?: string | null }[];
    faxes?: { fax_number: string; fax_type_code?: string | null }[];
};

// Find the Props type definition and add slug:
type Props = {
  digitalProductName: Record<string, string>;
  carbonFootprint: CarbonFootprintRow[];
  technicalData: TechnicalRow[];
  billOfMaterials: { components: BomComponent[]; materials: BomMaterial[] };
  documentation: any[];
  contactInformation: any[];
  kpis: any;
  traceability: TraceabilityData;
  slug: string;          // ADD THIS
};

function normalizeImageSrc(raw: unknown): string | null {
    if (typeof raw !== "string") return null;
    let s = raw.trim();
    if (!s) return null;

    s = s.replace(/^public\//i, "");

    if (/^https?:\/\//i.test(s)) return s;

    if (s.startsWith("/")) return s;

    if (!s.includes("/")) return `/images/${s}`;

    return `/${s}`;
}

function normalizeUrl(raw: unknown): string | null {
    if (typeof raw !== "string") return null;
    let s = raw.trim();
    if (!s) return null;
    if (s.startsWith("ttps://")) s = "h" + s;
    if (!/^https?:\/\//i.test(s)) return null;
    return s;
}

function Badge({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-700 shadow-sm">
      {children}
    </span>
    );
}

function Card({
                  title,
                  right,
                  children,
              }: {
    title: string;
    right?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
                <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
                {right}
            </div>
            <div className="px-5 py-4">{children}</div>
        </div>
    );
}

function Kpi({ label, value }: { label: string; value?: string }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <div className="text-xs text-gray-500">{label}</div>
            <div className="mt-1 text-lg font-semibold text-gray-900">{value?.trim() || "—"}</div>
        </div>
    );
}

function KvGrid({ data }: { data: KV }) {
    const entries = useMemo(() => {
        return Object.entries(data ?? {})
            .map(([k, v]) => [k.trim(), (v ?? "").trim()] as const)
            .filter(([k, v]) => k && v);
    }, [data]);

    return (
        <div className="grid gap-3 sm:grid-cols-2">
            {entries.map(([k, v]) => (
                <div key={k} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                    <div className="text-xs font-medium text-gray-600">{k}</div>
                    <div className="mt-1 break-words text-sm text-gray-900">{v}</div>
                </div>
            ))}
        </div>
    );
}

export default function DppPassport(props: Props) {
//     const { digitalProductName, carbonFootprint, technicalData, billOfMaterials, documentation, contactInformation, kpis } = props;

    const { digitalProductName, carbonFootprint, technicalData, billOfMaterials, documentation, contactInformation, kpis, traceability, slug } = props;

    const [currentUrl, setCurrentUrl] = useState("");
    useEffect(() => setCurrentUrl(window.location.href), []);

    const manufacturer = (digitalProductName["Manufacturer"] || "").trim();
    const model = (digitalProductName["Model / Part"] || "").trim();
    const country = (digitalProductName["Country of origin"] || "").trim();
    const serial = (digitalProductName["Serial number"] || "").trim();

    const title = [manufacturer, model].filter(Boolean).join(" — ") || "Digital Product Passport";
    const imageSrc = normalizeImageSrc(digitalProductName["Image"]);

    const [tab, setTab] = useState<
        "Digital Product Name" | "Carbon Footprint" | "Technical Data" | "Bill of Materials" | "Documentation" | "Contact Information" | "Supply Chain & Traceability"
    >("Digital Product Name");

    const shareUrl = useMemo(() => {
        const candidates = [digitalProductName["Global product identifier"]];
        for (const c of candidates) {
            const u = normalizeUrl(c);
            if (u) return u;
        }
        return currentUrl;
    }, [digitalProductName, currentUrl]);

    const groupedTech = useMemo(() => {
        const map = new Map<string, TechnicalRow[]>();
        for (const r of technicalData ?? []) {
            const key = String(r.type ?? "Other").trim() || "Other";
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(r);
        }
        return Array.from(map.entries());
    }, [technicalData]);

    const tabBtn = (key: typeof tab) => (
        <button
            type="button"
            onClick={() => setTab(key)}
            className={[
                "rounded-full px-4 py-2 text-sm font-medium transition border",
                tab === key ? "bg-gray-900 text-white border-gray-900 shadow-sm" : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50",
            ].join(" ")}
        >
            {key}
        </button>
    );

    const kpiCarbon = kpis?.carbon_total ? `${kpis.carbon_total.value} ${kpis.carbon_total.unit}` : "—";
    const kpiCirc = kpis?.circularity_index !== null && kpis?.circularity_index !== undefined ? String(kpis.circularity_index) : "—";
    const kpiRecyc = kpis?.recyclability_rate !== null && kpis?.recyclability_rate !== undefined ? `${kpis.recyclability_rate}%` : "—";

    return (
        <div className="space-y-6">
            {/* HERO */}
            <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="grid gap-6 p-6 lg:grid-cols-[380px,1fr]">
                     {/*Image
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden">
                        {imageSrc ? (
                            <Image src={imageSrc} alt={title} width={1200} height={900} className="h-full w-full object-cover" priority />
                        ) : (
                            <div className="flex h-[240px] items-center justify-center text-sm text-gray-500">Sem imagem</div>
                        )}
                    </div>*/}
                    {/* Image */}
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden">
                        <div className="relative h-[240px] sm:h-[280px] lg:h-[320px] w-full">
                            {imageSrc ? (
                                <Image
                                    src={imageSrc}
                                    alt={title}
                                    fill
                                    sizes="(min-width: 1024px) 380px, 100vw"
                                    className="object-contain p-4"
                                    priority
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-sm text-gray-500">
                                    Sem imagem
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                                <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {country && <Badge>{`Origin: ${country}`}</Badge>}
                                    {serial && <Badge>{`Serial: ${serial}`}</Badge>}
                                </div>
                            </div>

                            {/* QR */}
                            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-white p-2 border border-gray-200">
                                        <QRCodeSVG value={shareUrl || ""} size={96} />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-xs font-medium text-gray-600">Unique Product Identifier</div>
                                        <div className="mt-1 break-all font-mono text-[11px] text-gray-600">{shareUrl || "—"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* KPI strip */}
                        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            <Kpi label="Carbon footprint" value={kpiCarbon} />
                            <Kpi label="Circularity index" value={kpiCirc} />
                            <Kpi label="Recyclability" value={kpiRecyc} />
                        </div>

                        {/* Tabs */}
                        <div className="mt-5 flex flex-wrap gap-2">
                            {tabBtn("Digital Product Name")}
                            {tabBtn("Carbon Footprint")}
                            {tabBtn("Technical Data")}
                            {tabBtn("Bill of Materials")}
                            {tabBtn("Documentation")}
                            {tabBtn("Contact Information")}
                            {tabBtn("Supply Chain & Traceability")}
                        </div>
                    </div>
                </div>
            </div>

            {tab === "Digital Product Name" && (
                <Card title="Digital Product Name">
                    <KvGrid data={digitalProductName} />
                </Card>
            )}

            {tab === "Carbon Footprint" && (
                <Card title="Carbon Footprint">
                    {carbonFootprint?.length ? (
                        <div className="space-y-2">
                            {carbonFootprint.map((r, i) => (
                                <div key={i} className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm">
                                    <div className="font-medium text-gray-900">
                                        {String(r.lifecycle_stage ?? "—")} {r.footprint_kind ? `(${r.footprint_kind})` : ""}
                                    </div>
                                    <div className="mt-1 text-gray-800">
                                        {r.emission_value ?? "—"} {r.unit ?? "kg CO2e"} {r.standard ? `• ${r.standard}` : ""} {r.boundary ? `• ${r.boundary}` : ""}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-gray-600">Without data.</div>
                    )}
                </Card>
            )}

            {tab === "Technical Data" && (
                <div className="space-y-4">
                    {groupedTech.length ? (
                        groupedTech.map(([group, rows]) => (
                            <Card key={group} title={group}>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {rows.map((r, idx) => (
                                        <div key={`${group}-${idx}`} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                                            <div className="text-xs font-medium text-gray-600">{String(r.submodel ?? "").trim() || "—"}</div>
                                            <div className="mt-1 text-sm text-gray-900">{String(r.content ?? "").trim() || "—"}</div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Card title="Technical Data">
                            <div className="text-sm text-gray-600">Without data.</div>
                        </Card>
                    )}
                </div>
            )}

            {tab === "Bill of Materials" && (
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card title="Components">
                        {billOfMaterials.components?.length ? (
                            <ul className="space-y-2">
                                {billOfMaterials.components.map((c, i) => (
                                    <li key={i} className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900">
                                        {c.quantity && c.quantity !== 1 ? `${c.quantity}× ` : ""}
                                        {c.component_name}
                                        {c.unit ? ` ${c.unit}` : ""}
                                        {c.linked_product ? <div className="mt-1 text-xs text-gray-600">{c.linked_product}</div> : null}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-sm text-gray-600">Without data.</div>
                        )}
                    </Card>

                    <Card title="Material composition">
                        {billOfMaterials.materials?.length ? (
                            <ul className="space-y-2">
                                {billOfMaterials.materials.map((m, i) => (
                                    <li key={i} className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900">
                                        <div className="font-medium">{m.material}</div>
                                        <div className="mt-1 text-xs text-gray-700">
                                            {m.percentage != null ? `Share: ${m.percentage}%` : "Share: —"}
                                            {m.recycled_percentage != null ? ` • Recycled: ${m.recycled_percentage}%` : ""}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-sm text-gray-600">Without data.</div>
                        )}
                    </Card>
                </div>
            )}

            {tab === "Documentation" && (
                <Card title="Documentation">
                    {documentation?.length ? (
                        <div className="space-y-2">
                            {documentation
                                .filter((d) => String(d.mime_type ?? "").toLowerCase().startsWith("image/") === false) // evita duplicar imagem aqui
                                .map((d, i) => {
                                    const url = normalizeUrl(d.uri);
                                    const label = String(d.category ?? "Document");
                                    const title = String(d.title ?? "").trim();
                                    return (
                                        <div key={i} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                                            <div className="text-sm font-medium text-gray-900">{title ? `${label} — ${title}` : label}</div>
                                            {url ? (
                                                <a
                                                    href={url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 hover:bg-gray-50"
                                                >
                                                    Open
                                                </a>
                                            ) : (
                                                <div className="text-xs text-gray-600 break-all">{String(d.uri ?? "")}</div>
                                            )}
                                        </div>
                                    );
                                })}
                        </div>
                    ) : (
                        <div className="text-sm text-gray-600">Sem documentos.</div>
                    )}
                </Card>
            )}

            {tab === "Contact Information" && (
                <Card title="Contact Information">
                    {contactInformation?.length ? (
                        <div className="space-y-3">
                            {contactInformation.map((c, i) => (
                                <div key={i} className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm">
                                    <div className="font-medium text-gray-900">{c.org_name || "Contact"}</div>
                                    <div className="mt-1 text-xs text-gray-700">
                                        {c.role_code ? `Role: ${c.role_code}` : null}
                                        {c.available_time ? ` • ${c.available_time}` : null}
                                    </div>

                                    {(c.street || c.zipcode || c.region || c.country) && (
                                        <div className="mt-2 text-xs text-gray-700">
                                            {[c.street, c.zipcode, c.region, c.country].filter(Boolean).join(" • ")}
                                        </div>
                                    )}

                                    {!!c.emails?.length && (
                                        <div className="mt-2 text-xs text-gray-800">
                                            // AFTER
                                            Emails: {c.emails.map((e: any) => e.email_address).join(", ")}
                                        </div>
                                    )}

                                    {!!c.phones?.length && (
                                        <div className="mt-1 text-xs text-gray-800">
                                            Phones: {c.phones.map((p) => p.phone_number).join(", ")}
                                        </div>
                                    )}

                                    {!!c.links?.length && (
                                        <div className="mt-1 flex flex-wrap gap-2">
                                            {c.links.map((l, j) => (
                                                <a
                                                    key={j}
                                                    href={String(l.link)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 hover:bg-gray-50"
                                                >
                                                    {l.channel_type || "Link"}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-gray-600">Without data.</div>
                    )}
                </Card>
            )}

            {tab === "Supply Chain & Traceability" && (
                <div className="space-y-6">
                    <Card title="Traceability timeline">
                        {props.traceability?.events?.length ? (
                            <div className="space-y-3">
                                {props.traceability.events.map((e) => (
                                    <div key={e.id} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="text-sm font-semibold text-gray-900">
                                                {e.event_name || e.biz_step || e.event_type || "Event"}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                {new Date(e.event_time).toLocaleString()}
                                            </div>
                                        </div>

                                        <div className="mt-1 text-xs text-gray-700">
                                            {e.actor_name ? `Actor: ${e.actor_name}` : null}
                                            {e.disposition ? ` • Disposition: ${e.disposition}` : null}
                                        </div>

                                        {(e.from_location || e.to_location || e.read_point) && (
                                            <div className="mt-1 text-xs text-gray-700">
                                                {e.from_location && e.to_location
                                                    ? `Route: ${e.from_location} → ${e.to_location}`
                                                    : e.read_point
                                                        ? `Location: ${e.read_point}`
                                                        : null}
                                            </div>
                                        )}

                                        {e.related_product_label && (
                                            <div className="mt-1 text-xs text-gray-700">
                                                Related: {e.related_product_label}
                                            </div>
                                        )}

                                        {e.notes && <div className="mt-2 text-xs text-gray-600">{e.notes}</div>}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-600">Without data.</div>
                        )}
                    </Card>

                    <Card title="Traceability map">
                        {props.traceability?.locations?.some((l) => typeof l.lat === "number" && typeof l.lon === "number") ? (
                            <TraceabilityMap locations={props.traceability.locations as any} />
                        ) : (
                            <div className="text-sm text-gray-600">No georeferenced locations yet.</div>
                        )}
                    </Card>

                    <Card title="Supply chain actors">
                        {props.traceability?.actors?.length ? (
                            <div className="grid gap-3 sm:grid-cols-2">
                                {props.traceability.actors.map((a) => (
                                    <div key={a.id} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                                        <div className="text-sm font-semibold text-gray-900">{a.name}</div>
                                        <div className="mt-1 text-xs text-gray-700">{a.role}{a.country ? ` • ${a.country}` : ""}</div>
                                        {a.website ? (
                                            <a className="mt-2 inline-block text-xs text-blue-700 underline" href={a.website} target="_blank" rel="noreferrer">
                                                Website
                                            </a>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-600">Without data.</div>
                        )}
                    </Card>
                </div>
            )}
        </div>
    );
}
// Add to src/components/DppPassport.tsx

type DataSpaceInfo = {
  edcEndpoint: string;
  participantId: string;
  availableScopes: string[];
};
// Add this new component inside DppPassport.tsx
function DataSpaceBadge({ slug }: { slug: string }) {
  const [copied, setCopied] = useState<string | null>(null);
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "https://dpp-ur3e-grippers-mongodb-claude.vercel.app";

  const endpoints = [
    { label: "Catalog",     url: `${base}/api/dsp/catalog/request`,      method: "POST" },
    { label: "Negotiate",   url: `${base}/api/dsp/negotiations`,          method: "POST" },
    { label: "Transfer",    url: `${base}/api/dsp/transfers`,             method: "POST" },
    { label: "Data (carbon)",url: `${base}/api/edc/${slug}?view=carbon`,  method: "GET"  },
    { label: "Identity",    url: `${base}/.well-known/did.json`,          method: "GET"  },
  ];

  const copy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="mt-6 rounded-2xl border border-purple-200 bg-purple-50 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-purple-900">
            Gaia-X DataSpace Provider
          </p>
          <p className="text-xs text-purple-600 mt-0.5">
            Participant ID: DPP-UR3E-001 · Protocol: DSP v0.8
          </p>
        </div>
        <div className="flex gap-2">
          {["nameplate","carbon","bom","traceability"].map(scope => (
            <span key={scope} className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700">
              {scope}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {endpoints.map(ep => (
          <div key={ep.label} className="flex items-center gap-2 rounded-lg bg-white border border-purple-100 px-3 py-2">
            <span className="w-20 shrink-0 text-xs font-medium text-purple-700">{ep.label}</span>
            <span className="w-12 shrink-0 rounded bg-purple-50 px-1.5 py-0.5 text-xs text-purple-500 font-mono">{ep.method}</span>
            <code className="flex-1 truncate text-xs text-gray-500">{ep.url}</code>
            <button
              onClick={() => copy(ep.url)}
              className="shrink-0 text-xs text-purple-500 hover:text-purple-800 transition-colors"
            >
              {copied === ep.url ? "Copied!" : "Copy"}
            </button>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-purple-400">
        W3C DID: did:web:dpp-ur3e-grippers-mongodb-claude.vercel.app
      </p>
      <DataSpaceBadge slug={slug} />
    </div>

  );
}