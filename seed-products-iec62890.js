// seed-products-iec62890.js
// Run: npm install mongodb   (if not already installed)
// Then: node seed-products-iec62890.js
// Updates existing UR3e + 2F-140 with IEC 62890 fields, adds 4 new robots

const { MongoClient } = require("mongodb");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://josepedrocosta17_db_user:josepedrocosta17_db_user@teste-dpp40-ur3e-2f-140.u4oe7dq.mongodb.net/dpp?appName=teste-dpp40-ur3e-2f-140&retryWrites=true&w=majority";
const DB_NAME = "dpp";
const COLLECTION = "products";

// ─── IEC 62890 lifecycle template ──────────────────────────
function lifecycle(phase, notes) {
  return {
    standard: "IEC 62890:2020",
    asset_kind_note: "Lifecycle management per IEC 62890 — type vs. instance distinction derived from RAMI 4.0",
    phases: {
      development:  { status: phase === "development"  ? "active" : "completed", notes: "" },
      production:   { status: phase === "production"   ? "active" : (["usage","maintenance","end_of_life"].includes(phase) ? "completed" : "planned"), notes: "" },
      usage:        { status: phase === "usage"        ? "active" : (["maintenance","end_of_life"].includes(phase) ? "completed" : "planned"), notes: notes || "" },
      maintenance:  { status: phase === "maintenance"  ? "active" : (phase === "end_of_life" ? "completed" : "planned"), notes: "" },
      end_of_life:  { status: phase === "end_of_life"  ? "active" : "planned", notes: "" }
    },
    current_phase: phase
  };
}

// ─── AAS reference template ───────────────────────────────
function aasRef(globalId, aasId, submodels) {
  return {
    standard: "IEC 63278 (Asset Administration Shell)",
    globalAssetId: globalId,
    aas_identifier: aasId,
    submodel_references: submodels || [
      "DigitalNameplate (IDTA 02006-2-0)",
      "TechnicalData (IDTA 02003-1-2)",
      "CarbonFootprint (IDTA 02023-0-9)",
      "BillOfMaterials",
      "Documentation (IDTA 02004-1-2)",
      "ContactInformation (IDTA 02002-1-0)"
    ]
  };
}

// ═══════════════════════════════════════════════════════════
// IEC 62890 update fields for EXISTING UR3e
// ═══════════════════════════════════════════════════════════
const ur3eUpdate = {
  asset_kind: "Instance",
  lifecycle: lifecycle("usage", "Deployed at IPB robotics laboratory for education and research"),
  aas_reference: aasRef(
    "https://dpp-ur3e-2f140.vercel.app/ur3e",
    "aas:dpp:ur3e:SN-UR3-2019-001",
    [
      "DigitalNameplate (IDTA 02006-2-0)",
      "TechnicalData (IDTA 02003-1-2)",
      "CarbonFootprint (IDTA 02023-0-9)",
      "BillOfMaterials",
      "Documentation (IDTA 02004-1-2)",
      "ContactInformation (IDTA 02002-1-0)",
      "Traceability"
    ]
  ),
  iec62890_type_reference: {
    type_product_id: "UR3e",
    type_manufacturer: "Universal Robots",
    type_description: "UR3e collaborative robot arm — reference type asset"
  }
};

// ═══════════════════════════════════════════════════════════
// IEC 62890 update fields for EXISTING 2F-140
// ═══════════════════════════════════════════════════════════
const f140Update = {
  asset_kind: "Instance",
  lifecycle: lifecycle("usage", "Mounted on UR3e at IPB robotics laboratory"),
  aas_reference: aasRef(
    "https://dpp-ur3e-2f140.vercel.app/2f-140",
    "aas:dpp:2f140:SN-2F140-2020-001",
    [
      "DigitalNameplate (IDTA 02006-2-0)",
      "TechnicalData (IDTA 02003-1-2)",
      "CarbonFootprint (IDTA 02023-0-9)",
      "BillOfMaterials",
      "Documentation (IDTA 02004-1-2)",
      "ContactInformation (IDTA 02002-1-0)",
      "Traceability"
    ]
  ),
  iec62890_type_reference: {
    type_product_id: "2F-140",
    type_manufacturer: "Robotiq",
    type_description: "2F-140 adaptive parallel gripper — reference type asset"
  }
};

