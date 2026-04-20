# Research: Substrate Metadata Explorer

## Decision 1: Browser-side metadata retrieval using @polkadot/api
- Decision: Use `@polkadot/api` with `WsProvider` in the client to connect directly to `wss://` endpoints and call `api.runtimeMetadata.toJSON()`.
- Rationale: Existing code already uses this dependency and pattern, minimizing implementation risk while preserving direct compatibility with Substrate nodes.
- Alternatives considered:
  - Build a server proxy for websocket calls: rejected because it adds infrastructure and contradicts static deployment goals.
  - Use raw websocket RPC calls without SDK: rejected due to higher parsing/compatibility complexity.

## Decision 2: Endpoint validation and connection lifecycle
- Decision: Enforce `wss://` prefix validation before connect, show actionable errors, and always disconnect previous API instance before reconnect.
- Rationale: Meets functional requirements for secure endpoint handling and prevents resource leaks from stale providers.
- Alternatives considered:
  - Allow `ws://` in development: rejected for inconsistent behavior against product requirement and potential mixed-content failures.
  - Keep multiple live API sessions: rejected due to unnecessary memory/socket overhead for single-endpoint scope.

## Decision 3: Smart search strategy
- Decision: Keep the hybrid strategy of alias expansion + Fuse fuzzy ranking + path-based pruning.
- Rationale: This approach supports exact, partial, and semantically-adjacent matching while preserving navigable tree context through ancestor path retention.
- Alternatives considered:
  - Exact text filtering only: rejected because it fails near-match and discovery goals.
  - Full semantic embedding search: rejected for added model/runtime complexity and browser footprint.

## Decision 4: Rendering model for large metadata
- Decision: Use recursive collapsible tree rendering with section-level cards and bounded Fuse result limits.
- Rationale: Matches Swagger-like exploration behavior, keeps hierarchy understandable, and constrains worst-case filter cost.
- Alternatives considered:
  - Flat table rendering: rejected due to loss of nested context.
  - Fully expanded JSON view: rejected because it is hard to scan and expensive for large payloads.

## Decision 5: Verification stack
- Decision: Use build/type checks plus Vitest (unit/component) and Playwright (critical journey E2E) as quality evidence.
- Rationale: Aligns with constitution requirements for objective verification across logic and user paths.
- Alternatives considered:
  - Manual testing only: rejected because it does not satisfy enforced quality verification.
  - E2E-only testing: rejected because lower-level search/state logic needs fast unit coverage.

## Decision 6: Responsive validation envelope
- Decision: Validate three breakpoints: desktop (>=1024px), tablet (701-1023px), and mobile (<=700px), with connect/search/explore/download always available.
- Rationale: Current CSS already defines 1024px and 700px transitions; formalizing them keeps behavior consistent and testable.
- Alternatives considered:
  - Desktop-first only checks: rejected because the feature explicitly requires mobile usability.
  - Too many breakpoint tiers: rejected to keep test matrix focused and maintainable.
