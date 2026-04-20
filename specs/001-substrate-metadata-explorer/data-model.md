# Data Model: Substrate Metadata Explorer

## Entity: EndpointSubmission
- Description: User-entered websocket endpoint and the connect attempt metadata.
- Fields:
  - endpoint: string, required, must begin with `wss://`
  - submittedAt: datetime (ISO-8601)
  - trigger: enum(`enter-key`, `submit-button`, `reconnect-button`)
  - validationStatus: enum(`valid`, `invalid`)
  - validationMessage: string | null
- Validation rules:
  - endpoint must not be empty
  - endpoint must match secure websocket format (`wss://...`)

## Entity: MetadataSnapshot
- Description: Latest successfully retrieved runtime metadata and retrieval context.
- Fields:
  - chainId: string (derived from chain name)
  - chainName: string
  - nodeName: string
  - nodeVersion: string
  - retrievedAt: datetime (ISO-8601)
  - metadataJson: object (runtime metadata JSON)
  - sourceEndpoint: string
- Validation rules:
  - metadataJson must be valid JSON object
  - sourceEndpoint must equal the validated endpoint used for retrieval

## Entity: MetadataNode
- Description: Displayable metadata element in the explorer tree.
- Fields:
  - path: string (dot-path within metadata)
  - nodeType: enum(`object`, `array`, `string`, `number`, `boolean`, `null`)
  - key: string
  - value: unknown
  - childCount: number
  - parentPath: string | null
- Validation rules:
  - path must be unique within one snapshot
  - childCount >= 0

## Entity: ExplorerViewState
- Description: Current view configuration for metadata exploration.
- Fields:
  - activeSectionKeys: string[]
  - expandedPaths: string[]
  - visibleSectionKeys: string[]
  - status: enum(`empty`, `loading`, `ready`, `error`)
  - errorMessage: string | null
- Validation rules:
  - `ready` requires a non-null MetadataSnapshot
  - `error` requires non-empty errorMessage

## Entity: SearchQueryContext
- Description: Query and relevance computation state for smart filtering.
- Fields:
  - rawQuery: string
  - expandedQuery: string
  - tokens: string[]
  - resultCount: number
  - allowedPaths: string[]
  - lastExecutedAt: datetime (ISO-8601) | null
- Validation rules:
  - empty rawQuery implies full metadata visibility
  - resultCount = 0 implies visibleSectionKeys may be empty

## Entity: ExportArtifact
- Description: Downloaded metadata file generated from active snapshot.
- Fields:
  - fileName: string
  - mimeType: constant `application/json`
  - byteSize: number
  - createdAt: datetime (ISO-8601)
  - snapshotChainId: string
- Validation rules:
  - fileName must end with `.json`
  - exported payload must equal active MetadataSnapshot.metadataJson

## Relationships
- EndpointSubmission (1) -> (0..1) MetadataSnapshot
- MetadataSnapshot (1) -> (1..n) MetadataNode
- MetadataSnapshot (1) -> (1) ExplorerViewState
- ExplorerViewState (1) -> (0..1) SearchQueryContext
- MetadataSnapshot (1) -> (0..n) ExportArtifact

## State Transitions
1. ExplorerViewState: `empty` -> `loading`
   - Trigger: valid endpoint submission
2. ExplorerViewState: `loading` -> `ready`
   - Trigger: metadata retrieval succeeds
3. ExplorerViewState: `loading` -> `error`
   - Trigger: retrieval fails or times out
4. ExplorerViewState: `error` -> `loading`
   - Trigger: retry with another submission
5. SearchQueryContext active filtering
   - Trigger: non-empty query updates allowedPaths and visibleSectionKeys
6. SearchQueryContext clear
   - Trigger: query cleared, full snapshot visibility restored
