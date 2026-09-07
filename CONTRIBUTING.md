# Contributing

This repository documents a vendor-agnostic multi-agent **reference architecture** — **brain · workers · ops**. Goose, Cursor, Codex, and CLIs are *examples*, not dependencies. The goal is that Staff teams can swap a runtime without rewriting the domain.

Propose changes through issues and pull requests. Do not commit to `main`.

## How to propose an ADR

An [Architectural Decision Record](https://adr.github.io/) captures **one** architecturally significant decision and its rationale — the forces, the choice, and the consequences. The existing log uses [Nygard's short form](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) (Status · Context · Decision · Consequences), which is the format already used under `docs/adr/`.

### 1. Open an issue first

Use the **Propose an ADR** issue template (`.github/ISSUE_TEMPLATE/propose-adr.yml`). State the problem, the options you considered, and why the decision is architecturally significant.

An ADR is warranted when the change affects:

- Layer boundaries (**brain** vs **workers** vs **ops**)
- Human-in-the-loop (HITL) or fail-closed write policy
- Protocol choices (for example [MCP](https://modelcontextprotocol.io/docs/learn/architecture) for agent-to-tool context, or [A2A](https://a2a-protocol.org/latest/topics/what-is-a2a/) for agent-to-agent collaboration)
- Vendor lock-in or a runtime swap that would force a domain rewrite

Skip an ADR for typos, wording, and other hygiene. Prefer the [simplest composable pattern](https://www.anthropic.com/engineering/building-effective-agents) that solves the problem; add complexity only when it demonstrably improves outcomes.

### 2. Draft the record

Copy the next unused number. Never reuse a number. If a decision is reversed, keep the old file and mark it `Superseded` with a pointer to the replacement.

```text
docs/adr/NNNN-short-title-with-dashes.md
```

Example of an existing record:

```text
docs/adr/0001-brain-vs-workers.md
```

Use this skeleton (match the current log; optional MADR sections are welcome when trade-offs need them):

```markdown
# ADR NNNN — Short title

## Status
Proposed

## Context
Value-neutral facts and forces. What problem are we answering?

## Decision
The response, in full sentences. "We will …"

## Consequences
Positive, negative, and neutral results after the decision is applied.
```

Optional sections when they add signal (from [MADR](https://adr.github.io/madr/)): **Decision Drivers**, **Considered Options**, **Pros and Cons of the Options**. Keep the record to one or two pages.

Status lifecycle: `Proposed` → `Accepted` | `Rejected` | `Deprecated` | `Superseded by ADR-NNNN`.

### 3. Open a pull request

One ADR per PR when the decision is the change. Link the issue. Fill in `.github/PULL_REQUEST_TEMPLATE.md`. Reviewers accept the decision by merging; the author then sets **Status** to `Accepted` if it is still `Proposed`.

## Pull requests

- Branch from `main`; never push commits to `main`.
- Keep PRs focused. Hygiene and new ADRs do not belong in the same PR.
- Commands and paths in descriptions stay in English fences:

```text
docs/adr/0004-example-decision.md
```

## Decision log

Accepted records live in `docs/adr/`. Start from the [ADR index](docs/adr/README.md) (also linked from the README). Read them before proposing a new one — especially:

- [0001 — Brain vs workers](docs/adr/0001-brain-vs-workers.md)
- [0002 — HITL on writes](docs/adr/0002-hitl-on-writes.md)
- [0003 — Vendor-agnostic](docs/adr/0003-vendor-agnostic.md)
- [0004 — Handoff contracts](docs/adr/0004-handoff-contracts.md)

Runtime swap without a domain rewrite: [docs/swap-runtime.md](docs/swap-runtime.md). Typed handoff payloads: [docs/cookbook-handoff.md](docs/cookbook-handoff.md).

## Principles (do / don't)

**Do**

- Record one decision per ADR, with context and consequences.
- Treat MCP (host / client / server, tools · resources · prompts) as the agent-to-tool protocol, not as a vendor.
- Treat A2A as complementary: agent-to-agent collaboration without wrapping agents as tools.
- Keep HITL (or an explicit allowlist) on writes; fail closed.
- Pass work between layers as a typed handoff envelope ([ADR 0004](docs/adr/0004-handoff-contracts.md)), not a pasted transcript.
- Name examples (Goose, Cursor, Codex, Kiro) as examples only.

**Don't**

- Lock the architecture to one IDE, model vendor, or framework.
- Mix brain planning with worker tool secrets.
- Add an ADR without an issue and a PR.
- Rewrite superseded ADRs in place — supersede them.

## License

Contributions are licensed under [MIT](LICENSE).
