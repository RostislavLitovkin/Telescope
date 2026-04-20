# UI Contract: Substrate Metadata Explorer

## Scope
This contract defines user-visible interactions and state guarantees for endpoint submission, metadata retrieval, explorer rendering, smart filtering, and JSON export.

## Contract A: Endpoint Submission
- Input:
  - endpoint: string
  - trigger: `enter-key` | `submit-button` | `reconnect-button`
- Preconditions:
  - endpoint must be non-empty
  - endpoint must start with `wss://`
- Behavior:
  - invalid endpoint: no connection attempt; show actionable inline error
  - valid endpoint: set loading state and start connection
- Postconditions:
  - on success: snapshot exists and docs view becomes active
  - on failure: error state shown with retry capability

## Contract B: Retrieval State Model
- States: `empty`, `loading`, `ready`, `error`
- Required transitions:
  - `empty` -> `loading` on valid submission
  - `loading` -> `ready` on metadata success
  - `loading` -> `error` on failure
  - `error` -> `loading` on retry
- UI guarantees:
  - loading state includes explicit progress copy
  - error state includes clear message and retry path
  - ready state exposes chain summary, section nav, and metadata cards

## Contract C: Metadata Explorer Rendering
- Input:
  - metadataJson object from active snapshot
- Behavior:
  - top-level keys render as section cards
  - object and array nodes are expandable/collapsible
  - primitive values render with type-aware formatting
- Postconditions:
  - hierarchy and paths are stable for one snapshot
  - cards include section count metadata

## Contract D: Smart Search and Filtering
- Input:
  - raw query string
- Behavior:
  - trim and tokenize query
  - expand aliases for known domain terms
  - fuzzy-rank candidate nodes
  - compute allowed paths and prune non-relevant branches
- Postconditions:
  - relevant branches stay visible with ancestor context preserved
  - non-relevant branches are hidden
  - clearing query restores full snapshot visibility

## Contract E: JSON Export
- Preconditions:
  - active MetadataSnapshot must exist
- Behavior:
  - serialize active metadata with indentation
  - generate downloadable file name from chain + timestamp
- Postconditions:
  - downloaded file MIME type is `application/json`
  - exported payload exactly matches active snapshot JSON

## Accessibility and Responsiveness Contract
- Keyboard:
  - endpoint form submit must work via Enter key
  - interactive controls remain keyboard focusable
- Viewports:
  - desktop (>=1024px): sidebar + content two-column layout
  - tablet (701-1023px): stacked layout with full feature parity
  - mobile (<=700px): stacked controls and readable tree rows
- Consistency:
  - status and error copy style remains consistent across hero and docs modes
