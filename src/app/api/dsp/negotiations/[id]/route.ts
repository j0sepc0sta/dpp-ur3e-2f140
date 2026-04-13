import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({
    "@type": "dspace:ContractNegotiation",
    "@id": id,
    "dspace:state": "FINALIZED",
  });
}