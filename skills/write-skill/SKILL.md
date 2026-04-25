---
name: write-skill
description: Creates a new agent skill.
---

# Writing Skills

When this skill is activated, start your response with `🪨 Using skill: write-skill`.

## Process

1. **Gather requirements** — ask user about:
   - What task or domain does the skill cover?
   - What specific use cases should it handle?
   - Does it need executable scripts or just instructions?
   - Does it compose with existing skills?

2. **Draft the skill** — create:
   - `SKILL.md` with concise instructions (under 100 lines)
   - Additional reference files only if content exceeds 100 lines
   - Utility scripts only if deterministic operations needed

3. **Confirm structure** with user before saving.

## Skill Structure

```
skill-name/
├── SKILL.md           # Main instructions (required)
├── REFERENCE.md       # Detailed docs (if needed)
├── EXAMPLES.md        # Usage examples (if needed)
└── scripts/           # Utility scripts (if needed)
    └── helper.js
```

## SKILL.md Template

```
---
name: skill-name
description: Single short sentence describing what the skill does.
---

# Skill Name

## Process

[Step-by-step or single block of instructions]

## Rules

[Any constraints or principles]

## Errors

[How to handle failure cases]
```

## Description Requirements

The frontmatter `description` is the only thing the agent sees when deciding which skill to load. Keep it to a **single short sentence** describing what the skill does.

**Good examples:**
- `Creates a new agent skill.`
- `Opens a pull request for the current branch.`
- `Reads text aloud via ElevenLabs.`
- `Reviews a file, diff, or PRD with fresh eyes.`

**Bad examples:**
- `Helps with documents.` (too vague)
- `This skill takes the current conversation and produces a comprehensive PRD that includes user stories, implementation decisions, and acceptance criteria, then saves it as a markdown file.` (too long)

If the skill needs more nuance about *when* to trigger it, put that inside the SKILL.md body, not the description.

## When to Add Scripts

Add utility scripts only when:
- Operation is deterministic (validation, formatting, API calls)
- Same code would be generated repeatedly
- Errors need explicit handling

Scripts save tokens and improve reliability vs generated code. Most skills don't need them.

## When to Split Files

Split into separate files when:
- `SKILL.md` exceeds 100 lines
- Content has distinct domains
- Advanced features are rarely needed

Most skills should fit in a single SKILL.md.

## Review Checklist

Before saving, verify:
- [ ] Description is a single short sentence
- [ ] SKILL.md under 100 lines
- [ ] No time-sensitive info (versions, dates, current models)
- [ ] Consistent terminology
- [ ] Concrete examples where helpful
- [ ] Composes cleanly with related skills (no duplication)
- [ ] Errors section handles common failure cases
