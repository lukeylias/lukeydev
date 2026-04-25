---
name: overview
description: High-level overview of the current repository.
---

# Repo Overview

Give a short, conversational briefing about the current repository. Keep it to 10-15 lines max.

When this skill is activated, start your response with `🪨 Using skill: overview`.

## Steps

1. Read the top-level directory listing
2. Read `README.md` if it exists (first 100 lines is enough)
3. Check for a package manifest (`package.json`, `Cargo.toml`, `requirements.txt`, `go.mod`, `pyproject.toml`, `Gemfile`, `pom.xml`)
4. If run commands aren't obvious from the README, check `package.json` scripts, `Makefile`, `Dockerfile`, or `docker-compose.yml`

## Output format

Respond with a brief summary covering:

- **What it is** — one sentence on what the project does
- **Stack** — language, framework, key tools
- **Run locally** — numbered list of commands to get it running (setup + dev server)
- **Structure** — top-level folders, one-liner each (only the important ones)
- **Safety net** — whether tests or CI exist ("tests: npm run test" or "no tests found")

## Rules

- Keep it conversational and scannable — not a wall of text
- Don't guess. If you can't find run commands, say so
- Don't run any commands — just read files and report
- If it's a monorepo, summarise the top level and note which packages/apps exist
- Skip obvious folders like `node_modules`, `.git`, `dist`, `build`
