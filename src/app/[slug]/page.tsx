// src/app/[slug]/page.tsx
import { notFound } from "next/navigation";
import DppPassport from "@/components/DppPassport";
import { getProductBySlug } from "@/lib/products";

export const dynamic = "force-dynamic";

function fmtTechValue(r: any): string {
  const hasNum =
    r.value_num !== null && r.value_num !== undefined && r.value_num !== "";
  const unit = String(r.unit ?? "").trim();
  const std = String(r.standard_ref ?? "").trim();

  let base = "";
  if (hasNum) base = `${r.value_num}${unit ? ` ${unit}` : ""}`;
  else base = String(r.value_text ?? "").trim();

  if (!base) base = "—";
  if (std) base = `${base} (${std})`;
  return base;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) return notFound();

  const product: any = await getProductBySlug(slug);
  if (!product) return notFound();

  const actors = (product.supply_chain_actors ?? []).map((a: any) => ({
    id: String(a.actor_code ?? ""),
    name: String(a.name ?? ""),
    role: String(a.role ?? ""),
    website: a.website ?? null,
    country: a.country ?? null,
  }));

  const locations = (product.locations ?? []).map((l: any) => ({
    id: String(l.location_code ?? ""),
    name: String(l.name ?? ""),
    city: l.city ?? null,
    country: l.country ?? null,
    lat: l.lat !== null && l.lat !== undefined ? Number(l.lat) : null,
    lon: l.lon !== null && l.lon !== undefined ? Number(l.lon) : null,
  }));

  const actorById = new Map(actors.map((a: any) => [a.id, a]));
  const locById = new Map(locations.map((l: any) => [l.id, l]));

  const events = (product.trace_events ?? [])
    .map((e: any, idx: number) => {
      const actor = e.actor_code ? actorById.get(String(e.actor_code)) : null;
      const read = e.read_point_location_code
        ? locById.get(String(e.read_point_location_code))
        : null;
      const from = e.from_location_code
        ? locById.get(String(e.from_location_code))
        : null;
      const to = e.to_location_code
        ? locById.get(String(e.to_location_code))
        : null;

      return {
        id: String(e._id ?? idx),
        event_time:
          e.event_time instanceof Date
            ? e.event_time.toISOString()
            : String(e.event_time ?? ""),
        event_name: e.event_name ?? null,
        event_type: e.event_type ?? null,
        biz_step: e.biz_step ?? null,
        disposition: e.disposition ?? null,
        // AFTER
        actor_name: (actor as any)?.name ?? null,
        read_point: (read as any)?.name ?? null,
        from_location: (from as any)?.name ?? null,
        to_location: (to as any)?.name ?? null,
        related_product_label: e.related_product_global_id ?? null,
        notes: e.notes ?? null,
      };
    })
    .sort(
      (a: any, b: any) =>
        new Date(a.event_time).getTime() - new Date(b.event_time).getTime()
    );

  const traceability = { actors, locations, events };

  const digitalProductName: Record<string, string> = {
    Manufacturer: String(
      product?.digital_nameplate?.manufacturer_name ??
        product?.manufacturer_name ??
        ""
    ),
    "Model / Part": String(product?.model ?? ""),
    "Serial number": String(
      product?.digital_nameplate?.serial_number ??
        product?.serial_number ??
        ""
    ),
    "Year of construction": product?.digital_nameplate?.year_of_construction
      ? String(product.digital_nameplate.year_of_construction)
      : product?.year_of_construction
      ? String(product.year_of_construction)
      : "",
    "Product family": String(
      product?.digital_nameplate?.product_family ??
        product?.product_family ??
        ""
    ),
    "Country of origin": String(
      product?.digital_nameplate?.country_of_origin ??
        product?.country_of_origin ??
        ""
    ),
    "Global product identifier": String(product?.global_product_id ?? ""),
    Image: String(product?.image_uri ?? ""),
  };

  const carbonFootprint = (product.carbon_footprint ?? []).map((r: any) => ({
    footprint_kind: r.footprint_kind,
    lifecycle_stage: r.lifecycle_stage,
    emission_value: r.emission_value,
    unit: r.unit,
    standard: r.standard,
    boundary: r.boundary,
    reference_period_start: r.reference_period_start,
    reference_period_end: r.reference_period_end,
  }));

  const technicalData = (product.technical_properties ?? []).map((r: any) => ({
    type: String(r.area ?? "Other"),
    submodel: String(r.property_name ?? ""),
    content: fmtTechValue(r),
  }));

  const billOfMaterials = {
    components: (product.bom_components ?? []).map((r: any) => ({
      component_name: String(r.component_name ?? ""),
      quantity:
        r.quantity !== null && r.quantity !== undefined ? Number(r.quantity) : 1,
      unit: r.unit ?? null,
      linked_product: r.component_ref?.global_product_id ?? null,
      notes: r.notes ?? null,
    })),
    materials: (product.material_composition ?? []).map((r: any) => ({
      material: r.material,
      percentage: r.percentage,
      recycled_percentage: r.recycled_percentage,
      notes: r.notes ?? null,
    })),
  };

  const documentation = (product.documents ?? []).map((d: any) => ({
    category: d.category,
    title: d.title,
    language: d.language,
    version: d.version,
    issue_date: d.issue_date,
    uri: d.uri,
    mime_type: d.mime_type,
  }));

  const contactInformation = (product.contacts ?? []).map((c: any) => ({
    role_code: c.role_code ?? null,
    available_time: c.available_time ?? null,
    org_name: c.org_name ?? null,
    street: c.street ?? null,
    zipcode: c.zipcode ?? null,
    region: c.region ?? null,
    country: c.country ?? null,
    notes: c.notes ?? null,
    phones: c.phones ?? [],
    emails: c.emails ?? [],
    links: c.ip_communications ?? [],
    faxes: c.fax ?? [],
  }));

  const pcfValues = (product.carbon_footprint ?? [])
    .filter((r: any) => String(r.footprint_kind ?? "").toUpperCase() === "PCF")
    .map((r: any) =>
      r.emission_value === null || r.emission_value === undefined
        ? null
        : Number(r.emission_value)
    )
    .filter((n: any) => typeof n === "number" && !Number.isNaN(n));

  const kpis = {
    circularity_index: product?.circularity?.circularity_index ?? null,
    recyclability_rate: product?.circularity?.recyclability_rate ?? null,
    carbon_total: pcfValues.length
      ? {
          value: pcfValues.reduce((a: number, b: number) => a + b, 0),
          unit: String(product?.carbon_footprint?.[0]?.unit ?? "kg CO2e"),
        }
      : null,
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="mx-auto max-w-6xl">
        <DppPassport
          digitalProductName={digitalProductName}
          carbonFootprint={carbonFootprint}
          technicalData={technicalData}
          billOfMaterials={billOfMaterials}
          documentation={documentation}
          contactInformation={contactInformation}
          kpis={kpis}
          traceability={traceability}
          slug={slug}
        />
      </div>
    </main>
  );
}




