import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

const negotiations = new Map<string, any>();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const offerId: string =
    body?.["odrl:offer"]?.["@id"] ?? body?.offer?.["@id"] ?? "";

  if (!offerId) {
    return NextResponse.json(
      { error: "Missing odrl:offer @id" },
      { status: 400 }
    );
  }

  const negotiationId = randomUUID();
  const agreementId = randomUUID();

  const negotiation = {
    "@type": "dspace:ContractNegotiation",
    "@id": negotiationId,
    "dspace:agreementId": agreementId,
    "dspace:state": "FINALIZED",
    "dspace:offerId": offerId,
    createdAt: new Date().toISOString(),
  };

  negotiations.set(negotiationId, negotiation);

  return NextResponse.json(negotiation, { status: 201 });
}

export async function GET() {
  return NextResponse.json([...negotiations.values()]);
}