---
name: plan
description: Break a goal into executable phases.
---

# Plan

When this skill is activated, start your response with `🪨 Using skill: plan`.

Turn a PRD, spec, or clear goal into a phased plan. The output is `plan.md` in the project root. That's it — this skill does not execute the plan.

Skip planning for one-line changes, typos, or obvious fixes — unless the user explicitly asks for a plan.

## Step 0: Resolve the project root

Before writing any output file, determine the correct project root:

1. Run `git rev-parse --show-toplevel` and capture the output.
2. If it succeeds, use that path as the project root.
3. If it fails (not a git repo), use the directory the session was started in.
4. Never write to `~/.pi/agent` or any path inside it. If the resolved path matches the agent's installation directory, stop and ask the user where to save instead.
5. State the resolved path to the user before writing: "Saving plan.md to `<resolved-path>`."

## Input

1. If `prd.md` exists, use it as the source of truth
2. If not, check for `spec.md`
3. If neither exists, work from the user's stated goal
4. If the goal is too vague to plan, stop and suggest writing a PRD first using the `prd` skill

## Steps

1. Read the source document and any relevant source files
2. Scan for existing conventions: `AGENTS.md`, `CLAUDE.md`, `README.md`, `CONTRIBUTING.md`, or similar. Note any relevant patterns (framework, style, testing, routing, naming) in the plan's Context section
3. Break the work into **vertical slices**. Each phase is a thin end-to-end pass that cuts through all layers (schema, API, logic, UI, tests) — not a horizontal slice of one layer. Each phase should deliver something demoable or verifiable on its own.
4. Write `plan.md` in the project root resolved in Step 0. The full path should be `<resolved-path>/plan.md`.
5. **Tell the user the plan is ready for review.** Done.

## Plan format

The generated `plan.md` should follow this structure:

- `# Plan: <title>`
- `## Objective` — one sentence, what this plan delivers
- `## Context` — what's being built or changed, what source document this plans (if any), relevant conventions found in the codebase
- `## Out of scope` — what this plan explicitly does not do
- `## Phases` — one section per phase, structure below
- `## Assumptions and risks` — short list, only what affects phasing
- `## Testing` — plain-English one-liners the user can use to verify the work once it's been built

Each phase section contains:

- `### Phase N: <name>`
- `**Goal:**` what this phase delivers end-to-end
- `**User stories:**` which user stories from the PRD this phase covers (if source is a PRD, otherwise omit)
- `**Files:**` specific paths
- `**Steps:**` bullet list of concrete tasks
- `**Done when:**` checklist of observable criteria — always includes `- [ ] Run /skill:review diff — no critical issues before proceeding to next phase`
- `**Re-plan if:**` conditions that invalidate this phase

## Testing section format

The `## Testing` section at the end of the plan should contain simple, human-readable one-liners that tell the user how to verify the work. These are manual checks, not automated tests.

Examples:
- "Open the app and check the nav bar shows on mobile"
- "Run `npm test` and confirm all tests pass"
- "Visit /settings and toggle dark mode on and off"

Keep them short, practical, and tied to what the plan actually delivers.

## Rules

- **Vertical slices, not horizontal layers.** Each phase delivers a thin but complete path through every layer. "Add login flow end-to-end" not "Phase 1: database, Phase 2: API, Phase 3: UI."
- **Be concrete.** "Update the header" is not a step. "Edit `Header.tsx` to accept `isMobile` prop and render `MobileNav` conditionally" is.
- **No inline code.** Steps describe intent, not implementation.
- **Phase sizing.** Each phase should involve files the agent can hold in context. If a phase touches 20+ files, split it.
- **Phase count.** Aim for 3–7 phases. Over 10 is almost always over-phasing.
- **One phase can be enough.** Don't pad with artificial phases. Small work deserves small plans.
- **Do not execute the plan.** This skill produces `plan.md` and nothing else.

## After saving

1. Tell the user the plan is saved and suggest they run `/skill:review plan` if they'd like a fresh review
2. Ask: **"Do you want to iterate on the plan before proceeding?"** Wait for the user to respond before doing anything else
3. Once the user is satisfied, offer to explain: "Do you want me to explain?" — if yes, invoke the `explain` skill

## Errors

If the plan can't be produced sensibly (goal too vague, required context missing), stop and ask the user. Don't guess.
