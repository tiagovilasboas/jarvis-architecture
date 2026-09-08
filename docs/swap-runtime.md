# Swap a runtime without rewriting the domain

Goal of this repo: Staff teams can change the **host / harness** (Goose, Cursor, Codex, a CLI, …) without rewriting domain prompts, worker scopes, or ops policy. Runtimes are *examples*; the durable surface is **layers + open protocols**.

Aligned with:

- [ADR 0001 — Brain vs workers](adr/0001-brain-vs-workers.md)
- [ADR 0002 — HITL on writes](adr/0002-hitl-on-writes.md)
- [ADR 0003 — Vendor-agnostic](adr/0003-vendor-agnostic.md)
- [ADR 0004 — Handoff contracts](adr/0004-handoff-contracts.md) · [cookbook](cookbook-handoff.md#week-1)
- [ADR 0005 — Ops owns reconstruction](adr/0005-ops-owns-reconstruction.md)
- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (prefer simple, composable patterns; add complexity only when it improves outcomes)
- [MCP architecture](https://modelcontextprotocol.io/docs/learn/architecture) (agent-to-tool context: host / client / server)
- [What is A2A?](https://a2a-protocol.org/latest/topics/what-is-a2a/) (agent-to-agent collaboration; do not wrap agents as tools)

## Stable vs replaceable

| Keep stable (domain) | May change (runtime edge) |
| --- | --- |
| Layer contracts: brain plans/routes; workers execute in narrow scope; ops owns logs, evals, HITL | IDE / CLI / SDK that hosts the session |
| Worker tool *surfaces* described as MCP servers (tools · resources · prompts) | Which MCP host wires those servers |
| Write policy: fail closed (HITL or allowlist) | How the host surfaces approval UX |
| Brain↔worker↔ops [handoff envelope](adr/0004-handoff-contracts.md) (`handoff/v1`) | Model vendor, sampling knobs, and how the host serializes the envelope |
| Ops reconstruction: `result` / `ops_event` bound to `id` + `trace_id` ([ADR 0005](adr/0005-ops-owns-reconstruction.md)) | Which HUD or ticket system renders the incident |
| Agent-to-agent collaboration via A2A when peers must negotiate | Whether peers live in one process or across vendors |

## Protocol split (do not collapse)

```text
Brain  --plan/route-->  Workers  --tools/data-->  MCP servers
  |                        |
  +---- A2A (peers) -------+     Ops: logs · evals · HITL on writes
```

- **MCP** connects an agent to **tools and context**. Participants: host (app), client (per server), server (context provider). See [MCP architecture](https://modelcontextprotocol.io/docs/learn/architecture).
- **A2A** connects **agents to agents** as autonomous peers. Wrapping another agent as an MCP tool is the anti-pattern called out in [What is A2A?](https://a2a-protocol.org/latest/topics/what-is-a2a/).
- Prefer the [orchestrator–workers](https://www.anthropic.com/engineering/building-effective-agents) pattern when the brain decomposes work dynamically; keep that logic in the brain layer, not inside a vendor SDK.

## Checklist before swapping the host

1. **Inventory domain assets** that must survive: brain system prompts, worker scopes, MCP server configs (or equivalents), HITL allowlists, eval suites.
2. **List host-only glue** you expect to rewrite: session bootstrap, secret injection, approval UI, file/workspace roots.
3. **Confirm secrets stay at the worker edge** — brain must not hold production credentials for every tool ([ADR 0001](adr/0001-brain-vs-workers.md)).
4. **Re-bind MCP servers** in the new host; keep server IDs and tool names stable so worker prompts stay valid.
5. **Re-wire HITL** for merges, payments, deletes, and external messages ([ADR 0002](adr/0002-hitl-on-writes.md)). Fail closed until the new approval path is tested.
6. **Re-bind the handoff adapter** so `assign` / `result` / `hitl_*` keep [ADR 0004](adr/0004-handoff-contracts.md) field names. Do not replace the envelope with a host transcript ([cookbook](cookbook-handoff.md)).
7. **Re-bind ops scoring** so `failed` / `blocked` and eval rows keep the same `id` and `trace_id` ([ADR 0005](adr/0005-ops-owns-reconstruction.md)). A host incident ticket is an adapter, not the outcome.
8. **Smoke the same eval** (or a thin dry-run) against the new host; if quality drops, fix the glue — do not fork the domain prompts for one vendor.
9. **Name the new host as an example** in docs, never as the definition of the architecture ([ADR 0003](adr/0003-vendor-agnostic.md)).

## What “done” looks like

You swapped successfully when a Staff engineer can:

1. Point a different host at the same brain/worker docs and MCP servers.
2. Keep HITL (or the allowlist) on writes without a domain rewrite.
3. Score a `failed` result from the same `ops_event` ids — a host ticket is an adapter ([ADR 0005](adr/0005-ops-owns-reconstruction.md)).
4. Explain the change in one ADR or a short note — not a rewrite of `docs/adr/0001`–`0005`.

## Out of scope here

- Product monorepo wiring, private HUD, or vendor marketing.
- New architecturally significant decisions — propose those via [CONTRIBUTING.md](../CONTRIBUTING.md) and the [decision log](adr/README.md).
