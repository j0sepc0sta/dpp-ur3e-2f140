import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const agreementId: string = body?.["dspace:agreementId"] ?? "";
  const assetId: string = body?.["dspace:assetId"] ?? "";

  if (!agreementId || !assetId) {
    return NextResponse.json(
      { error: "Missing dspace:agreementId or dspace:assetId" },
      { status: 400 }
    );
  }

  const parts = assetId.split("-");
  const scope = parts.pop() ?? "nameplate";
  const slug = parts.join("-");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  return NextResponse.json({
    "@type": "dspace:TransferProcess",
    "@id": randomUUID(),
    "dspace:state": "STARTED",
    "dspace:agreementId": agreementId,
    "dspace:assetId": assetId,
    "dspace:dataAddress": {
      "@type": "dspace:DataAddress",
      "dspace:endpointType": "https://w3id.org/idsa/v4.1/HTTP",
      "dspace:endpoint": `${baseUrl}/api/edc/${slug}?view=${scope}`,
      "dspace:endpointProperties": [
        {
          "@type": "dspace:EndpointProperty",
          "dspace:name": "authorization",
          "dspace:value": process.env.EDC_BACKEND_API_KEY ?? "",
        },
      ],
    },
  });
}