// ═══════════════════════════════════════════════════════════
// NEW PRODUCT 1: Second UR3e instance
// ═══════════════════════════════════════════════════════════
const ur3e2 = {
  kind: "Instance",
  asset_kind: "Instance",
  global_product_id: "https://dpp-ur3e-2f140.vercel.app/ur3e-2",
  manufacturer_name: "Universal Robots",
  model: "UR3e-2",
  serial_number: "SN-UR3-2021-002",
  year_of_construction: 2021,
  product_family: "UR e-Series",
  country_of_origin: "Denmark",
  image_uri: "ur3e.webp",
  lifecycle: lifecycle("usage", "Deployed at IPB robotics laboratory — second unit for parallel workstation"),
  aas_reference: aasRef("https://dpp-ur3e-2f140.vercel.app/ur3e-2", "aas:dpp:ur3e:SN-UR3-2021-002"),
  iec62890_type_reference: { type_product_id: "UR3e", type_manufacturer: "Universal Robots", type_description: "UR3e collaborative robot arm — reference type asset" },
  digital_nameplate: { manufacturer_name: "Universal Robots A/S", manufacturer_product_designation: "UR3e Collaborative Robot (Unit 2)", serial_number: "SN-UR3-2021-002", year_of_construction: 2021, product_family: "UR e-Series", country_of_origin: "Denmark", marking_ce: true, marking_ip: "IP54" },
  bom_components: [
    { component_name: "Base joint module", quantity: 1, unit: "pcs", notes: "Integrated servo + encoder" },
    { component_name: "Shoulder joint module", quantity: 1, unit: "pcs", notes: "High-torque actuator" },
    { component_name: "Elbow joint module", quantity: 1, unit: "pcs", notes: "Compact geared motor" },
    { component_name: "Wrist 1 joint module", quantity: 1, unit: "pcs", notes: "Precision drive" },
    { component_name: "Wrist 2 joint module", quantity: 1, unit: "pcs", notes: "Precision drive" },
    { component_name: "Wrist 3 joint module + tool flange", quantity: 1, unit: "pcs", notes: "ISO 9409-1 flange" },
    { component_name: "UR Control Box (CB5)", quantity: 1, unit: "pcs", notes: "Integrated controller" },
    { component_name: "Teach Pendant", quantity: 1, unit: "pcs", notes: "12-inch touchscreen" }
  ],
  carbon_footprint: [
    { footprint_kind: "PCF", lifecycle_stage: "A1-A3 (Production)", emission_value: 320, unit: "kg CO2e", standard: "ISO 14067:2018", boundary: "Cradle-to-gate" },
    { footprint_kind: "PCF", lifecycle_stage: "B6 (Use phase energy)", emission_value: 95, unit: "kg CO2e/year", standard: "ISO 14067:2018", boundary: "Operational energy" },
    { footprint_kind: "PCF", lifecycle_stage: "C1-C4 (End of life)", emission_value: 18, unit: "kg CO2e", standard: "ISO 14067:2018", boundary: "Disposal + recycling" }
  ],
  circularity: { recyclability_rate: 0.85, recycled_content: 0.30, reused_content: 0.0, repairability_score: 8.5, circularity_index: 0.72, notes: "Modular joint design enables individual joint replacement." },
  contacts: [{ role_code: "manufacturer", org_name: "Universal Robots A/S", country: "Denmark", emails: [{ email_address: "support@universal-robots.com" }], phones: [{ phone_number: "+45 8993 8989" }] }],
  documents: [
    { category: "User Manual", title: "UR3e User Manual", language: "en", version: "5.19", uri: "https://www.universal-robots.com/download/manuals-e-series/user/ur3e/", mime_type: "application/pdf" }
  ],
  material_composition: [
    { material: "Aluminium alloy (6061-T6)", percentage: 55, recycled_percentage: 30 },
    { material: "Steel (stainless / structural)", percentage: 20, recycled_percentage: 35 },
    { material: "Polymer / plastics (PA, ABS)", percentage: 10, recycled_percentage: 5 },
    { material: "Copper (wiring, motors)", percentage: 8, recycled_percentage: 20 },
    { material: "Electronics (PCBs, sensors)", percentage: 5, recycled_percentage: 0 },
    { material: "Rare earth magnets (NdFeB)", percentage: 2, recycled_percentage: 0 }
  ],
  technical_properties: [
    { area: "General", property_name: "Number of axes", value_num: 6, unit: "" },
    { area: "General", property_name: "Payload", value_num: 3, unit: "kg" },
    { area: "General", property_name: "Reach", value_num: 500, unit: "mm" },
    { area: "General", property_name: "Weight", value_num: 11.2, unit: "kg" },
    { area: "Performance", property_name: "Repeatability", value_num: 0.03, unit: "mm" },
    { area: "Safety", property_name: "Collaborative operation", value_text: "ISO 10218-1, ISO/TS 15066" },
    { area: "Communication", property_name: "Interfaces", value_text: "Ethernet, Modbus TCP, PROFINET, EtherNet/IP" },
    { area: "Programming", property_name: "Language", value_text: "URScript, Polyscope" }
  ],
  supply_chain_actors: [
    { actor_code: "ACT-UR", name: "Universal Robots A/S", role: "Manufacturer", website: "https://www.universal-robots.com", country: "Denmark" },
    { actor_code: "ACT-IPB", name: "Instituto Politécnico de Bragança", role: "End User", website: "https://www.ipb.pt", country: "Portugal" }
  ],
  locations: [
    { location_code: "LOC-UR-DK", actor_code: "ACT-UR", name: "Universal Robots HQ", city: "Odense", country: "Denmark", lat: 55.396, lon: 10.390 },
    { location_code: "LOC-IPB", actor_code: "ACT-IPB", name: "IPB Campus", city: "Bragança", country: "Portugal", lat: 41.794, lon: -6.765 }
  ],
  trace_events: [
    { event_time: "2021-03-15T10:00:00Z", event_type: "production", biz_step: "commissioning", disposition: "active", actor_code: "ACT-UR", event_name: "Robot manufactured", notes: "Factory acceptance test passed" },
    { event_time: "2021-06-10T09:00:00Z", event_type: "receiving", biz_step: "receiving", disposition: "active", actor_code: "ACT-IPB", event_name: "Received at IPB", notes: "Second UR3e unit installed in robotics lab" }
  ]
};

