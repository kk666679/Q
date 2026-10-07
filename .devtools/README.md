# QMS DevTools

Developer tools for analyzing, validating, and managing AI generation logs stored in `.devtools/`.

## Overview

The `.devtools/` directory contains structured JSON logs of AI pipeline executions from two systems:

- **AI RAG Compliance Platform** (`generations.json`) — multi-agent RAG compliance checks
- **Expert Flow Designer Assistant** (`flow-designer-generations.json`) — BPMN process flow generation

These tools help developers inspect, validate, report on, and maintain those logs.

## Available Tools

| Tool | Description |
|------|-------------|
| `analyze` | Summarize generation runs, costs, performance, and provider usage |
| `validate` | Check log integrity, schema conformance, and cross-reference consistency |
| `report` | Generate HTML/JSON reports with charts and metrics |
| `maintain` | Clean up, rotate, or archive old generation logs |

## Usage

```bash
# Analyze all generation logs
npx tsx .devtools/tools/analyze.ts

# Validate log integrity
npx tsx .devtools/tools/validate.ts

# Generate an HTML report
npx tsx .devtools/tools/report.ts --output .devtools/report.html

# Clean up logs older than 90 days
npx tsx .devtools/tools/maintain.ts --retention-days 90
```

## Log Schema

Each log file follows this structure:

```jsonc
{
  "metadata": {
    "system": "ai-rag-compliance-platform",
    "environment": "production",
    "version": "0.1.0",
    "framework": "ai-sdk",
    "generated_at": "ISO_TIMESTAMP",
    "providers": ["openai", "anthropic", "groq"]
  },
  "runs": [
    {
      "run_id": "unique_run_id",
      "session_id": "session_id",
      "user": { "id": "user_id", "role": "role", "org": "org" },
      "request": { "query": "...", "domain": "...", "standards": [], "input_tokens_estimate": 0 },
      "pipeline": { "architecture": "...", "stages": [] },
      "steps": [ /* pipeline step executions */ ],
      "cache": { "enabled": true, "hit": false, "cache_key": "..." },
      "safety": { "moderation_checked": true, "status": "safe", "flags": [] },
      "cost_estimate": { "total_usd": 0, "breakdown": {} },
      "performance": { "total_duration_ms": 0 },
      "ui_render": { "components": [], "interactive": true }
    }
  ]
}
```

## Development

Tools are written in TypeScript and executed with `tsx`. They use only Node.js built-ins and Zod for schema validation.

```bash
# Install tsx if not available
npm install -D tsx

# Run a tool
npx tsx .devtools/tools/analyze.ts
```