# ADR 0004 — Handoff contracts

## Status
Accepted

## Context
[ADR 0001](0001-brain-vs-workers.md) splits brain from workers and still needs a thin orchestration contract. Passing a raw transcript across layers makes HITL, evals, and runtime swap untestable: ops cannot resume or approve a write it cannot reconstruct.

## Decision
We will pass work between **brain**, **workers**, and **ops** as a **typed handoff envelope**, not a chat dump. The envelope carries identity, from/to, kind, goal, **refs** (not blobs), write_policy, acceptance, and observability. Writes stay fail-closed ([ADR 0002](0002-hitl-on-writes.md)). A2A, ACP, MCP, and host SDKs are mappings, not the definition ([ADR 0003](0003-vendor-agnostic.md)).

## Consequences
+ HITL and evals bind to one id
+ Host swap keeps the same shape
− Unknown required fields fail closed
− Chat-only hosts need a thin adapter

Practical shape and example payloads: [cookbook — Envelope](../cookbook-handoff.md#envelope).