// ═══════════════════════════════════════════════════════════
// NEW PRODUCT 2: ABB IRB 1400
// ═══════════════════════════════════════════════════════════
const irb1400 = {
  kind: "Instance", asset_kind: "Instance",
  global_product_id: "https://dpp-ur3e-2f140.vercel.app/irb-1400",
  manufacturer_name: "ABB", model: "IRB 1400",
  serial_number: "SN-IRB1400-2001-001", year_of_construction: 2001,
  product_family: "IRB Industrial Robots", country_of_origin: "Sweden", image_uri: "irb-1400.webp",
  lifecycle: lifecycle("usage", "Deployed at IPB industrial automation laboratory for welding and material handling education"),
  aas_reference: aasRef("https://dpp-ur3e-2f140.vercel.app/irb-1400", "aas:dpp:irb1400:SN-IRB1400-2001-001"),
  iec62890_type_reference: { type_product_id: "IRB 1400", type_manufacturer: "ABB", type_description: "IRB 1400 — 6-axis industrial robot for arc welding, assembly, material handling" },
  digital_nameplate: { manufacturer_name: "ABB Robotics", manufacturer_product_designation: "IRB 1400 Industrial Robot", serial_number: "SN-IRB1400-2001-001", year_of_construction: 2001, product_family: "IRB Industrial Robots", country_of_origin: "Sweden", marking_ce: true, marking_ip: "IP30 (Class D)" },
  bom_components: [
    { component_name: "Base frame (cast iron)", quantity: 1, unit: "pcs", notes: "620 x 450 mm footprint" },
    { component_name: "Axis 1-3 drive units", quantity: 3, unit: "pcs", notes: "Servo motor + harmonic/cycloidal reducers" },
    { component_name: "Axis 4-6 wrist drive units", quantity: 3, unit: "pcs", notes: "Wrist servo motors, axis 6 continuous rotation" },
    { component_name: "Upper arm assembly", quantity: 1, unit: "pcs", notes: "18 kg supplementary load capacity, integrated signals + air" },
    { component_name: "S4C+ Controller cabinet", quantity: 1, unit: "pcs", notes: "ABB S4C+ with RAPID programming" },
    { component_name: "Teach Pendant", quantity: 1, unit: "pcs", notes: "ABB TPU2" }
  ],
  carbon_footprint: [
    { footprint_kind: "PCF", lifecycle_stage: "A1-A3 (Production)", emission_value: 1800, unit: "kg CO2e", standard: "ISO 14067:2018", boundary: "Cradle-to-gate" },
    { footprint_kind: "PCF", lifecycle_stage: "B6 (Use phase energy)", emission_value: 450, unit: "kg CO2e/year", standard: "ISO 14067:2018", boundary: "Operational energy (4 kVA rated)" },
    { footprint_kind: "PCF", lifecycle_stage: "C1-C4 (End of life)", emission_value: 120, unit: "kg CO2e", standard: "ISO 14067:2018", boundary: "Disposal + recycling" }
  ],
  circularity: { recyclability_rate: 0.90, recycled_content: 0.40, reused_content: 0.0, repairability_score: 7.0, circularity_index: 0.68, notes: "Heavy steel/cast iron is highly recyclable. Legacy system with limited spare parts." },
  contacts: [{ role_code: "manufacturer", org_name: "ABB Robotics", country: "Sweden", emails: [{ email_address: "robotics@abb.com" }], phones: [{ phone_number: "+46 21 325 000" }] }],
  documents: [
    { category: "Product Specification", title: "IRB 1400 Product Specification", language: "en", version: "Rev E", uri: "https://library.e.abb.com/public/21c32e5bcd2708c5c12576cb00528e5d/3HAC9376-1_revE_en_library.pdf", mime_type: "application/pdf" }
  ],
  material_composition: [
    { material: "Cast iron / steel", percentage: 60, recycled_percentage: 45 },
    { material: "Aluminium alloy", percentage: 15, recycled_percentage: 30 },
    { material: "Copper (motors, wiring)", percentage: 10, recycled_percentage: 20 },
    { material: "Polymer / rubber", percentage: 5, recycled_percentage: 0 },
    { material: "Electronics (PCBs, encoders)", percentage: 5, recycled_percentage: 0 },
    { material: "Lubricants + rare earth magnets", percentage: 5, recycled_percentage: 0 }
  ],
  technical_properties: [
    { area: "General", property_name: "Number of axes", value_num: 6, unit: "" },
    { area: "General", property_name: "Payload", value_num: 5, unit: "kg" },
    { area: "General", property_name: "Supplementary load (axis 3)", value_num: 18, unit: "kg" },
    { area: "General", property_name: "Reach", value_num: 1440, unit: "mm" },
    { area: "General", property_name: "Weight", value_num: 225, unit: "kg" },
    { area: "Performance", property_name: "Position repeatability", value_num: 0.05, unit: "mm" },
    { area: "Performance", property_name: "Max TCP velocity", value_num: 2.1, unit: "m/s" },
    { area: "Electrical", property_name: "Supply voltage", value_text: "200-600 V, 50/60 Hz" },
    { area: "Electrical", property_name: "Rated power", value_num: 4, unit: "kVA" },
    { area: "Environment", property_name: "Ambient temperature", value_text: "5 - 45 °C" },
    { area: "Environment", property_name: "Noise level", value_text: "Max. 70 dB(A)" },
    { area: "Mounting", property_name: "Installation", value_text: "Floor, base 620 x 450 mm" },
    { area: "Controller", property_name: "Controller", value_text: "S4C+" },
    { area: "Programming", property_name: "Language", value_text: "RAPID" },
    { area: "Applications", property_name: "Primary applications", value_text: "Arc welding, assembly, material handling, glueing/sealing" }
  ],
  supply_chain_actors: [
    { actor_code: "ACT-ABB", name: "ABB Robotics", role: "Manufacturer", website: "https://new.abb.com/products/robotics", country: "Sweden" },
    { actor_code: "ACT-IPB", name: "Instituto Politécnico de Bragança", role: "End User", website: "https://www.ipb.pt", country: "Portugal" }
  ],
  locations: [
    { location_code: "LOC-ABB-SE", actor_code: "ACT-ABB", name: "ABB Robotics HQ", city: "Västerås", country: "Sweden", lat: 59.611, lon: 16.545 },
    { location_code: "LOC-IPB", actor_code: "ACT-IPB", name: "IPB Campus", city: "Bragança", country: "Portugal", lat: 41.794, lon: -6.765 }
  ],
  trace_events: [
    { event_time: "2001-06-01T08:00:00Z", event_type: "production", biz_step: "commissioning", disposition: "active", actor_code: "ACT-ABB", event_name: "Robot manufactured", notes: "Produced at ABB Västerås factory" },
    { event_time: "2005-09-15T10:00:00Z", event_type: "receiving", biz_step: "receiving", disposition: "active", actor_code: "ACT-IPB", event_name: "Installed at IPB", notes: "Acquired for industrial automation laboratory" }
  ]
};

