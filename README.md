# Jarvis Architecture

## Purpose / Propósito

**PT:** Documentar uma **arquitetura de referência** multi-agent — **brain · workers · ops** — agnóstica de vendor. Goose, Cursor, Codex e CLIs aparecem como *exemplos*, não como dependências. Objetivo: times Staff conseguirem **trocar runtime sem reescrever o domínio**.

**EN:** Document a vendor-agnostic multi-agent **reference architecture** — **brain · workers · ops**. Goose, Cursor, Codex, and CLIs are *examples*, not hard dependencies. Goal: Staff teams can **swap runtimes without rewriting the domain**.

> Jarvis = nome do modelo mental. Este repo **não** é o monorepo privado de produto.

Maintainer: [Tiago Montanha](https://github.com/tiagovilasboas) · Staff · Agentic AI

---

## Model

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Brain     │────▶│  Workers         │────▶│  Ops / HUD  │
│ (planner)   │◀────│  (scoped agents) │◀────│  logs HITL  │
└─────────────┘     └──────────────────┘     └─────────────┘
```

| Layer | Responsibility |
|---|---|
| Brain | Plan, decompose, route |
| Workers | Narrow scope + tools (MCP) |
| Ops | Logs, evals, HITL on writes |

---

## ADRs

- [0001 — Brain vs workers](docs/adr/0001-brain-vs-workers.md)
- [0002 — HITL on writes](docs/adr/0002-hitl-on-writes.md)
- [0003 — Vendor-agnostic](docs/adr/0003-vendor-agnostic.md)

---

## Inspired by

- [Goose architecture](https://block-goose.mintlify.app/concepts/architecture) · [agents/subagents](https://block-goose.mintlify.app/concepts/agents)
- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [OpenAI Agents SDK](https://github.com/openai/openai-agents-python)
- [A2A Protocol](https://a2a-protocol.org/) · [ACP](https://agentclientprotocol.com/)
- [LangGraph multi-agent](https://langchain-ai.github.io/langgraph/concepts/multi_agent/)
- [MCP](https://modelcontextprotocol.io)

Related: [awesome-agentic-ai](https://github.com/tiagovilasboas/awesome-agentic-ai) · [agent-measurement](https://github.com/tiagovilasboas/agent-measurement) · [kiro-playbook](https://github.com/tiagovilasboas/kiro-playbook)

## License

MIT
