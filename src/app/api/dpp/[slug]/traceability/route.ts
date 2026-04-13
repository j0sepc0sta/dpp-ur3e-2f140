// src/app/api/edc/[slug]/route.ts
// The EDC data plane calls these endpoints after a contract is agreed.
// Each ?view= parameter maps to one ODRL policy scope.

import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/products";

export const dynamic = "force-dynamic";

const EDC_API_KEY = process.env.EDC_BACKEND_API_KEY ?? "";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  // Validate that the request comes from our own EDC connector
  const authHeader = req.headers.get("x-api-key") ?? "";
  if (EDC_API_KEY && authHeader !== EDC_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const view = req.nextUrl.searchParams.get("view") ?? "full";
  const product: any = await getProductBySlug(slug);

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Return only the subset the policy permits
  switch (view) {
    case "carbon":
      return NextResponse.json({
        global_product_id: product.global_product_id,
        model: product.model,
        carbon_footprint: product.carbon_footprint ?? [],
        circularity: product.circularity ?? null,
      });

    case "bom":
      return NextResponse.json({
        global_product_id: product.global_product_id,
        model: product.model,
        bom_components: product.bom_components ?? [],
        material_composition: product.material_composition ?? [],
      });

    case "traceability":
      return NextResponse.json({
        global_product_id: product.global_product_id,
        model: product.model,
        supply_chain_actors: product.supply_chain_actors ?? [],
        locations: product.locations ?? [],
        trace_events: product.trace_events ?? [],
      });

    case "nameplate":
      return NextResponse.json({
        global_product_id: product.global_product_id,
        model: product.model,
        manufacturer_name: product.manufacturer_name,
        digital_nameplate: product.digital_nameplate ?? {},
      });

    case "full":
    default:
      // Remove internal Mongo fields before sharing
      const { _id, __v, ...safe } = product;
      return NextResponse.json(safe);
  }
}