#!/usr/bin/env bash
# Register UR3e and 2F-140 DPP assets in the MVD Provider connector

BASE="http://localhost:39193/api/mgmt/v3"
DPP_HOST="http://host.docker.internal:3000"
API_KEY="dpp-secret-key-dev-123"

register_asset() {
  local SLUG=$1
  local VIEW=$2
  local ASSET_ID="dpp-${SLUG}-${VIEW}"

  echo "Registering asset: $ASSET_ID"

  curl -sS -X POST "$BASE/assets" \
    -H "Content-Type: application/json" \
    -d '{
      "@context": { "@vocab": "https://w3id.org/edc/v0.0.1/ns/" },
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
        "baseUrl": "'"$DPP_HOST"'/api/edc/'"$SLUG"'?view='"$VIEW"'",
        "header:x-api-key": "'"$API_KEY"'"
      }
    }'
  echo ""
}

register_policy() {
  local POLICY_ID=$1

  echo "Registering policy: $POLICY_ID"

  curl -sS -X POST "$BASE/policydefinitions" \
    -H "Content-Type: application/json" \
    -d '{
      "@context": { "@vocab": "https://w3id.org/edc/v0.0.1/ns/" },
      "@id": "'"$POLICY_ID"'",
      "policy": {
        "@type": "Set",
        "permission": [{
          "action": "use"
        }]
      }
    }'
  echo ""
}

register_contract() {
  local SLUG=$1
  local VIEW=$2
  local POLICY_ID=$3
  local CONTRACT_ID="contract-dpp-${SLUG}-${VIEW}"

  echo "Registering contract: $CONTRACT_ID"

  curl -sS -X POST "$BASE/contractdefinitions" \
    -H "Content-Type: application/json" \
    -d '{
      "@context": { "@vocab": "https://w3id.org/edc/v0.0.1/ns/" },
      "@id": "'"$CONTRACT_ID"'",
      "accessPolicyId": "'"$POLICY_ID"'",
      "contractPolicyId": "'"$POLICY_ID"'",
      "assetsSelector": [{
        "operandLeft": "https://w3id.org/edc/v0.0.1/ns/id",
        "operator": "=",
        "operandRight": "dpp-'"$SLUG"'-'"$VIEW"'"
      }]
    }'
  echo ""
}

echo "=== Registering DPP open-use policy ==="
register_policy "policy-dpp-open"

echo ""
echo "=== Registering DPP assets ==="
for SLUG in ur3e 2f-140; do
  for VIEW in nameplate carbon bom traceability full; do
    register_asset "$SLUG" "$VIEW"
  done
done

echo ""
echo "=== Registering DPP contracts ==="
for SLUG in ur3e 2f-140; do
  for VIEW in nameplate carbon bom traceability full; do
    register_contract "$SLUG" "$VIEW" "policy-dpp-open"
  done
done

echo ""
echo "Done — all DPP assets, policies and contracts registered."