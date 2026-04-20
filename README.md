# Compound Engineering Plugin

> Official cross-IDE agent engineering plugin for Claude Code, Codex, Cursor, and more.

## Overview

The universal bridge connecting agent harnesses (OMC, OMX) to any IDE. Provides converters, parsers, and sync engines ensuring agents work consistently across Claude Code, Cursor, and other environments.

## Architecture

```
Compound Engineering Core
  ├── Commands · Converters · Parsers · Templates
  ├── .claude-plugin (Claude Code)
  ├── .cursor-plugin (Cursor)
  └── Sync Engine (cross-IDE state sync)
```

## Bundled Plugins

| Plugin | Description |
|--------|------------|
| `coding-tutor` | Interactive coding education agent |
| `compound-engineering` | Full compound engineering workflow |

## Key Features

- **Cross-IDE Support** — Claude Code, Cursor, Codex, and more
- **Plugin System** — Modular plugin architecture
- **Converters** — Transform agent configs between IDE formats
- **Sync Engine** — Keep agent state synchronized across IDEs
- **Templates** — Reusable agent configuration templates

## Integration Points

- **OH-MY-ClaudeCode** — Primary Claude Code harness this plugin supports
- **OH-MY-Codex** — Primary Codex harness this plugin supports
- **CLI-Anything** — CLI wrappers exposed as plugin commands
- **Mission Control** — Plugin health visible on dashboard

---
*Part of the InsightProfit Enterprise AI Infrastructure*