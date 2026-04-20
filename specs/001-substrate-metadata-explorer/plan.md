# Implementation Plan: Substrate Metadata Explorer

**Branch**: `001-build-substrate-explorer` | **Date**: 2026-04-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-substrate-metadata-explorer/spec.md`

## Summary

Build a Nuxt 3 web app flow that accepts a secure Substrate endpoint (`wss://...`), connects via `@polkadot/api`, retrieves runtime metadata as JSON, renders it in a Swagger-like exploration experience, and supports intelligent relevance filtering plus JSON export. The implementation reuses the existing `useMetadataExplorer` composable and recursive metadata tree rendering while formalizing quality gates, model contracts, and verification assets for task generation.

## Technical Context

**Language/Version**: TypeScript (Nuxt 3 / Vue 3, ESM)  
**Primary Dependencies**: `nuxt`, `@polkadot/api`, `fuse.js`, `lucide-vue-next`  
**Storage**: In-memory session state via Vue refs/computed; browser file download for JSON export; no server persistence  
**Testing**: Vitest + Vue Test Utils for unit/component tests, Playwright for primary path E2E, Nuxt build/type checks in CI  
**Target Platform**: Modern desktop and mobile browsers (deployed as static site via Nuxt/Nitro GitHub Pages preset)
**Project Type**: Single-project web application (Nuxt SPA/SSR-capable frontend)
**Performance Goals**: Successful metadata retrieval for valid endpoints within 10s in normal conditions; interactive filtering feedback under 300ms for typical metadata payloads; no main-thread lockups during tree expansion/search  
**Constraints**: `wss://` endpoints only, clear loading/success/error/empty states, preserve usability at <=700px and >=1024px breakpoints, no backend service dependency  
**Scale/Scope**: Single active endpoint per session; metadata trees with thousands of nodes; one feature surface (connect, browse, smart search, export)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Code Quality Gate: Require `npm run build` and automated test suite (`vitest` and Playwright smoke paths) before merge; enforce strict TypeScript and no uncaught async error paths in connection workflow.
- Reuse Gate: Reuse existing `composables/useMetadataExplorer.ts` for endpoint validation, retrieval, search pruning, and download behavior; reuse `components/MetadataTree.vue` for recursive rendering. Any new abstraction must demonstrate elimination of duplicated logic across at least two UI paths.
- UX Consistency Gate: Keep existing topbar + hero/docs layout language, iconography, and state messaging conventions already present in `app.vue`; maintain semantic labels, keyboard submit behavior, and visible feedback copy.
- Responsive Gate: Validate behaviors at desktop (>=1024px), tablet (701-1023px), and mobile (<=700px) with no loss of core actions (connect, search, expand, download).
- Verification Gate: Approval evidence must include passing build and test logs, viewport screenshots (hero + docs state), and a recorded/manual checklist run for the four primary journeys (connect, explore, search, download).

## Project Structure

### Documentation (this feature)

```text
specs/001-substrate-metadata-explorer/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── metadata-explorer-ui-contract.md
└── tasks.md                # created by /speckit.tasks
```

### Source Code (repository root)

```text
app.vue
assets/
└── css/
    └── main.css
components/
└── MetadataTree.vue
composables/
└── useMetadataExplorer.ts
specs/
└── 001-substrate-metadata-explorer/
tests/
├── unit/
├── integration/
└── e2e/
```

**Structure Decision**: Use the existing single Nuxt app structure and add a `tests/` hierarchy for automated verification. No backend split is required because metadata retrieval is performed directly from browser client using `@polkadot/api` websocket provider.

## Phase 0: Outline and Research

- Capture best practices for Substrate websocket lifecycle management in browser contexts.
- Define smart search strategy combining alias expansion and fuzzy ranking with bounded result pruning.
- Define quality and responsiveness verification strategy aligned to constitution gates.
- Output artifact: `research.md` with explicit decisions, rationale, and alternatives.

## Phase 1: Design and Contracts

- Define feature entities, validation rules, and state transitions in `data-model.md`.
- Define UI interaction contract for connect/search/filter/export behaviors in `contracts/metadata-explorer-ui-contract.md`.
- Document developer and validation runbook in `quickstart.md`.
- Re-check constitution compliance after design artifacts are complete.

## Phase 2: Task Planning Approach

- Generate tasks grouped by user story priority (P1 connect, P2 explorer view, P3 smart filtering).
- Include explicit quality tasks for unit, integration/E2E, and responsive evidence capture.
- Include reuse-focused refactor tasks only if duplication is identified during implementation.

## Post-Design Constitution Re-Check

- Code Quality Gate: PASS (checks and test strategy defined in plan + quickstart).
- Reuse Gate: PASS (existing composable and tree component retained as core implementation anchors).
- UX Consistency Gate: PASS (contract keeps existing language and interaction patterns).
- Responsive Gate: PASS (breakpoints and validation expectations explicitly defined).
- Verification Gate: PASS (required evidence artifacts specified and traceable to quickstart workflow).

## Complexity Tracking

No constitution violations or exceptions identified at planning stage.
