---
name: prd
description: Turn conversation context into a PRD saved as prd.md.
---

# PRD

When this skill is activated, start your response with `🪨 Using skill: prd`.

This skill is designed to be invoked automatically at the end of a `shape` session. It takes the resolved decisions and shared understanding from the shape and produces a PRD. Do not conduct a discovery interview or re-confirm decisions that were just made.

## Process

1. Synthesise the resolved decisions from the shape session into the PRD template below. Use any codebase understanding already established during the shape — do not re-explore unless something is genuinely unclear.

2. Write the PRD using the template below and save it as `prd.md` in the project root. If `prd.md` already exists, show the user and ask whether to overwrite or save as `prd-<topic>.md`.

## Template

The generated `prd.md` should follow this structure:

```markdown
# PRD: <title>

## Problem Statement
The problem that the user is facing, from the user's perspective.

## Solution
The solution to the problem, from the user's perspective.

## User Stories
A comprehensive numbered list of user stories (aim for 10+, covering happy paths, edge cases, and error states). Format:

> As a [user type], I want [capability], so that [benefit]

Example:

1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending

## Implementation Decisions
A list of implementation decisions that were made. This can include:
- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

## Acceptance Criteria
Observable criteria that define when this is done. Can include:
- Behavioural expectations
- Manual check steps
- Performance or quality criteria

## Out of Scope
A description of the things that are out of scope for this PRD.

## Further Notes
(Optional) Any further notes about the feature. Omit if nothing to add.
```

## Rules

- **Do not conduct a discovery interview.** The shape session already produced the decisions — synthesize directly from that.
- **Do not re-confirm modules or decisions.** Everything was resolved in the shape session. Move straight to writing.
- **User stories must be extensive.** Cover every aspect of the feature. More is better.
- **No file paths or code snippets** in the PRD. They go stale fast.
- **Save as `prd.md`** in the project root.

## After saving

1. Tell the user the PRD is saved and suggest they run `/skill:review prd` if they'd like a fresh review
2. Ask: **"Do you want to iterate on the PRD before proceeding?"** Wait for the user to respond before doing anything else
3. Once the user is satisfied, offer to explain: "Do you want me to explain?" — if yes, invoke the `explain` skill
