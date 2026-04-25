---
name: prd
description: Turn conversation context into a PRD saved as prd.md.
---

# PRD

When this skill is activated, start your response with `🪨 Using skill: prd`.

This skill takes the current conversation context and codebase understanding and produces a PRD. Do not conduct a discovery interview — synthesize from existing context. A single confirmation step (module check) is fine.

## Process

1. Explore the repo to understand the current state of the codebase, if you haven't already. Focus on areas relevant to the stated goal — don't try to read everything.

2. Sketch out the major modules you will need to build or modify to complete the implementation. Check with the user that these modules match their expectations.

3. Write the PRD using the template below and save it as `prd.md` in the project root. If `prd.md` already exists, show the user and ask whether to overwrite or save as `prd-<topic>.md`.

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

## Errors

- If there's no conversation context or stated goal to synthesize from, stop and ask the user what feature to write a PRD for.
- If the goal is too vague to produce meaningful user stories, stop and suggest using the `grill` skill first.

## Rules

- **Do not conduct a discovery interview.** Synthesize from what you already know — the conversation and the codebase. The module confirmation step is the only back-and-forth.
- **Check modules first.** Before writing the full PRD, list the major modules and confirm with the user.
- **User stories must be extensive.** Cover every aspect of the feature. More is better.
- **No file paths or code snippets** in the PRD. They go stale fast.
- **Save as `prd.md`** in the project root.
- **Offer to explain.** After saving the PRD, ask: "Do you want me to explain?" If the user says yes, invoke the `explain` skill to read the PRD aloud.
