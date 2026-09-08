# ADR 0001 — Brain vs workers

## Status
Accepted

## Context
Monolithic agents mix planning, tool use, and side effects in one context window. That hurts HITL, evals, and swapping tools.

## Decision
Separate **brain** (plan/route) from **workers** (scoped execution with tools). Brain must not hold production secrets of every tool surface.

## Consequences
+ Clearer scopes and evals per worker
+ Easier vendor swap at the edge
− Need a thin orchestration contract (prompts/events)

## Related
The contract that fills that gap: [ADR 0004](0004-handoff-contracts.md) · [cookbook](../cookbook-handoff.md#envelope).
