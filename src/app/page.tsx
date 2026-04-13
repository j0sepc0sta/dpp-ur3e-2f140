// import ProductCard from "@/components/ProductCard";
import ProductCard from "@/components/ProductCard";
import { getAllProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

function normalizeImageSrc(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  let s = raw.trim();
  if (!s) return null;
  s = s.replace(/^public\//i, "");
  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith("/")) return s;
  return `/images/${s}`;
}

function slugFromProduct(product: any) {
  const model = String(product?.model ?? "").toLowerCase();
  if (model === "ur3e") return "ur3e";
  if (model === "2f-140" || model === "2f140") return "2f-140";
  return model;
}

export default async function Home() {
  const products = await getAllProducts();
  const cards = products.map((p: any) => {
    const slug = slugFromProduct(p);
    const title =
      [p.manufacturer_name, p.model].filter(Boolean).join(" — ") ||
      "Digital Product Passport";
    const imageSrc = normalizeImageSrc(p.image_uri) ?? "/images/ur3e.webp";
    return { slug, title, imageSrc };
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Hero Section */}
      <div className="relative mb-8 rounded-2xl border border-[#d0d7e3] bg-white overflow-hidden shadow-sm">
        {/* Decorative top accent */}
        <div className="h-1 bg-gradient-to-r from-[#003399] via-[#0055cc] to-[#FFD617]" />

        <div className="p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-7 w-7 rounded-md bg-[#003399] flex items-center justify-center">
                  <span className="text-[#FFD617] text-[10px] font-bold">DPP</span>
                </div>
                <span className="text-xs font-semibold text-[#003399] uppercase tracking-wider">
                  Digital Product Passport
                </span>
              </div>

              <p className="mt-2 text-sm text-[#5a6a82] leading-relaxed">
                The Digital Product Passport (DPP) is a structured, machine-readable record
                mandated under the Ecodesign for Sustainable Products Regulation
                (ESPR, Regulation (EU) 2024/1781). It provides a unique product identifier
                linked to comprehensive lifecycle data — including material composition,
                carbon footprint, repairability, and end-of-life guidance — enabling
                transparency, traceability, and circularity across the value chain.
              </p>

              <p className="mt-1 text-sm text-[#5a6a82] leading-relaxed">
                This implementation demonstrates sovereign data exchange through Eclipse
                Dataspace Components (EDC) connectors, using the Dataspace Protocol (DSP)
                and Decentralized Claims Protocol (DCP) for identity and access
                management within a Gaia-X compliant architecture.
              </p>
            </div>

            {/* Stats panel */}
            <div className="flex flex-col gap-3 min-w-[200px]">
              <div className="rounded-xl border border-[#d0d7e3] bg-[#f5f7fb] p-4">
                <div className="text-[11px] font-medium text-[#8896ad] uppercase tracking-wider">
                  Registered Products
                </div>
                <div className="mt-1 text-2xl font-bold text-[#003399]">
                  {cards.length}
                </div>
              </div>

              <div className="rounded-xl border border-[#d0d7e3] bg-[#f5f7fb] p-4">
                <div className="text-[11px] font-medium text-[#8896ad] uppercase tracking-wider">
                  Data Views
                </div>
                <div className="mt-1 text-2xl font-bold text-[#003399]">
                  5
                </div>
                <div className="mt-0.5 text-[10px] text-[#8896ad]">
                  nameplate · carbon · bom · traceability · full
                </div>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="text-[11px] font-medium text-emerald-600 uppercase tracking-wider">
                  DataSpace Status
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-semibold text-emerald-700">Connected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-1 flex flex-wrap gap-1">
            <span className="inline-flex items-center rounded-full border border-[#b8c6db] bg-[#f0f4fa] px-3 py-1 text-[11px] font-medium text-[#003399]">
              Circularity
            </span>
            <span className="inline-flex items-center rounded-full border border-[#b8c6db] bg-[#f0f4fa] px-3 py-1 text-[11px] font-medium text-[#003399]">
              Data Spaces
            </span>
            <span className="inline-flex items-center rounded-full border border-[#b8c6db] bg-[#f0f4fa] px-3 py-1 text-[11px] font-medium text-[#003399]">
              Eclipse EDC v0.17
            </span>
            <span className="inline-flex items-center rounded-full border border-[#b8c6db] bg-[#f0f4fa] px-3 py-1 text-[11px] font-medium text-[#003399]">
              DSP 2025/1
            </span>
            <span className="inline-flex items-center rounded-full border border-[#b8c6db] bg-[#f0f4fa] px-3 py-1 text-[11px] font-medium text-[#003399]">
              DCP · Verifiable Credentials
            </span>
          </div>
        </div>
      </div>

      {/* Section header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#1a2a4a]">
          Registered Products
        </h2>
        <span className="text-xs text-[#8896ad]">
          {cards.length} product{cards.length !== 1 ? "s" : ""} in registry
        </span>
      </div>

      {/* Product Grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
        {cards.map((c) => (
          <ProductCard
            key={c.slug}
            slug={c.slug}
            title={c.title}
            imageSrc={c.imageSrc}
          />
        ))}
      </div>
    </div>
  );
}


// import { getAllProducts } from "@/lib/products";
//
// export const dynamic = "force-dynamic";
//
// function normalizeImageSrc(raw: unknown): string | null {
//   if (typeof raw !== "string") return null;
//   let s = raw.trim();
//   if (!s) return null;
//   s = s.replace(/^public\//i, "");
//   if (/^https?:\/\//i.test(s)) return s;
//   if (s.startsWith("/")) return s;
//   return `/images/${s}`;
// }
//
// function slugFromProduct(product: any) {
//   const model = String(product?.model ?? "").toLowerCase();
//   if (model === "ur3e") return "ur3e";
//   if (model === "2f-140" || model === "2f140") return "2f-140";
//   return model;
// }
//
// export default async function Home() {
//   const products = await getAllProducts();
//   const cards = products.map((p: any) => {
//     const slug = slugFromProduct(p);
//     const title =
//       [p.manufacturer_name, p.model].filter(Boolean).join(" — ") ||
//       "Digital Product Passport";
//     const imageSrc = normalizeImageSrc(p.image_uri) ?? "/images/ur3e.webp";
//     return { slug, title, imageSrc };
//   });
//
//   return (
//     <div className="mx-auto max-w-7xl px-6 py-10">
//       {/* Hero */}
//       <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-bold tracking-tight text-gray-900">
//                           Digital Product Passport
//                     </h1>
//                         <p className="mt-1.5 text-sm text-gray-500 max-w-xl leading-relaxed">
//                           The Digital Product Passport (DPP) is a structured digital record mandated
//                           under the EU Ecodesign for Sustainable Products Regulation (ESPR,
//                           Regulation (EU) 2024/1781). It provides a unique product identifier linked
//                           to comprehensive lifecycle data, including material composition, carbon
//                           footprint, repairability, and end-of-life guidance, enabling transparency,
//                           traceability, circularity and data sharing across the value chain. This proof of concept
//                           demonstrates sovereign data exchange via Eclipse EDC connectors and
//                           decentralised identity (DCP).
//                         </p>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
//               ESPR Compliant
//             </span>
//             <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
//               Eclipse Dataspaces Connector
//             </span>
//             <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
//               {cards.length} Products
//             </span>
//           </div>
//         </div>
//       </div>
//
//       {/* Product Grid */}
//       <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
//         {cards.map((c) => (
//           <ProductCard
//             key={c.slug}
//             slug={c.slug}
//             title={c.title}
//             imageSrc={c.imageSrc}
//           />
//         ))}
//       </div>
//
//       {/* Footer info */}
//       <div className="mt-12 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
//         Digital Product Passport PoC — Eclipse EDC + MinimumViableDataspace + Gaia-X
//       </div>
//     </div>
//   );
// }
//


// import ProductCard from "@/components/ProductCard"
// import { getAllProducts } from "@/lib/products";
//
// export const dynamic = "force-dynamic";
//
// function normalizeImageSrc(raw: unknown): string | null {
//   if (typeof raw !== "string") return null;
//   let s = raw.trim();
//   if (!s) return null;
//
//   s = s.replace(/^public\//i, "");
//   if (/^https?:\/\//i.test(s)) return s;
//   if (s.startsWith("/")) return s;
//   return `/images/${s}`;
// }
//
// function slugFromProduct(product: any) {
//   const model = String(product?.model ?? "").toLowerCase();
//   if (model === "ur3e") return "ur3e";
//   if (model === "2f-140" || model === "2f140") return "2f-140";
//   return model;
// }
//
// export default async function Home() {
//   const products = await getAllProducts();
//
//   const cards = products.map((p: any) => {
//     const slug = slugFromProduct(p);
//     const title =
//       [p.manufacturer_name, p.model].filter(Boolean).join(" — ") ||
//       "Digital Product Passport";
//
//     const imageSrc = normalizeImageSrc(p.image_uri) ?? "/images/ur3e.webp";
//
//     return {
//       slug,
//       title,
//       imageSrc,
//     };
//   });
//
//   return (
//     <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
//       <div className="mx-auto max-w-6xl">
//         <h1 className="text-2xl font-semibold text-gray-900">
//           Digital Product Passport
//         </h1>
//
//         <div className="mt-6 flex flex-wrap gap-4">
//           {cards.map((c) => (
//             <ProductCard
//               key={c.slug}
//               slug={c.slug}
//               title={c.title}
//               imageSrc={c.imageSrc}
//             />
//           ))}
//         </div>
//       </div>
//     </main>
//   );
// }