# Quickstart: Substrate Metadata Explorer

## Prerequisites
- Node.js 20+ and npm
- Access to a reachable Substrate `wss://` endpoint (example: `wss://rpc.polkadot.io`)

## Install
```bash
npm install
```

## Run Locally
```bash
npm run dev
```
Open the local Nuxt URL from terminal output.

## Build Verification
```bash
npm run build
npm run generate
```

## Test Verification (planned gates)
Add and run these as part of implementation tasks:
```bash
npm run test:unit
npm run test:e2e
```

## Manual Validation Checklist
1. Connect journey (P1)
- Open app with no metadata loaded.
- Enter valid endpoint and submit with Enter key.
- Confirm loading state, successful connection state, and metadata sections appear.

2. Invalid endpoint handling (P1)
- Enter malformed or non-`wss://` endpoint.
- Confirm actionable inline validation message.

3. Explorer journey (P2)
- Expand/collapse multiple metadata sections.
- Confirm detailed nested fields remain readable and structured.

4. Smart search journey (P3)
- Run exact and partial queries (example: `balance tx`).
- Confirm relevant sections remain while unrelated sections are hidden.
- Clear query and confirm full restoration.

5. Export journey (P2)
- Click Download JSON after metadata is loaded.
- Confirm downloaded `.json` file opens and matches on-screen snapshot.

6. Responsive journey (all stories)
- Validate at desktop (>=1024px), tablet (701-1023px), and mobile (<=700px).
- Confirm connect, search, expand/collapse, and download all remain functional.

## Evidence to Attach in PR
- Build output logs (`npm run build`, `npm run generate`)
- Unit/E2E test output logs
- Screenshots for hero and docs states at desktop and mobile sizes
- Manual checklist results with pass/fail notes
