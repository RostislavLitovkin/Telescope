# Feature Specification: Substrate Metadata Explorer

**Feature Branch**: `001-build-substrate-explorer`  
**Created**: 2026-04-20  
**Status**: Draft  
**Input**: User description: "Create me a web app with 1 search bar in the middle where I can enter a wss address for a substrate based blockchain. Then once I hit enter (or click the enter button) it will connect to that blockchain and download the metadata in json format. There will be a button on the top left to download that json. also display the metadata in a similar way Swagger is doing it to rest API. Try to display as much information as possible. make the design similar to swagger. Also add a seach that searches relevant information from that metadata and filters what is visible / hidden. make that seach feature super smart."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Connect and Retrieve Metadata (Priority: P1)

As a user, I can enter a blockchain WebSocket endpoint and trigger a connection so the app retrieves and stores the latest chain metadata in JSON form.

**Why this priority**: Without successful connection and metadata retrieval, the rest of the experience has no usable data.

**Independent Test**: Can be fully tested by entering a valid endpoint, submitting, and verifying that metadata is fetched, displayed, and available for download.

**Acceptance Scenarios**:

1. **Given** I am on the app landing view with an endpoint input, **When** I enter a valid secure WebSocket endpoint and submit, **Then** the app connects and retrieves metadata JSON for that chain.
2. **Given** metadata retrieval succeeds, **When** retrieval completes, **Then** the app shows retrieval success state and makes the metadata available to other interface areas.
3. **Given** I submit an invalid or unreachable endpoint, **When** connection fails, **Then** the app shows a clear error and allows me to retry with another endpoint.

---

### User Story 2 - Explore Metadata in Swagger-Like Documentation View (Priority: P2)

As a user, I can inspect the fetched metadata in a documentation-style interface with grouped sections, expandable details, and rich attribute visibility so I can understand chain capabilities.

**Why this priority**: Structured exploration is the primary value once data is available and should mirror familiar API documentation workflows.

**Independent Test**: Can be fully tested by loading metadata, navigating grouped sections, expanding and collapsing details, and confirming information is visible in a consistent documentation layout.

**Acceptance Scenarios**:

1. **Given** metadata has been retrieved, **When** I open the metadata view, **Then** information is organized in clearly labeled groups with collapsible detail panels.
2. **Given** I browse any metadata section, **When** I expand a section item, **Then** I can see detailed fields and related context available from the metadata source.
3. **Given** the interface is loaded, **When** I need the raw artifact, **Then** I can use the top-left download control to export the current metadata JSON.

---

### User Story 3 - Smart Search and Dynamic Filtering (Priority: P3)

As a user, I can run an intelligent search over metadata so only relevant sections remain visible while non-relevant sections are hidden, helping me quickly locate specific chain information.

**Why this priority**: Large metadata payloads are difficult to navigate manually; intelligent filtering dramatically improves time-to-insight.

**Independent Test**: Can be fully tested by entering broad and specific terms, confirming relevant sections remain visible, hidden sections are excluded, and clearing the query restores full visibility.

**Acceptance Scenarios**:

1. **Given** metadata is displayed, **When** I enter a search query, **Then** the app ranks and highlights relevant matches while hiding unrelated sections.
2. **Given** a query contains partial terms or approximate phrases, **When** I submit the query, **Then** the app still returns semantically relevant results when exact text does not fully match.
3. **Given** an active filtered view, **When** I clear the search query, **Then** the app restores the full metadata view.

### Edge Cases

- What happens when endpoint input is empty, malformed, or uses a non-secure protocol?
- How does the system handle very large metadata payloads without freezing user interaction?
- What happens if metadata retrieval times out or returns incomplete data?
- How does the app behave when the metadata schema differs between chain versions?
- What happens when search yields no relevant results?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a primary endpoint input control centered on initial page view for secure WebSocket address entry.
- **FR-002**: System MUST allow metadata retrieval when the user submits the endpoint by keyboard submit action or submit button action.
- **FR-003**: System MUST validate endpoint format before attempting connection and provide actionable error feedback for invalid input.
- **FR-004**: System MUST retrieve current blockchain metadata and represent it as JSON.
- **FR-005**: System MUST persist the latest successfully retrieved metadata in session state for browsing and export.
- **FR-006**: System MUST provide a top-left download control that exports the currently loaded metadata JSON artifact.
- **FR-007**: System MUST present metadata in a documentation-style explorer view with grouped sections and collapsible details.
- **FR-008**: Users MUST be able to inspect as much available metadata detail as exposed by the source metadata payload.
- **FR-009**: System MUST provide a dedicated metadata search capability that filters visible content based on relevance.
- **FR-010**: System MUST support intelligent matching in search, including partial-term and near-match relevance.
- **FR-011**: System MUST provide clear loading, success, empty, and error states for connection, retrieval, display, and search workflows.
- **FR-012**: System MUST maintain consistent interaction patterns and visual hierarchy across metadata browsing and filtering flows.
- **FR-013**: System MUST preserve core usability on both mobile and desktop viewports.

### Key Entities *(include if feature involves data)*

- **Endpoint Submission**: User-provided secure WebSocket address and submission event metadata.
- **Metadata Snapshot**: Retrieved blockchain metadata represented as structured JSON at a specific retrieval time.
- **Metadata Node**: A navigable and displayable metadata element, including its type, path, and detailed attributes.
- **Explorer View State**: Current expansion/collapse state, active section, and visibility decisions for metadata nodes.
- **Search Query Context**: Raw query text, derived relevance terms, match scores, and filter output mapping to visible nodes.
- **Export Artifact**: Downloadable JSON file generated from the active metadata snapshot.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 95% of valid endpoint submissions retrieve metadata successfully within 10 seconds under normal network conditions.
- **SC-002**: 90% of users can complete endpoint submission and metadata retrieval on first attempt without assistance.
- **SC-003**: 90% of users can locate a target metadata item in under 30 seconds using search and filtered explorer view.
- **SC-004**: 95% of metadata download actions produce a valid JSON file that matches the currently displayed metadata snapshot.
- **SC-005**: 100% of primary user journeys (connect, explore, search, download) remain functional on both mobile and desktop viewport classes.
- **SC-006**: In user validation sessions, at least 85% of participants rate interface consistency and readability as good or better.

## Assumptions

- Target users have access to publicly reachable substrate-compatible secure WebSocket endpoints.
- Retrieval scope for this feature is the latest metadata snapshot from a single endpoint at a time.
- Metadata visualization follows a documentation-style interaction model inspired by familiar API explorer tools.
- Endpoint credentials or advanced authentication negotiation are out of scope unless already handled by endpoint accessibility.
- Search intelligence is focused on relevance and discoverability within loaded metadata, not cross-chain federation.
- The feature is browser-based and intended for both mobile and desktop usage.