// import { notFound } from "next/navigation";
// import DppPassport from "@/components/DppPassport";
// import { sqlForSlug } from "@/lib/db-by-slug";
// import { loadTableWithOptional } from "@/lib/db-utils";
//
// export const dynamic = "force-dynamic";
//
// function asString(v: any) {
//     return typeof v === "bigint" ? v.toString() : String(v ?? "");
// }
//
// function fmtTechValue(r: any): string {
//     const hasNum = r.value_num !== null && r.value_num !== undefined && r.value_num !== "";
//     const unit = String(r.unit ?? "").trim();
//     const std = String(r.standard_ref ?? "").trim();
//
//     let base = "";
//     if (hasNum) base = `${asString(r.value_num)}${unit ? ` ${unit}` : ""}`;
//     else base = String(r.value_text ?? "").trim();
//
//     if (!base) base = "—";
//     if (std) base = `${base} (${std})`;
//     return base;
// }
//
// export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
//     const { slug } = await params;
//     if (!slug) return notFound();
//
//     const sql = sqlForSlug(slug);
//
//     const [
//         tProducts,
//         tNameplate,
//         tCf,
//         tTech,
//         tBom,
//         tMat,
//         tDocs,
//         tContact,
//         tPhone,
//         tEmail,
//         tIp,
//         tFax,
//         tCirc,
//     ] = await Promise.all([
//         loadTableWithOptional(sql, "product", 500),
//         loadTableWithOptional(sql, "sm_digital_nameplate", 500),
//         loadTableWithOptional(sql, "sm_carbon_footprint", 2000),
//         loadTableWithOptional(sql, "sm_technical_property", 5000),
//         loadTableWithOptional(sql, "sm_bom_component", 2000),
//         loadTableWithOptional(sql, "sm_material_composition", 2000),
//         loadTableWithOptional(sql, "sm_document", 2000),
//         loadTableWithOptional(sql, "sm_contact", 500),
//         loadTableWithOptional(sql, "sm_contact_phone", 1000),
//         loadTableWithOptional(sql, "sm_contact_email", 1000),
//         loadTableWithOptional(sql, "sm_contact_ip_communication", 1000),
//         loadTableWithOptional(sql, "sm_contact_fax", 1000),
//         loadTableWithOptional(sql, "sm_circularity", 500),
//     ]);
//
//     const [tActors, tLocs, tEvents] = await Promise.all([
//         loadTableWithOptional(sql, "sm_supply_chain_actor", 500),
//         loadTableWithOptional(sql, "sm_location", 2000),
//         loadTableWithOptional(sql, "sm_trace_event", 5000),
//     ]);
//
//     const products = tProducts.rows ?? [];
//     if (!products.length) return notFound();
//
//     // resolver produto pelo slug (robusto)
//     const s = slug.toLowerCase();
//     const slugToModel: Record<string, string> = {
//         ur3e: "ur3e",
//         "2f-140": "2f-140",
//         "2f140": "2f-140",
//     };
//     const wantedModel = slugToModel[s] ?? s;
//
//     const product =
//         products.find((p: any) => String(p.model ?? "").toLowerCase() === wantedModel) ??
//         products.find((p: any) => String(p.global_product_id ?? "").toLowerCase().includes(s)) ??
//         (products.length === 1 ? products[0] : null);
//
//     if (!product) return notFound();
//
//     const productId = asString(product.id);
//
//     const nameplate = (tNameplate.rows ?? []).find((r: any) => asString(r.product_id) === productId) ?? null;
//     const cfRows = (tCf.rows ?? []).filter((r: any) => asString(r.product_id) === productId);
//     const techRows = (tTech.rows ?? []).filter((r: any) => asString(r.product_id) === productId);
//     const bomRows = (tBom.rows ?? []).filter((r: any) => asString(r.product_id) === productId);
//     const matRows = (tMat.rows ?? []).filter((r: any) => asString(r.product_id) === productId);
//     const docRows = (tDocs.rows ?? []).filter((r: any) => asString(r.product_id) === productId);
//
//     const circRow = (tCirc.rows ?? []).find((r: any) => asString(r.product_id) === productId) ?? null;
//
//     const contactRows = (tContact.rows ?? []).filter((r: any) => asString(r.product_id) === productId);
//     const phoneRows = tPhone.rows ?? [];
//     const emailRows = tEmail.rows ?? [];
//     const ipRows = tIp.rows ?? [];
//     const faxRows = tFax.rows ?? [];
//
//     const actors = (tActors.rows ?? []).map((a: any) => ({
//         id: String(a.id),
//         name: String(a.name ?? ""),
//         role: String(a.role ?? ""),
//         website: a.website ?? null,
//         country: a.country ?? null,
//     }));
//
//     const locations = (tLocs.rows ?? []).map((l: any) => ({
//         id: String(l.id),
//         name: String(l.name ?? ""),
//         city: l.city ?? null,
//         country: l.country ?? null,
//         lat: l.lat !== null && l.lat !== undefined ? Number(l.lat) : null,
//         lon: l.lon !== null && l.lon !== undefined ? Number(l.lon) : null,
//     }));
//
//     const actorById = new Map(actors.map((a) => [a.id, a]));
//     const locById = new Map(locations.map((l) => [l.id, l]));
//
//     const events = (tEvents.rows ?? [])
//         .filter((e: any) => String(e.product_id) === productId) // <-- ESTE filtro é crítico
//         .map((e: any) => {
//             const actor = e.actor_id ? actorById.get(String(e.actor_id)) : null;
//             const read = e.read_point_location_id ? locById.get(String(e.read_point_location_id)) : null;
//             const from = e.from_location_id ? locById.get(String(e.from_location_id)) : null;
//             const to = e.to_location_id ? locById.get(String(e.to_location_id)) : null;
//
//             return {
//                 id: String(e.id),
//                 event_time: String(e.event_time),
//                 event_name: e.event_name ?? null,
//                 event_type: e.event_type ?? null,
//                 biz_step: e.biz_step ?? null,
//                 disposition: e.disposition ?? null,
//                 actor_name: actor?.name ?? null,
//                 read_point: read?.name ?? null,
//                 from_location: from?.name ?? null,
//                 to_location: to?.name ?? null,
//                 related_product_label: e.related_product_global_id ?? null,
//                 notes: e.notes ?? null,
//             };
//         })
//         .sort((a: any, b: any) => new Date(a.event_time).getTime() - new Date(b.event_time).getTime());
//
//     const traceability = { actors, locations, events };
//
// // Debug rápido (remove depois)
//     console.log("TRACE:", { productId, actors: actors.length, locations: locations.length, events: events.length });
//
//
//     // mapa de produtos (para mostrar componentes linkados no BOM)
//     const productById = new Map<string, any>();
//     for (const p of products) productById.set(asString(p.id), p);
//
//     // -------- Digital Product Name (KV)
//     const imgFromProduct = product?.image_uri ?? product?.image;
//     const imgFromDocs =
//         (docRows ?? []).find((d: any) => String(d.mime_type ?? "").toLowerCase().startsWith("image/")) ??
//         (docRows ?? []).find((d: any) => String(d.category ?? "").toLowerCase() === "image");
//
//     const digitalProductName: Record<string, string> = {
//         Manufacturer: String(nameplate?.manufacturer_name ?? product?.manufacturer_name ?? ""),
//         "Model / Part": String(product?.model ?? ""),
//         "Serial number": String(nameplate?.serial_number ?? product?.serial_number ?? ""),
//         "Year of construction": nameplate?.year_of_construction
//             ? String(nameplate.year_of_construction)
//             : product?.year_of_construction
//                 ? String(product.year_of_construction)
//                 : "",
//         "Product family": String(nameplate?.product_family ?? product?.product_family ?? ""),
//         "Country of origin": String(nameplate?.country_of_origin ?? product?.country_of_origin ?? ""),
//         "Global product identifier": String(product?.global_product_id ?? ""),
//         Image: String(imgFromDocs?.uri ?? imgFromProduct ?? ""),
//     };
//
//     // -------- CarbonFootprint rows (para a tab)
//     const carbonFootprint = cfRows.map((r: any) => ({
//         footprint_kind: r.footprint_kind,
//         lifecycle_stage: r.lifecycle_stage,
//         emission_value: r.emission_value,
//         unit: r.unit,
//         standard: r.standard,
//         boundary: r.boundary,
//         reference_period_start: r.reference_period_start,
//         reference_period_end: r.reference_period_end,
//     }));
//
//     // -------- TechnicalData rows (para a tab)
//     const technicalData = techRows.map((r: any) => ({
//         type: String(r.area ?? "Other"),
//         submodel: String(r.property_name ?? ""),
//         content: fmtTechValue(r),
//     }));
//
//     // -------- BOM: componentes + materiais
//     const billOfMaterials = {
//         components: bomRows.map((r: any) => {
//             const q = r.quantity !== null && r.quantity !== undefined ? Number(r.quantity) : 1;
//             const unit = String(r.unit ?? "").trim();
//             const linked = r.component_product_id ? productById.get(asString(r.component_product_id)) : null;
//             const linkedLabel = linked ? `${linked.manufacturer_name ?? ""} ${linked.model ?? ""}`.trim() : "";
//             return {
//                 component_name: String(r.component_name ?? ""),
//                 quantity: q,
//                 unit: unit || null,
//                 linked_product: linkedLabel || null,
//                 notes: r.notes ?? null,
//             };
//         }),
//         materials: matRows.map((r: any) => ({
//             material: r.material,
//             percentage: r.percentage,
//             recycled_percentage: r.recycled_percentage,
//             notes: r.notes ?? null,
//         })),
//     };
//
//     // -------- Documentation
//     const documentation = docRows.map((d: any) => ({
//         category: d.category,
//         title: d.title,
//         language: d.language,
//         version: d.version,
//         issue_date: d.issue_date,
//         uri: d.uri,
//         mime_type: d.mime_type,
//     }));
//
//     // -------- Contact Information (agrupado por contacto)
//     const contactInformation = contactRows.map((c: any) => {
//         const cid = asString(c.id);
//         return {
//             role_code: c.role_code ?? null,
//             available_time: c.available_time ?? null,
//             org_name: c.org_name ?? null,
//             street: c.street ?? null,
//             zipcode: c.zipcode ?? null,
//             region: c.region ?? null,
//             country: c.country ?? null,
//             notes: c.notes ?? null,
//             phones: phoneRows
//                 .filter((p: any) => asString(p.contact_id) === cid)
//                 .map((p: any) => ({ phone_number: p.phone_number, phone_type_code: p.phone_type_code })),
//             emails: emailRows
//                 .filter((e: any) => asString(e.contact_id) === cid)
//                 .map((e: any) => ({ email_address: e.email_address, email_type_code: e.email_type_code })),
//             links: ipRows
//                 .filter((x: any) => asString(x.contact_id) === cid)
//                 .map((x: any) => ({ link: x.link, channel_type: x.channel_type })),
//             faxes: faxRows
//                 .filter((f: any) => asString(f.contact_id) === cid)
//                 .map((f: any) => ({ fax_number: f.fax_number, fax_type_code: f.fax_type_code })),
//         };
//     });
//
//     // -------- KPIs (opcional, mas útil)
//     const kpis = {
//         circularity_index: circRow?.circularity_index ?? null,
//         recyclability_rate: circRow?.recyclability_rate ?? null,
//         carbon_total: (() => {
//             const pcf = cfRows.filter((r: any) => String(r.footprint_kind ?? "").toUpperCase() === "PCF");
//             const values = pcf
//                 .map((r: any) => (r.emission_value === null || r.emission_value === undefined ? null : Number(r.emission_value)))
//                 .filter((n: any) => typeof n === "number" && !Number.isNaN(n));
//             if (!values.length) return null;
//             const unit = String(pcf[0]?.unit ?? "kg CO2e");
//             return { value: values.reduce((a: number, b: number) => a + b, 0), unit };
//         })(),
//     };
//
//     return (
//         <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
//             <div className="mx-auto max-w-6xl">
//                 <DppPassport
//                     digitalProductName={digitalProductName}
//                     carbonFootprint={carbonFootprint}
//                     technicalData={technicalData}
//                     billOfMaterials={billOfMaterials}
//                     documentation={documentation}
//                     contactInformation={contactInformation}
//                     kpis={kpis}
//                     traceability={traceability}
//                 />
//             </div>
//         </main>
//     );
// }
