# ADR 0003 — Vendor-agnostic runtime

## Status
Accepted

## Context
Locking architecture to one IDE or model vendor freezes learning and hiring.

## Decision
Architecture is **layers + open protocols** (MCP, A2A/ACP where useful). Goose / Cursor / Codex / Kiro are **examples** in docs, never the definition of the system.

## Consequences
+ Portable mental model
+ Honest comparison of harnesses
− Examples need refresh as products change

## Related
Swap the host without a domain rewrite: [swap-runtime](../swap-runtime.md). Mapping, not the definition: [cookbook](../cookbook-handoff.md#mapping).
