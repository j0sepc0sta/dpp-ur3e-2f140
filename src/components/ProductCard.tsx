// src/components/ProductCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useMemo, useState } from "react";

type Props = {
  slug: string;
  title: string;
  imageSrc: string | null;
};

export default function ProductCard({ slug, title, imageSrc }: Props) {
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const shareUrl = useMemo(() => {
    if (!origin) return "";
    return `${origin}/${slug}`;
  }, [origin, slug]);

  return (
    <div className="group rounded-2xl border border-[#d0d7e3] bg-white shadow-sm overflow-hidden hover:shadow-md hover:border-[#a0b0c8] transition-all duration-200">
      {/* Top accent */}
      <div className="h-0.5 bg-gradient-to-r from-[#003399] to-[#0055cc]" />

      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <Link href={`/${slug}`} className="block sm:w-[220px] shrink-0">
          <div className="relative h-48 sm:h-full bg-gradient-to-br from-[#f5f7fb] to-[#eaeff7] border-b sm:border-b-0 sm:border-r border-[#e0e7f0] overflow-hidden">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={title}
                fill
                sizes="220px"
                className="object-contain p-5 group-hover:scale-[1.03] transition-transform duration-300"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-[#8896ad]">
                No image
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="flex flex-col flex-1 min-w-0">
          <Link href={`/${slug}`} className="block p-5 pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#003399] px-2 py-0.5 text-[10px] font-semibold text-white tracking-wide">
                    DPP
                  </span>
                  <span className="text-[10px] text-[#8896ad] uppercase tracking-wider font-medium">
                    Product Passport
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[#1a2a4a] leading-snug group-hover:text-[#003399] transition-colors">
                  {title}
                </h3>
              </div>
            </div>

            {/* Data scope badges */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["Nameplate", "Carbon", "BOM", "Traceability"].map((scope) => (
                <span
                  key={scope}
                  className="rounded-md border border-[#d0d7e3] bg-[#f5f7fb] px-2 py-0.5 text-[10px] font-medium text-[#5a6a82]"
                >
                  {scope}
                </span>
              ))}
            </div>

            <p className="mt-3 text-xs text-[#003399] font-medium">
              View full passport →
            </p>
          </Link>

          {/* QR + UPI */}
          <div className="mt-auto border-t border-[#e0e7f0] bg-[#f9fafc] p-4">
            <div className="flex items-start gap-3">
              <div className="shrink-0 rounded-lg bg-white p-1.5 border border-[#d0d7e3] shadow-sm">
                <QRCodeSVG
                  value={shareUrl || slug}
                  size={72}
                  fgColor="#003399"
                  bgColor="#ffffff"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-semibold text-[#5a6a82] uppercase tracking-wider">
                  Unique Product Identifier
                </div>
                <div className="mt-1 break-all font-mono text-[10px] leading-relaxed text-[#8896ad]">
                  {shareUrl || "—"}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {shareUrl && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        navigator.clipboard.writeText(shareUrl);
                      }}
                      className="rounded-md border border-[#d0d7e3] bg-white px-2.5 py-1 text-[10px] font-medium text-[#1a2a4a] hover:bg-[#f0f4fa] transition"
                    >
                      Copy URL
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      window.print();
                    }}
                    className="rounded-md border border-[#d0d7e3] bg-white px-2.5 py-1 text-[10px] font-medium text-[#1a2a4a] hover:bg-[#f0f4fa] transition"
                  >
                    Print QR
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





// // src/components/ProductCard.tsx


// "use client";
//
// import Link from "next/link";
// import Image from "next/image";
// import { QRCodeSVG } from "qrcode.react";
// import { useEffect, useMemo, useState } from "react";
//
// type Props = {
//     slug: string;
//     title: string;
//     imageSrc: string | null;
// };
//
// export default function ProductCard({ slug, title, imageSrc }: Props) {
//     const [origin, setOrigin] = useState("");
//
//     useEffect(() => {
//         setOrigin(window.location.origin);
//     }, []);
//
//     const shareUrl = useMemo(() => {
//         if (!origin) return "";
//         return `${origin}/${slug}`;
//     }, [origin, slug]);
//
//     return (
//         <div className="w-[360px] rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
//             <Link href={`/${slug}`} className="block group">
//                 <div className="relative h-44 bg-gray-50 border-b border-gray-100 overflow-hidden">
//                     {imageSrc ? (
//                         <Image
//                             src={imageSrc}
//                             alt={title}
//                             fill
//                             sizes="360px"
//                             className="object-contain p-4 group-hover:scale-[1.02] transition"
//                             priority
//                         />
//                     ) : (
//                         <div className="flex h-full items-center justify-center text-sm text-gray-500">
//                             Sem imagem
//                         </div>
//                     )}
//                 </div>
//
//                 <div className="p-4">
//                     <div className="text-sm font-semibold text-gray-900 leading-snug">{title}</div>
//                     <div className="mt-1 text-xs text-gray-600">{`Open /${slug}`}</div>
//                 </div>
//             </Link>
//
//             {/* UPI + QR */}
//             <div className="border-t border-gray-100 bg-gray-50 p-4">
//                 <div className="flex items-start gap-4">
//                     <div className="rounded-xl bg-white p-2 border border-gray-200">
//                         <QRCodeSVG value={shareUrl || `${slug}`} size={88} />
//                     </div>
//
//                     <div className="min-w-0 flex-1">
//                         <div className="text-xs font-medium text-gray-600">Unique Product Identifier</div>
//
//                         <div className="mt-1 break-all font-mono text-[11px] text-gray-600">
//                             {shareUrl || "—"}
//                         </div>
//
//                         <div className="mt-2 flex flex-wrap gap-2">
//                             {shareUrl ? (
//                                 <>
//                                     <a
//                                         href={shareUrl}
//                                         target="_blank"
//                                         rel="noreferrer"
//                                         className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 hover:bg-gray-50"
//                                     >
//                                         Open
//                                     </a>
//
//                                     <button
//                                         type="button"
//                                         onClick={() => navigator.clipboard.writeText(shareUrl)}
//                                         className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 hover:bg-gray-50"
//                                     >
//                                         Copy
//                                     </button>
//                                 </>
//                             ) : null}
//
//                             <button
//                                 type="button"
//                                 onClick={() => window.print()}
//                                 className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 hover:bg-gray-50"
//                             >
//                                 Print
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//
// {/*                <div className="mt-3 text-[11px] text-gray-500">
//                     Nota: o QR só funciona noutros dispositivos se este URL estiver acessível (não “localhost”).
//                 </div>*/}
//             </div>
//         </div>
//     );
// }
//
