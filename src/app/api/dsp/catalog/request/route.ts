import { NextRequest, NextResponse } from "next/server";
import { getAllProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const products = await getAllProducts();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  const dataset = products.flatMap((p: any) => {
    const slug = String(p.model ?? "").toLowerCase().replace(/\s+/g, "-");
    const scopes = ["nameplate", "carbon", "bom", "traceability"];

    return scopes.map((scope) => ({
      "@type": "dcat:Dataset",
      "@id": `${slug}-${scope}`,
      "dct:title": `${p.manufacturer_name ?? ""} ${p.model ?? ""} — ${scope}`,
      "dpp:model": p.model,
      "dpp:scope": scope,
      "dpp:globalProductId": p.global_product_id ?? "",
      "odrl:hasPolicy": {
        "@id": `policy-${slug}-${scope}`,
        "@type": "odrl:Offer",
        "odrl:permission": {
          "odrl:action": "odrl:use",
          "odrl:constraint": {
            "odrl:leftOperand": "dpp:scope",
            "odrl:operator": "odrl:eq",
            "odrl:rightOperand": scope,
          },
        },
      },
      "dcat:distribution": {
        "@type": "dcat:Distribution",
        "dct:format": "HttpData-PULL",
        "dcat:accessService": `${baseUrl}/api/dsp/dataservice`,
      },
    }));
  });

  return NextResponse.json({
    "@context": {
      "@vocab": "https://w3id.org/dspace/v0.8/",
      "dcat": "http://www.w3.org/ns/dcat#",
      "dct": "http://purl.org/dc/terms/",
      "odrl": "http://www.w3.org/ns/odrl/2/",
      "dpp": "https://w3id.org/dpp/v1/",
    },
    "@type": "dcat:Catalog",
    "@id": `${baseUrl}/api/dsp/catalog`,
    "dct:title": "DPP UR3e & Grippers DataSpace Catalog",
    "dcat:dataset": dataset,
  });
}