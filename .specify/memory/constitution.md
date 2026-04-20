<!--
Sync Impact Report
- Version change: template (unversioned) -> 1.0.0
- Modified principles:
	- Template Principle 1 -> I. Code Quality Is a Release Gate
	- Template Principle 2 -> II. Reuse Before Reinvention
	- Template Principle 3 -> III. Consistent User Experience Across Surfaces
	- Template Principle 4 -> IV. Mobile and Desktop Responsiveness by Default
	- Template Principle 5 -> V. Enforced Quality Verification
- Added sections:
	- Delivery Standards
	- Workflow and Review Policy
- Removed sections:
	- None
- Templates requiring updates:
	- ✅ updated: .specify/templates/plan-template.md
	- ✅ updated: .specify/templates/spec-template.md
	- ✅ updated: .specify/templates/tasks-template.md
	- ✅ not applicable (no files present): .specify/templates/commands/*.md
- Follow-up TODOs:
	- None
-->

# Telescope Constitution

## Core Principles

### I. Code Quality Is a Release Gate
All production changes MUST meet static analysis, formatting, and test quality
gates before merge. New code MUST include clear naming, bounded function size,
and explicit error handling paths. Changes that reduce maintainability,
introduce duplication without justification, or skip quality checks MUST be
rejected in review. Rationale: sustained delivery speed depends on predictable,
high-integrity code that is safe to evolve.

### II. Reuse Before Reinvention
Teams MUST prefer existing modules, shared utilities, and established patterns
before creating new abstractions. New reusable components MUST be documented
with intended use, extension boundaries, and ownership. Any duplicate logic
introduced for speed MUST include a follow-up consolidation task before release.
Rationale: disciplined reuse lowers defect rate, reduces maintenance cost, and
improves consistency across features.

### III. Consistent User Experience Across Surfaces
User-facing behavior MUST remain consistent for language, navigation patterns,
feedback states, and error messages across all features. New UI flows MUST
conform to approved interaction and content standards, including accessibility
baselines for contrast, keyboard access, and semantic structure. Rationale:
consistency improves trust, learnability, and supportability.

### IV. Mobile and Desktop Responsiveness by Default
Every user-facing change MUST define and validate behavior on mobile and desktop
breakpoints before merge. Layouts MUST adapt without loss of core functionality,
critical information, or task completion paths. Responsive behavior and
breakpoint assumptions MUST be recorded in specs and verified in testing.
Rationale: responsive quality is a primary product requirement, not a post hoc
enhancement.

### V. Enforced Quality Verification
Each feature MUST include test evidence proportionate to risk, covering unit,
integration, and user-path validation where applicable. For UX-impacting work,
validation MUST include visual or interaction checks at mobile and desktop
sizes. Defects discovered during review MUST be fixed or explicitly deferred
with owner and due date before release approval. Rationale: objective evidence,
not intent, determines readiness.

## Delivery Standards

- Specifications MUST include explicit acceptance criteria for code quality,
	reusability decisions, UX consistency, and responsive behavior.
- Implementation plans MUST define constitution gates and identify any justified
	exceptions before build work starts.
- Task lists MUST include quality checks, reuse verification, and responsive UX
	validation tasks alongside implementation tasks.
- Feature completion claims MUST include links to tests, lint/type results, and
	responsive verification artifacts.

## Workflow and Review Policy

- Pull requests MUST include a constitution compliance checklist and evidence for
	each applicable principle.
- Reviewers MUST block merges when principles are unmet or evidence is missing.
- Exceptions MUST be documented with scope, risk, mitigation, owner, and
	expiration date.
- Releases MUST include a final compliance pass confirming all blocking defects
	are resolved or formally deferred.

## Governance

This constitution overrides conflicting local conventions. Amendments require a
documented proposal, reviewer approval by repository maintainers, and updates
to affected templates or guidance files in the same change set.

Versioning policy follows semantic versioning for governance:
- MAJOR: Removal or incompatible redefinition of a principle or governance rule.
- MINOR: New principle or materially expanded mandatory guidance.
- PATCH: Clarifications, wording improvements, and non-semantic refinements.

Compliance review expectations:
- Every feature plan MUST pass Constitution Check before implementation.
- Every pull request MUST confirm principle compliance with concrete evidence.
- Periodic audits MAY be run; unresolved violations MUST create tracked
	remediation tasks.

**Version**: 1.0.0 | **Ratified**: 2026-04-20 | **Last Amended**: 2026-04-20
