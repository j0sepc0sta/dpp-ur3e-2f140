import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const EDC_BASE = "http://localhost:19193/management";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "origin,content-type,accept,authorization,x-api-key",
    },
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const url = `${EDC_BASE}/${path.join("/")}${req.nextUrl.search}`;

  try {
    const res = await fetch(url, {
      headers: { "Accept": "application/json" }
    });
    const text = await res.text();
    return new NextResponse(text || "[]", {
      status: res.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: String(err) },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const body = await req.text();
  const url = `${EDC_BASE}/${path.join("/")}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: body || "{}",
    });

    const text = await res.text();

    return new NextResponse(text || "[]", {
      status: res.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: String(err) },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const url = `${EDC_BASE}/${path.join("/")}`;
  const res = await fetch(url, { method: "DELETE" });
  return new NextResponse(null, {
    status: res.status,
    headers: { "Access-Control-Allow-Origin": "*" },
  });
}