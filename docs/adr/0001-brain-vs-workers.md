# ADR 0001: Brain vs workers

## Status
Accepted

## Context
A single agent that plans, calls every tool, and applies side effects in one context window mixes three jobs. HITL cannot tell who proposed a write. Evals cannot score a worker without scoring the planner. Swapping a tool surface means rewriting the planner's secrets and prompts.

The alternative is not "more agents." Wrapping a peer agent as an MCP tool collapses the same jobs into a tool call ([What is A2A?](https://a2a-protocol.org/latest/topics/what-is-a2a/)).

## Decision
We will separate **brain** (plan and route) from **workers** (scoped execution with tools).

- Brain decomposes a goal into typed assigns. It does not hold production secrets for every tool surface.
- Workers execute a narrow scope. They fetch refs with their own credentials and call only an allowlisted tool set.
- A worker does not re-plan the whole job. A brain does not execute the worker's tools.

This is the layer split. The envelope that carries work across it is [ADR 0004](0004-handoff-contracts.md).

## Consequences
Positive:
- Worker evals and HITL bind to one scope.
- Tool credentials stay at the worker edge, so a host swap does not copy planner secrets ([ADR 0003](0003-vendor-agnostic.md)).

Negative:
- You need a thin orchestration contract (now [ADR 0004](0004-handoff-contracts.md)).
- A brain that silently re-enters tools is a failed control, not a shortcut.

Neutral:
- Role names are worker scopes, not vendor or kit names. Do not copy [kiro-crew](https://github.com/tiagovilasboas/kiro-crew) seats or grok-bot specialists into `role`.

## Related
The contract that fills that gap: [ADR 0004](0004-handoff-contracts.md) · [cookbook](../cookbook-handoff.md#envelope).