// ═══════════════════════════════════════════════════════════
// NEW PRODUCT 3: Dobot Magician
// ═══════════════════════════════════════════════════════════
const dobotMagician = {
  kind: "Instance", asset_kind: "Instance",
  global_product_id: "https://dpp-ur3e-2f140.vercel.app/dobot-magician",
  manufacturer_name: "Dobot", model: "Dobot Magician",
  serial_number: "SN-MAGICIAN-2020-001", year_of_construction: 2020,
  product_family: "Dobot Education Series", country_of_origin: "China", image_uri: "dobot-magician.webp",
  lifecycle: lifecycle("usage", "Deployed at IPB for STEM education and introductory robotics"),
  aas_reference: aasRef("https://dpp-ur3e-2f140.vercel.app/dobot-magician", "aas:dpp:magician:SN-MAGICIAN-2020-001"),
  iec62890_type_reference: { type_product_id: "Dobot Magician", type_manufacturer: "Dobot", type_description: "4-axis desktop educational robot arm with interchangeable end effectors" },
  digital_nameplate: { manufacturer_name: "Shenzhen Yuejiang Technology Co., Ltd. (Dobot)", manufacturer_product_designation: "Dobot Magician Desktop Robot Arm", serial_number: "SN-MAGICIAN-2020-001", year_of_construction: 2020, product_family: "Dobot Education Series", country_of_origin: "China", marking_ce: true },
  bom_components: [
    { component_name: "Base unit with stepper motor (J1)", quantity: 1, unit: "pcs", notes: "±90°, 320°/s" },
    { component_name: "Rear arm with stepper motor (J2)", quantity: 1, unit: "pcs", notes: "0° to 85°" },
    { component_name: "Forearm with stepper motor (J3)", quantity: 1, unit: "pcs", notes: "-10° to 95°" },
    { component_name: "Rotation servo (J4)", quantity: 1, unit: "pcs", notes: "±90°, 480°/s" },
    { component_name: "Integrated controller board", quantity: 1, unit: "pcs", notes: "ARM Cortex" },
    { component_name: "12V / 7A power supply", quantity: 1, unit: "pcs", notes: "60 W max" },
    { component_name: "Suction cup end effector", quantity: 1, unit: "pcs" },
    { component_name: "Gripper end effector", quantity: 1, unit: "pcs" },
    { component_name: "3D printing head", quantity: 1, unit: "pcs", notes: "PLA filament" },
    { component_name: "Pen holder", quantity: 1, unit: "pcs" },
    { component_name: "Laser engraver module", quantity: 1, unit: "pcs", notes: "405 nm" }
  ],
  carbon_footprint: [
    { footprint_kind: "PCF", lifecycle_stage: "A1-A3 (Production)", emission_value: 25, unit: "kg CO2e", standard: "ISO 14067:2018", boundary: "Cradle-to-gate" },
    { footprint_kind: "PCF", lifecycle_stage: "B6 (Use phase energy)", emission_value: 8, unit: "kg CO2e/year", standard: "ISO 14067:2018", boundary: "Operational energy" }
  ],
  circularity: { recyclability_rate: 0.75, recycled_content: 0.15, reused_content: 0.0, repairability_score: 6.0, circularity_index: 0.55, notes: "Aluminium body recyclable. ABS plastic less recyclable. Modular end effectors reusable." },
  contacts: [{ role_code: "manufacturer", org_name: "Shenzhen Yuejiang Technology Co., Ltd.", country: "China", emails: [{ email_address: "support@dobot.cc" }] }],
  documents: [{ category: "Datasheet", title: "Dobot Magician Specifications", language: "en", version: "2020", uri: "https://www.robotlab.com/hubfs/Dobot/Dobot%20Magician%20Specifications.pdf", mime_type: "application/pdf" }],
  material_composition: [
    { material: "Aluminium alloy 6061", percentage: 50, recycled_percentage: 15 },
    { material: "ABS engineering plastic", percentage: 25, recycled_percentage: 5 },
    { material: "Steel (fasteners, shafts)", percentage: 10, recycled_percentage: 30 },
    { material: "Copper (motors, wiring)", percentage: 8, recycled_percentage: 10 },
    { material: "Electronics (PCBs, sensors)", percentage: 7, recycled_percentage: 0 }
  ],
  technical_properties: [
    { area: "General", property_name: "Number of axes", value_num: 4, unit: "" },
    { area: "General", property_name: "Payload", value_num: 0.5, unit: "kg" },
    { area: "General", property_name: "Reach", value_num: 320, unit: "mm" },
    { area: "General", property_name: "Weight", value_num: 3.4, unit: "kg" },
    { area: "Performance", property_name: "Repeatability", value_num: 0.2, unit: "mm" },
    { area: "Electrical", property_name: "Power", value_text: "100-240 V AC → 12 V / 7 A DC, 60 W max" },
    { area: "Communication", property_name: "Interfaces", value_text: "USB, WiFi, Bluetooth" },
    { area: "Mounting", property_name: "Installation", value_text: "Desktop, 158 × 158 mm footprint" },
    { area: "Programming", property_name: "Software", value_text: "DobotStudio, DobotBlockly, Python SDK" },
    { area: "End effectors", property_name: "Tools", value_text: "Gripper, suction cup, 3D printer, laser, pen holder" }
  ],
  supply_chain_actors: [
    { actor_code: "ACT-DOBOT", name: "Shenzhen Yuejiang Technology Co., Ltd.", role: "Manufacturer", website: "https://www.dobot-robots.com", country: "China" },
    { actor_code: "ACT-IPB", name: "Instituto Politécnico de Bragança", role: "End User", website: "https://www.ipb.pt", country: "Portugal" }
  ],
  locations: [
    { location_code: "LOC-DOBOT", actor_code: "ACT-DOBOT", name: "Dobot HQ", city: "Shenzhen", country: "China", lat: 22.543, lon: 114.058 },
    { location_code: "LOC-IPB", actor_code: "ACT-IPB", name: "IPB Campus", city: "Bragança", country: "Portugal", lat: 41.794, lon: -6.765 }
  ],
  trace_events: [
    { event_time: "2020-02-10T08:00:00Z", event_type: "production", biz_step: "commissioning", disposition: "active", actor_code: "ACT-DOBOT", event_name: "Manufactured", notes: "Shenzhen facility" },
    { event_time: "2020-06-01T09:00:00Z", event_type: "receiving", biz_step: "receiving", disposition: "active", actor_code: "ACT-IPB", event_name: "Received at IPB", notes: "STEM education lab" }
  ]
};

