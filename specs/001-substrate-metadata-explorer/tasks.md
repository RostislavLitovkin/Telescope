# Tasks: Substrate Metadata Explorer

**Input**: Design documents from `/specs/001-substrate-metadata-explorer/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/metadata-explorer-ui-contract.md, quickstart.md

**Tests**: Include automated and manual verification tasks to satisfy constitution quality gates defined in plan.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Every task includes a concrete file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish project-level tooling and test scaffolding.

- [ ] T001 Verify and align Nuxt scripts and dependencies in package.json
- [ ] T002 Configure Nuxt GitHub Pages static output settings in nuxt.config.ts
- [ ] T003 [P] Create unit test bootstrap and script wiring in tests/unit/setup.ts
- [ ] T004 [P] Create Playwright smoke test bootstrap in tests/e2e/metadata-explorer.spec.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core architecture and reusable foundations required before any story work.

**⚠️ CRITICAL**: No user story work starts before this phase is complete.

- [ ] T005 Create shared metadata domain types from data-model entities in composables/types/metadata.ts
- [ ] T006 [P] Create reusable metadata path and prune helpers in composables/utils/metadataPath.ts
- [ ] T007 [P] Create reusable smart query expansion helper in composables/utils/smartQuery.ts
- [ ] T008 Integrate shared helpers and types into explorer state flow in composables/useMetadataExplorer.ts
- [ ] T009 [P] Define shared status and interaction design tokens in assets/css/main.css
- [ ] T010 Add baseline quality-check commands and workflow notes in README.md

**Checkpoint**: Foundation complete; user story phases can proceed.

---

## Phase 3: User Story 1 - Connect and Retrieve Metadata (Priority: P1) 🎯 MVP

**Goal**: User can submit a valid `wss://` endpoint and retrieve metadata JSON with clear status handling.

**Independent Test**: Submit valid and invalid endpoints in app UI and verify loading/success/error states and metadata availability.

### Implementation for User Story 1

- [ ] T011 [US1] Implement endpoint validation and submission trigger handling in composables/useMetadataExplorer.ts
- [ ] T012 [US1] Implement websocket connection lifecycle (disconnect/reconnect) in composables/useMetadataExplorer.ts
- [ ] T013 [US1] Implement metadata snapshot retrieval and chain identity capture in composables/useMetadataExplorer.ts
- [ ] T014 [US1] Wire centered hero connect form and enter/submit behavior in app.vue
- [ ] T015 [US1] Implement user-visible loading/success/error state rendering in app.vue
- [ ] T016 [P] [US1] Add unit tests for endpoint validation and connect state transitions in tests/unit/useMetadataExplorer.connect.spec.ts
- [ ] T017 [US1] Add E2E journey test for valid/invalid endpoint submission in tests/e2e/connect-and-retrieve.spec.ts

**Checkpoint**: User Story 1 is independently functional and testable.

---

## Phase 4: User Story 2 - Explore Metadata in Swagger-Like View (Priority: P2)

**Goal**: User can browse rich metadata details in structured, collapsible documentation-like sections and export JSON.

**Independent Test**: Load metadata, navigate section cards, expand/collapse nested nodes, and download exact JSON snapshot.

### Implementation for User Story 2

- [ ] T018 [US2] Implement top-level metadata section mapping and counts in composables/useMetadataExplorer.ts
- [ ] T019 [US2] Implement Swagger-like docs layout shell with sidebar and cards in app.vue
- [ ] T020 [US2] Implement recursive expandable metadata rendering in components/MetadataTree.vue
- [ ] T021 [US2] Implement top-left JSON export action and filename generation in composables/useMetadataExplorer.ts
- [ ] T022 [US2] Wire download button enable/disable behavior in app.vue
- [ ] T023 [P] [US2] Add unit tests for export artifact behavior in tests/unit/useMetadataExplorer.export.spec.ts
- [ ] T024 [US2] Add E2E journey test for explore/expand/download flow in tests/e2e/explore-and-download.spec.ts

**Checkpoint**: User Story 1 and User Story 2 both work independently.

---

## Phase 5: User Story 3 - Smart Search and Dynamic Filtering (Priority: P3)

**Goal**: User can run intelligent search that ranks relevance and hides non-relevant metadata while preserving context.

**Independent Test**: Enter exact and fuzzy queries; verify relevant branches remain, unrelated branches are hidden, and clearing query restores full tree.

