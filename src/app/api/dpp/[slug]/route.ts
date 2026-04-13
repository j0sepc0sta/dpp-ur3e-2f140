// src/app/api/dpp/[slug]/route.ts
import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({
    global_product_id: product.global_product_id,
    manufacturer_name: product.manufacturer_name,
    model: product.model,
    passport: {
      digital_nameplate: product.digital_nameplate ?? null,
      technical_properties: product.technical_properties ?? [],
      bom_components: product.bom_components ?? [],
      material_composition: product.material_composition ?? [],
      documents: product.documents ?? [],
      contacts: product.contacts ?? [],
      carbon_footprint: product.carbon_footprint ?? [],
      circularity: product.circularity ?? null,
      trace_events: product.trace_events ?? [],
      locations: product.locations ?? [],
      supply_chain_actors: product.supply_chain_actors ?? [],
    },
    shared_at: new Date().toISOString(),
  });
}