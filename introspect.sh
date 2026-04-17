#!/bin/bash
set -e
source .env
PREFIX='blvd-admin-v1'
TIMESTAMP=$(date +%s)
PAYLOAD="${PREFIX}${BOULEVARD_BUSINESS_ID}${TIMESTAMP}"
RAW_KEY=$(printf '%s' "$BOULEVARD_SECRET_KEY" | base64 -d 2>/dev/null)
SIGNATURE=$(printf '%s' "$PAYLOAD" | openssl dgst -sha256 -hmac "$RAW_KEY" -binary | base64)
TOKEN="${SIGNATURE}${PAYLOAD}"
CREDENTIALS=$(printf '%s' "${BOULEVARD_API_KEY}:${TOKEN}" | base64)

QUERY='{"query":"{t0:__type(name:\"NativeObjectMeta\"){fields{name type{name kind ofType{name}}}} t1:__type(name:\"StaffLocationAbilities\"){fields{name type{name kind ofType{name}}}} t2:__type(name:\"StaffRole\"){fields{name type{name kind ofType{name}}}} t3:__type(name:\"CreditCard\"){fields{name type{name kind ofType{name}}}} t4:__type(name:\"ServiceCategory\"){fields{name type{name kind ofType{name}}}} }"}'

curl -s -X POST "$BOULEVARD_API_ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic $CREDENTIALS" \
  -d "$QUERY"
