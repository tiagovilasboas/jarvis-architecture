# Decision log

Architectural Decision Records for this reference architecture. One decision per file. Short form follows [Nygard's template](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) as described on [adr.github.io](https://adr.github.io/) (Status · Context · Decision · Consequences). Optional [MADR](https://adr.github.io/madr/) sections are welcome when trade-offs need them.

How to propose a new record: [CONTRIBUTING.md](../../CONTRIBUTING.md).

## Index

| ADR | Status | Title | One-line |
| --- | --- | --- | --- |
| [0001](0001-brain-vs-workers.md) | Accepted | Brain vs workers | Separate planner (brain) from scoped executors (workers); brain does not hold every tool secret. |
| [0002](0002-hitl-on-writes.md) | Accepted | HITL on writes | Fail closed on mutations: human-in-the-loop or explicit allowlist; reads may be optimistic. |
| [0003](0003-vendor-agnostic.md) | Accepted | Vendor-agnostic runtime | Architecture = layers + open protocols; Goose / Cursor / Codex / Kiro are examples only. |
| [0004](0004-handoff-contracts.md) | Accepted | Handoff contracts | Typed envelope between brain · workers · ops; refs not transcripts; writes stay fail-closed. |

## Status lifecycle

`Proposed` → `Accepted` | `Rejected` | `Deprecated` | `Superseded by ADR-NNNN`

Never reuse a number. When reversing a decision, keep the old file and mark it `Superseded` with a pointer to the replacement.

## Related

- Runtime swap checklist (no domain rewrite): [../swap-runtime.md](../swap-runtime.md)
- Handoff cookbook (payloads): [../cookbook-handoff.md](../cookbook-handoff.md)
- Layer model (brain · workers · ops): [../../README.md](../../README.md)
