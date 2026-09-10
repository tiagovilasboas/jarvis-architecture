# ADR 0002: HITL on writes

## Status
Accepted

## Context
Merges, payments, deletes, deploys, and messages sent as a user are hard to undo. An agent that applies them from a chat "LGTM" skips the only control ops can reconstruct.

Reads (diff, log, eval) can be optimistic. Writes cannot. An implicit "the model looked safe" is not a policy.

## Decision
We will **fail closed on writes**. A mutation requires human-in-the-loop or an **explicit, named allowlist**.

- Default `write_policy` is `hitl`.
- `allowlist` names the action and its parameters. It is not a vibe.
- Timeout without a decision **blocks** the write.
- A write that already ran under `hitl` without a matching `hitl_decision` is a bug, not `ok`.

Reads may stay optimistic. CI fixtures: [`examples/handoff.broken.json`](../../examples/handoff.broken.json) (silent write, rejected) and [`examples/handoff.fixed.json`](../../examples/handoff.fixed.json) (`needs_hitl`, accepted).

## Consequences
Positive:
- Approvers see canonical `proposed_writes.params`, not a truncated HUD.
- Aligns with AppSec / AISVS agentic controls (high-impact approval, fail closed on timeout).

Negative:
- Demos are slower. Document the gate; do not hide it.

Neutral:
- Ops reconstruction of an unreplayable write is [ADR 0005](0005-ops-owns-reconstruction.md).

## Related
Write-path payloads: [cookbook: propose a merge](../cookbook-handoff.md#propose-a-merge).
