# Jarvis Architecture

**PT** · Arquitetura de **referência** multi-agent: **brain · workers · ops**. Agnóstica de vendor — Goose, Cursor, Codex, CLIs são *exemplos*, não dependências.

**EN** · **Reference** multi-agent architecture: **brain · workers · ops**. Vendor-agnostic — Goose / Cursor / Codex / CLIs are *examples*, not hard deps.

Maintainer: [Tiago Montanha](https://github.com/tiagovilasboas) · Staff · Agentic AI

> Jarvis = nome do modelo mental. Este repo **não** é o monorepo privado de produto.

---

## Modelo / Model

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Brain     │────▶│  Workers         │────▶│  Ops / HUD  │
│ (planner)   │◀────│  (scoped agents) │◀────│  logs HITL  │
└─────────────┘     └──────────────────┘     └─────────────┘
```

| Peça | PT | EN |
|---|---|---|
| Brain | Planeja, decompõe, escolhe worker | Plans, decomposes, routes |
| Workers | Escopo estreito + tools | Narrow scope + tools |
| Ops | Logs, evals, HITL em write | Logs, evals, HITL on writes |

---

## ADRs (esqueleto)

- `docs/adr/0001-brain-vs-workers.md` — por que separar
- `docs/adr/0002-hitl-on-writes.md` — fail closed em mutação
- `docs/adr/0003-vendor-agnostic.md` — trocar runtime sem reescrever domínio

---

## O que entra / What belongs

- Padrões, anti-padrões, diagramas, checklists Staff
- Exemplos com **nomes genéricos** (sem IP de cliente)

## O que não entra / Out of scope

- Binding a um único IDE/vendor
- Código de produção confidencial
- Open Finance / produtos fechados

Relacionados: [awesome-agentic-ai](https://github.com/tiagovilasboas/awesome-agentic-ai) · [agent-measurement](https://github.com/tiagovilasboas/agent-measurement)

---

## License

MIT
