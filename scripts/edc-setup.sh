#!/usr/bin/env bash
# scripts/edc-setup.sh
# Registers UR3e and 2F-140 as DataSpace assets with tiered policies.

BASE="http://localhost:8182/management/v3"

register_asset() {
  local SLUG=$1
  local VIEW=$2
  local ASSET_ID="${SLUG}-${VIEW}"

  echo "Registering asset: $ASSET_ID"

  curl -sS -X POST "$BASE/assets" \
    -H "Content-Type: application/json" \
    -d '{
      "@context": { "edc": "https://w3id.org/edc/v0.0.1/ns/" },
      "@id": "'"$ASSET_ID"'",
      "properties": {
        "name": "DPP '"$SLUG"' — '"$VIEW"' data",
        "description": "Digital Product Passport for '"$SLUG"', scope: '"$VIEW"'",
        "contentType": "application/json",
        "dpp:model": "'"$SLUG"'",
        "dpp:scope": "'"$VIEW"'"
      },
      "dataAddress": {
        "@type": "HttpData",
        "baseUrl": "http://dpp-app:3000/api/edc/'"$SLUG"'?view='"$VIEW"'",
        "headers": {
          "x-api-key": "'"${EDC_BACKEND_API_KEY}"'"
        }
      }
    }'
}

register_policy() {
  local POLICY_ID=$1
  local PARTNER_BPN=$2  # Business Partner Number of allowed consumer

  echo "Registering policy: $POLICY_ID"

  curl -sS -X POST "$BASE/policydefinitions" \
    -H "Content-Type: application/json" \
    -d '{
      "@context": { "edc": "https://w3id.org/edc/v0.0.1/ns/" },
      "@id": "'"$POLICY_ID"'",
      "policy": {
        "@type": "Set",
        "permission": [{
          "action": "use",
          "constraint": {
            "leftOperand": "BusinessPartnerNumber",
            "operator": "eq",
            "rightOperand": "'"$PARTNER_BPN"'"
          }
        }]
      }
    }'
}

register_contract() {
  local SLUG=$1
  local VIEW=$2
  local POLICY_ID=$3

  echo "Registering contract: ${SLUG}-${VIEW}"

  curl -sS -X POST "$BASE/contractdefinitions" \
    -H "Content-Type: application/json" \
    -d '{
      "@context": { "edc": "https://w3id.org/edc/v0.0.1/ns/" },
      "@id": "contract-'"$SLUG"'-'"$VIEW"'",
      "accessPolicyId": "'"$POLICY_ID"'",
      "contractPolicyId": "'"$POLICY_ID"'",
      "assetsSelector": [{
        "operandLeft": "https://w3id.org/edc/v0.0.1/ns/id",
        "operator": "=",
        "operandRight": "'"$SLUG"'-'"$VIEW"'"
      }]
    }'
}

# ── Register assets for both products, all scopes ─────────
for SLUG in ur3e 2f-140; do
  for VIEW in nameplate carbon bom traceability full; do
    register_asset "$SLUG" "$VIEW"
  done
done

# ── Register policies per partner type ────────────────────
register_policy "policy-regulator"    "BPN-EU-REGULATOR-001"
register_policy "policy-recycler"     "BPN-RECYCLER-CORP-001"
register_policy "policy-sc-partner"   "BPN-SUPPLYCHAIN-001"
register_policy "policy-open"         "PUBLIC"   # for nameplate only

# ── Bind contracts ────────────────────────────────────────
register_contract "ur3e"  "nameplate"    "policy-open"
register_contract "ur3e"  "carbon"       "policy-regulator"
register_contract "ur3e"  "bom"          "policy-recycler"
register_contract "ur3e"  "traceability" "policy-sc-partner"
register_contract "ur3e"  "full"         "policy-sc-partner"

register_contract "2f-140" "nameplate"    "policy-open"
register_contract "2f-140" "carbon"       "policy-regulator"
register_contract "2f-140" "bom"          "policy-recycler"
register_contract "2f-140" "traceability" "policy-sc-partner"
register_contract "2f-140" "full"         "policy-sc-partner"

echo "Done — all assets, policies and contracts registered."