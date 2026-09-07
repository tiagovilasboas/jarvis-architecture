# Agent notes

Vendor-agnostic multi-agent **reference architecture** (brain · workers · ops). Runtimes are examples. Read [CONTRIBUTING.md](CONTRIBUTING.md) before changing the decision log.

## Layout

```text
docs/adr/README.md
docs/adr/NNNN-short-title-with-dashes.md
docs/swap-runtime.md
```

Existing records: `0001-brain-vs-workers`, `0002-hitl-on-writes`, `0003-vendor-agnostic`. Index: `docs/adr/README.md`.

## Do

- Propose one architecturally significant decision per ADR (issue → draft → PR).
- Use Status · Context · Decision · Consequences; keep records short.
- Treat [MCP](https://modelcontextprotocol.io/docs/learn/architecture) as agent-to-tool context (host / client / server).
- Treat [A2A](https://a2a-protocol.org/latest/topics/what-is-a2a/) as complementary agent-to-agent collaboration — do not wrap agents as tools.
- Prefer [simple, composable patterns](https://www.anthropic.com/engineering/building-effective-agents); fail closed on writes (HITL or explicit allowlist).

## Don't

- Lock the architecture to one vendor, IDE, or framework.
- Mix brain planning with worker production secrets.
- Add or rewrite ADRs on `main`, or silently replace a superseded decision.
- Bundle hygiene with a new ADR in the same PR.
