# ADR 0005 — Ops owns reconstruction

## Status
Accepted

## Context
[ADR 0004](0004-handoff-contracts.md) typed the envelope. Hosts still treat ops as a vendor HUD: a red eval or an unreplayable write disappears into a new chat, so the next runtime cannot score the same control.

## Decision
We will treat **ops** as the reconstruction and measurement plane, not a host HUD. Outcomes — `ok`, `blocked`, `failed`, and eval rows — are typed `result` / `ops_event` records bound to the handoff `id` and `trace_id`. A write that ops cannot rebuild from envelope fields does not proceed. Host dashboards are adapters ([ADR 0003](0003-vendor-agnostic.md)).

## Consequences
+ Failed controls survive a host swap
+ Unreconstructable writes never execute
− Chat-only hosts need an ops adapter (same class of cost as ADR 0004)
− In-thread retry without a new `id` is a failed control

Failure payloads: [cookbook — ops failure](../cookbook-handoff.md#ops-failure).
