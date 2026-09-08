# ADR 0002 — HITL on writes

## Status
Accepted

## Context
Agents that merge, pay, delete, or message externally create irreversible risk.

## Decision
**Fail closed on writes:** mutations require human-in-the-loop (or an explicit allowlist policy). Reads may be optimistic.

## Consequences
+ Safer defaults for Staff delivery
+ Aligns with AppSec / AISVS agentic controls
− Slower demos; document the trade-off

## Related
Write-path payloads: [cookbook — propose a merge](../cookbook-handoff.md#propose-a-merge).