// ═══════════════════════════════════════════════════════════
// NEW PRODUCT 4: Dobot MG400
// ═══════════════════════════════════════════════════════════
const dobotMG400 = {
  kind: "Instance", asset_kind: "Instance",
  global_product_id: "https://dpp-ur3e-2f140.vercel.app/mg400",
  manufacturer_name: "Dobot", model: "MG400",
  serial_number: "SN-MG400-2022-001", year_of_construction: 2022,
  product_family: "Dobot Desktop Industrial", country_of_origin: "China", image_uri: "mg400.webp",
  lifecycle: lifecycle("usage", "Deployed at IPB for desktop automation and collaborative robotics education"),
  aas_reference: aasRef("https://dpp-ur3e-2f140.vercel.app/mg400", "aas:dpp:mg400:SN-MG400-2022-001"),
  iec62890_type_reference: { type_product_id: "MG400", type_manufacturer: "Dobot", type_description: "4-axis desktop collaborative robot with drag-to-teach and collision detection" },
  digital_nameplate: { manufacturer_name: "Shenzhen Yuejiang Technology Co., Ltd. (Dobot)", manufacturer_product_designation: "Dobot MG400 Desktop Robot", serial_number: "SN-MG400-2022-001", year_of_construction: 2022, product_family: "Dobot Desktop Industrial", country_of_origin: "China", marking_ce: true },
  bom_components: [
    { component_name: "Base with servo motor (J1)", quantity: 1, unit: "pcs", notes: "±160°, absolute encoder" },
    { component_name: "Link 1 with servo motor (J2)", quantity: 1, unit: "pcs", notes: "-25° to 85°" },
    { component_name: "Link 2 with servo motor (J3)", quantity: 1, unit: "pcs", notes: "-25° to 105°" },
    { component_name: "End rotation servo (J4)", quantity: 1, unit: "pcs", notes: "±180°" },
    { component_name: "Integrated controller + servo drive", quantity: 1, unit: "pcs", notes: "TrueMotion algorithm" },
    { component_name: "48V power supply", quantity: 1, unit: "pcs", notes: "240 W nominal" }
  ],
  carbon_footprint: [
    { footprint_kind: "PCF", lifecycle_stage: "A1-A3 (Production)", emission_value: 55, unit: "kg CO2e", standard: "ISO 14067:2018", boundary: "Cradle-to-gate" },
    { footprint_kind: "PCF", lifecycle_stage: "B6 (Use phase energy)", emission_value: 30, unit: "kg CO2e/year", standard: "ISO 14067:2018", boundary: "Operational energy" }
  ],
  circularity: { recyclability_rate: 0.78, recycled_content: 0.18, reused_content: 0.0, repairability_score: 6.5, circularity_index: 0.58, notes: "All-in-one design limits component repair. Aluminium/steel recyclable." },
  contacts: [{ role_code: "manufacturer", org_name: "Shenzhen Yuejiang Technology Co., Ltd.", country: "China", emails: [{ email_address: "support@dobot.cc" }] }],
  documents: [{ category: "User Manual", title: "MG400 User Guide", language: "en", version: "V1.5", uri: "https://www.dobot-robots.com/service/download-center", mime_type: "application/pdf" }],
  material_composition: [
    { material: "Aluminium alloy", percentage: 45, recycled_percentage: 18 },
    { material: "Steel (structural)", percentage: 20, recycled_percentage: 35 },
    { material: "Polymer / engineering plastics", percentage: 15, recycled_percentage: 5 },
    { material: "Copper (servo motors, wiring)", percentage: 10, recycled_percentage: 15 },
    { material: "Electronics (PCBs, encoders)", percentage: 10, recycled_percentage: 0 }
  ],
  technical_properties: [
    { area: "General", property_name: "Degrees of freedom", value_num: 4, unit: "" },
    { area: "General", property_name: "Payload (rated)", value_num: 0.5, unit: "kg" },
    { area: "General", property_name: "Payload (max)", value_num: 0.75, unit: "kg" },
    { area: "General", property_name: "Reach", value_num: 440, unit: "mm" },
    { area: "General", property_name: "Weight", value_num: 8, unit: "kg" },
    { area: "Performance", property_name: "Repeatability", value_num: 0.05, unit: "mm" },
    { area: "Performance", property_name: "Max joint speed", value_num: 300, unit: "°/s" },
    { area: "Electrical", property_name: "Power", value_text: "100-240 V AC, 48 V DC, 240 W" },
    { area: "Communication", property_name: "Interfaces", value_text: "TCP/IP, Modbus TCP" },
    { area: "Safety", property_name: "Features", value_text: "Collision detection, drag-to-teach" },
    { area: "Mounting", property_name: "Installation", value_text: "Desktop, 190 × 190 mm footprint" },
    { area: "Programming", property_name: "Software", value_text: "DobotStudio Pro, Lua, Blockly" }
  ],
  supply_chain_actors: [
    { actor_code: "ACT-DOBOT", name: "Shenzhen Yuejiang Technology Co., Ltd.", role: "Manufacturer", website: "https://www.dobot-robots.com", country: "China" },
    { actor_code: "ACT-IPB", name: "Instituto Politécnico de Bragança", role: "End User", website: "https://www.ipb.pt", country: "Portugal" }
  ],
  locations: [
    { location_code: "LOC-DOBOT", actor_code: "ACT-DOBOT", name: "Dobot HQ", city: "Shenzhen", country: "China", lat: 22.543, lon: 114.058 },
    { location_code: "LOC-IPB", actor_code: "ACT-IPB", name: "IPB Campus", city: "Bragança", country: "Portugal", lat: 41.794, lon: -6.765 }
  ],
  trace_events: [
    { event_time: "2022-01-20T08:00:00Z", event_type: "production", biz_step: "commissioning", disposition: "active", actor_code: "ACT-DOBOT", event_name: "Manufactured", notes: "Shenzhen facility" },
    { event_time: "2022-04-15T09:00:00Z", event_type: "receiving", biz_step: "receiving", disposition: "active", actor_code: "ACT-IPB", event_name: "Received at IPB", notes: "Desktop collaborative robotics education" }
  ]
};

