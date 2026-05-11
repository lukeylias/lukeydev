---
name: prd
description: Turn conversation context into a PRD saved as prd.md.
---

# PRD

When this skill is activated, start your response with `🪨 Using skill: prd`.

This skill is designed to be invoked automatically at the end of a `shape` session. It takes the resolved decisions and shared understanding from the shape and produces a PRD. Do not conduct a discovery interview or re-confirm decisions that were just made.

## Step 0: Resolve the project root

Before writing any output file, determine the correct project root:

1. Run `git rev-parse --show-toplevel` and capture the output.
2. If it succeeds, use that path as the project root.
3. If it fails (not a git repo), use the directory the session was started in.
4. Never write to `~/.pi/agent` or any path inside it. If the resolved path matches the agent's installation directory, stop and ask the user where to save instead.
5. State the resolved path to the user before writing: "Saving prd.md to `<resolved-path>`."

## Process

1. Synthesise the resolved decisions from the shape session into the PRD template below. Use any codebase understanding already established during the shape — do not re-explore unless something is genuinely unclear.

2. Sketch the major modules that will be built or modified to implement the feature. For each module, give it a name and describe its interface in one sentence. Actively look for opportunities to make modules **deep** — small, simple interfaces with substantial functionality hidden behind them (the opposite of shallow modules with lots of surface area but little behind them). Present the sketch to the user and ask: "Do these modules match your expectations? Any you'd carve up differently?" Wait for confirmation before proceeding.

3. Write the PRD using the template below and save it as `prd.md` in the project root resolved in Step 0. The full path should be `<resolved-path>/prd.md`. If `prd.md` already exists at that path, show the user and ask whether to overwrite or save as `prd-<topic>.md`.

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

## Modules
A list of the major modules to be built or modified. For each, give its name and a one-sentence description of its interface. Keep it short — no code, no file paths.

## Implementation Decisions
A list of implementation decisions that were made. This can include:
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
- **Sketch modules before writing the template. Confirm with the user before proceeding.**
- **Do not re-confirm decisions** that were already resolved in the shape session. The module sketch is the only confirmation step — everything else moves straight to writing.
- **User stories must be extensive.** Cover every aspect of the feature. More is better.
- **No file paths or code snippets** in the PRD. They go stale fast.
- **Save as `prd.md`** in the project root resolved in Step 0.

## After saving

1. Immediately invoke the `review` subagent in spawn mode with the following task: *"Review the PRD at [path to prd.md]. Focus on: ambiguity (words or requirements that could be interpreted multiple ways), missing context (assumptions from the shape session that didn't make it onto the page), unstated dependencies between decisions, scope gaps (edge cases, empty states, error states not addressed), acceptance criteria that aren't testable, and in-scope vs out-of-scope confusion. Do not flag style preferences. Do not suggest implementation. Only flag things that would cause a planning agent or developer to ask 'wait, what does this mean?' Proportional depth: if the artefact is short or simple, your review should be short. Don't manufacture findings. No findings is a valid review result."* Present the subagent's findings to the user exactly as returned — do not interpret, summarise, or act on them.
2. Ask: **"Do you want to iterate on the PRD before proceeding?"** Wait for the user to respond before doing anything else.
3. Once the user is satisfied, offer to explain: "Do you want me to explain?" — if yes, invoke the `explain` skill
