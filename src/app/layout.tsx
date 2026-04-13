import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digital Product Passport",
  description:
    "Digital Product Passport system compliant with EU Ecodesign for Sustainable Products Regulation (ESPR). Powered by Eclipse Data Space Connector.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`} style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
        {/* Top institutional bar */}
        <div className="bg-[#003399] text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5">
            <div className="flex items-center gap-2 text-[11px] tracking-wide opacity-90">
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" className="opacity-80">
                <circle cx="8" cy="6" r="4" stroke="#FFD617" strokeWidth="1" fill="none"/>
                {[...Array(12)].map((_, i) => {
                                  const angle = (i * 30 - 90) * Math.PI / 180;
                                  const x = 8 + 4 * Math.cos(angle);
                                  const y = 6 + 4 * Math.sin(angle);
                                  return <circle key={i} cx={x} cy={y} r="0.6" fill="#FFD617"/>;
                                })}
                              </svg>
                            </div>
                          </div>
                        </div>

        {/* Main header */}
        <header className="sticky top-0 z-50 border-b border-[#d0d7e3] bg-white/95 backdrop-blur-sm shadow-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
            <a href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#003399] shadow-sm">
                <span className="text-[#FFD617] text-xs font-bold">DPP</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-[#1a2a4a] tracking-tight">
                  Digital Product Passport
                </div>
                <div className="text-[10px] text-[#6b7c99] tracking-wide">
                   DataSpace Ecosystem
                </div>
              </div>
            </a>
            <div className="flex items-center gap-3">
              <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                DataSpace Active
              </span>
              <a
                href="http://localhost:4200/catalog"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-[#d0d7e3] bg-white px-3 py-1.5 text-xs font-medium text-[#1a2a4a] hover:bg-[#f0f4fa] transition shadow-sm"
              >
                EDC Dashboard ↗
              </a>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-90px)] bg-[#f5f7fb]">{children}</main>

        {/* Footer */}
        <footer className="border-t border-[#d0d7e3] bg-white">
          <div className="mx-auto max-w-7xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="text-[11px] text-[#8896ad]">
              Digital Product Passport — Proof of Concept
            </div>
            <div className="flex items-center gap-4 text-[11px] text-[#8896ad]">
              <span>Eclipse EDC</span>
              <span className="text-[#d0d7e3]">·</span>
              <span>MinimumViableDataspace</span>
              <span className="text-[#d0d7e3]">·</span>
              <span>EDC Dashboard</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}



// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import "leaflet/dist/leaflet.css";
//
// const inter = Inter({
//   variable: "--font-inter",
//   subsets: ["latin"],
// });
//
// export const metadata: Metadata = {
//   title: "Digital Product Passport — Gaia-X DataSpace",
//   description:
//     "Sovereign data sharing for industrial product passports, powered by Eclipse EDC and Gaia-X.",
// };
//
// export default function RootLayout({
//   children,
// }: Readonly<{ children: React.ReactNode }>) {
//   return (
//     <html lang="en">
//       <body className={`${inter.variable} antialiased bg-gray-50 text-gray-900`}>
//         {/* Top bar */}
//         <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
//           <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
//             <a href="/" className="flex items-center gap-2.5">
//               <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white text-xs font-bold">
//                 DPP
//               </div>
//               <span className="text-sm font-semibold tracking-tight">
//                 Digital Product Passport
//               </span>
//             </a>
//             <div className="flex items-center gap-3">
//               <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
//                 <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
//                 DataSpace Connected
//               </span>
//               <a
//                 href="http://localhost:4200/catalog"
//                 target="_blank"
//                 rel="noreferrer"
//                 className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
//               >
//                 EDC Dashboard ↗
//               </a>
//             </div>
//           </div>
//         </header>
//         <main className="min-h-[calc(100vh-57px)]">{children}</main>
//       </body>
//     </html>
//   );
// }