// ═══════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════
async function main() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    const db = client.db(DB_NAME);
    const col = db.collection(COLLECTION);

    // 1. Update existing UR3e
    const r1 = await col.updateOne({ model: { $regex: /^UR3e$/i } }, { $set: ur3eUpdate });
    console.log(`UR3e update: matched=${r1.matchedCount}, modified=${r1.modifiedCount}`);

    // 2. Update existing 2F-140
    const r2 = await col.updateOne({ model: { $regex: /^2F-140$/i } }, { $set: f140Update });
    console.log(`2F-140 update: matched=${r2.matchedCount}, modified=${r2.modifiedCount}`);

    // 3. Insert new products (upsert to avoid duplicates)
    for (const product of [ur3e2, irb1400, dobotMagician, dobotMG400]) {
      const r = await col.updateOne(
        { serial_number: product.serial_number },
        { $set: product },
        { upsert: true }
      );
      console.log(`${product.model} (${product.serial_number}): matched=${r.matchedCount}, upserted=${r.upsertedCount}`);
    }

    // 4. Summary
    const count = await col.countDocuments();
    const all = await col.find({}, { projection: { model: 1, serial_number: 1, asset_kind: 1, "lifecycle.current_phase": 1 } }).toArray();
    console.log(`\nTotal products: ${count}`);
    all.forEach(p => console.log(`  - ${p.model} | ${p.serial_number || "N/A"} | ${p.asset_kind || "—"} | phase: ${p.lifecycle?.current_phase || "—"}`));
  } finally {
    await client.close();
  }
}

main().catch(console.error);