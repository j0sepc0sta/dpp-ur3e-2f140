import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const base = process.env.NEXT_PUBLIC_BASE_URL
    ?? "https://dpp-ur3e-grippers-mongodb-claude.vercel.app";
  const domain = new URL(base).hostname;

  return NextResponse.json({
    "@context": ["https://www.w3.org/ns/did/v1"],
    "id": `did:web:${domain}`,
    "verificationMethod": [{
      "id": `did:web:${domain}#key-1`,
      "type": "JsonWebKey2020",
      "controller": `did:web:${domain}`,
      "publicKeyJwk": {
        "kty": "EC",
        "crv": "P-256",
        "use": "sig",
        "kid": "key-1"
      }
    }],
    "authentication": [`did:web:${domain}#key-1`],
    "service": [
      {
        "id": `did:web:${domain}#dsp`,
        "type": "DataspaceConnector",
        "serviceEndpoint": `${base}/api/dsp`
      },
      {
        "id": `did:web:${domain}#catalog`,
        "type": "dcat:Catalog",
        "serviceEndpoint": `${base}/api/dsp/catalog/request`
      }
    ]
  });
}