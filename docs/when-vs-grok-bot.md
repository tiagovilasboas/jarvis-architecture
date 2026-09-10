# When to use this repo vs grok-bot vs kiro-crew

These three are related, not substitutes and not ports of each other. Pick by the artifact you need.

- Use **this repo** when you need the host-agnostic layer model (**brain · workers · ops**) and a typed `handoff/v1` envelope that survives a runtime swap. The ADR log, [cookbook](cookbook-handoff.md#week-1), and [swap-runtime](swap-runtime.md) live here.
- Use **[grok-bot-architecture](https://github.com/tiagovilasboas/grok-bot-architecture)** when you are standing up a desktop assistant OS: chief-of-staff, specialists, shared computer, connectors, routines. It is a product-shaped pattern (example host: Grok Bot / Cursor), not this layer log.
- Use **[kiro-crew](https://github.com/tiagovilasboas/kiro-crew)** when you need pasteable role cards (Planner → Implementer → Reviewer → Ops) and a board for one crew in an agentic IDE. Kiro is the example host; the cards are the kit.
- Do not treat kiro-crew seats or grok-bot specialists as implementations of [ADR 0001](adr/0001-brain-vs-workers.md)–[0005](adr/0005-ops-owns-reconstruction.md), and do not copy those kit names into the envelope `role` field. `role` is a worker scope.
- If you only need evals or AppSec `path:line` review, open [agent-measurement](https://github.com/tiagovilasboas/agent-measurement) or [agentic-code-review](https://github.com/tiagovilasboas/agentic-code-review) instead. Those are scoped kits too.

Layer contracts stay in this repo. Crew cards stay in kiro-crew. Desktop OS stay in grok-bot-architecture.