### Implementation for User Story 3

- [ ] T025 [US3] Implement alias-expanded query normalization and tokenization in composables/useMetadataExplorer.ts
- [ ] T026 [US3] Implement Fuse indexing and relevance scoring pipeline in composables/useMetadataExplorer.ts
- [ ] T027 [US3] Implement allowed-path derivation and tree pruning in composables/useMetadataExplorer.ts
- [ ] T028 [US3] Wire smart search input and filtered section rendering in app.vue
- [ ] T029 [US3] Implement query-term match highlighting in tree keys in components/MetadataTree.vue
- [ ] T030 [P] [US3] Add unit tests for fuzzy matching and prune behavior in tests/unit/useMetadataExplorer.search.spec.ts
- [ ] T031 [US3] Add E2E journey test for smart filtering and reset behavior in tests/e2e/smart-search.spec.ts

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cross-story hardening, responsiveness validation, and release-quality evidence.

- [ ] T032 [P] Add responsive viewport regression checks for desktop/tablet/mobile in tests/e2e/responsive-layout.spec.ts
- [ ] T033 Run and document build and static-generate quality gate output in specs/001-substrate-metadata-explorer/quickstart.md
- [ ] T034 [P] Capture constitution evidence checklist for connect/explore/search/download in specs/001-substrate-metadata-explorer/quickstart.md
- [ ] T035 Perform style and accessibility consistency refinements in assets/css/main.css
- [ ] T036 Validate and finalize GitHub Pages deployment workflow behavior in .github/workflows/deploy-pages.yml

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Starts immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 completion and blocks all user stories.
- **User Story Phases (Phases 3-5)**: Depend on Phase 2 completion.
- **Polish (Phase 6)**: Depends on completion of desired user stories.

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 2; no dependency on other stories.
- **US2 (P2)**: Starts after Phase 2; reuses metadata snapshot from US1 but remains independently testable once data is available.
- **US3 (P3)**: Starts after Phase 2; depends on explorer data structures established in US2 for best integration.

### Within Each User Story

- Core state and data logic before UI wiring.
- UI wiring before story-specific tests.
- Unit tests before E2E validation for faster feedback.

---

## Parallel Opportunities

- Setup: T003 and T004 can run in parallel.
- Foundational: T006, T007, and T009 can run in parallel after T005 starts.
- US1: T016 can run in parallel with final UI polish after T011-T015 stabilize.
- US2: T023 can run in parallel with T022 once export logic is complete.
- US3: T030 can run in parallel with T029 after T025-T028 stabilize.
- Polish: T032 and T034 can run in parallel.

---

## Parallel Example: User Story 1

```bash
# Parallel test and stabilization work after core connect flow is implemented:
Task: "T016 [P] [US1] Add unit tests for endpoint validation and connect state transitions in tests/unit/useMetadataExplorer.connect.spec.ts"
Task: "T017 [US1] Add E2E journey test for valid/invalid endpoint submission in tests/e2e/connect-and-retrieve.spec.ts"
```

## Parallel Example: User Story 2

```bash
# Parallel implementation/testing once export behavior exists:
Task: "T022 [US2] Wire download button enable/disable behavior in app.vue"
Task: "T023 [P] [US2] Add unit tests for export artifact behavior in tests/unit/useMetadataExplorer.export.spec.ts"
```

## Parallel Example: User Story 3

```bash
# Parallel search verification and UI highlighting after filter pipeline is in place:
Task: "T029 [US3] Implement query-term match highlighting in tree keys in components/MetadataTree.vue"
Task: "T030 [P] [US3] Add unit tests for fuzzy matching and prune behavior in tests/unit/useMetadataExplorer.search.spec.ts"
```

---

## Implementation Strategy

### MVP First (US1 only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate connect/retrieve workflow and error handling.
4. Demo/deploy MVP.

### Incremental Delivery

1. Build foundation once.
2. Deliver US1 (connect/retrieve).
3. Deliver US2 (structured explorer + download).
4. Deliver US3 (smart filtering).
5. Finish polish and deployment hardening.

### Parallel Team Strategy

1. Team completes Phases 1-2 together.
2. Developer A: US1; Developer B: US2 shell and tree; Developer C: US3 search logic.
3. Converge in Phase 6 for cross-cutting validation.
