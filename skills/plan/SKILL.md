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
- `## After implementation` — reminder to run `/skill:review` against the full implementation diff

Each phase section contains:

- `### Phase N: <name>`
- `**Goal:**` what this phase delivers end-to-end
- `**User stories:**` which user stories from the PRD this phase covers (if source is a PRD, otherwise omit)
- `**Files:**` specific paths
- `**Steps:**` bullet list of concrete tasks
- `**Done when:**` checklist of observable criteria
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

## After implementation section format

The `## After implementation` section should contain a single prompt:

> Once all phases are complete, run `/skill:review diff` to catch implementation issues, accessibility gaps, and missed requirements.

## After saving

**⚠️ Do not auto-fix any findings from the review. Do not act on them. Present and stop.**

1. **On first save only** (i.e., when the plan is being created for the first time in this session): immediately invoke the `review` subagent in spawn mode. If `prd.md` exists, use this task: *"Review the plan at [path to plan.md] against the PRD at [path to prd.md]. Focus on: phase ordering (does any phase depend on a later phase, or leave the system in a broken intermediate state?), hidden coupling (are there code paths or render branches the plan misses, especially fallback/wrapped/edge cases?), untestable phases (every phase needs a clear 'done when' criterion), risky or irreversible steps without rollback notes, scope creep (phases adding behaviour not in the PRD), and missing verification (phases that change behaviour with no test point). Do not rewrite the plan. Flag issues with file:line references where possible. Critical means 'would cause a broken intermediate state or miss requirements.' Important means 'would cause rework.' Proportional depth: if the artefact is short or simple, your review should be short. Don't manufacture findings. No findings is a valid review result."* If `prd.md` does not exist, use the same task but omit the 'against the PRD' clause and the scope-creep focus point, and tell the user the scope-creep check was skipped because no `prd.md` was found. Present the subagent's findings to the user exactly as returned. **After presenting findings, stop and wait for the user's explicit instruction. Do not interpret. Do not fix. Do not continue with prior tasks until the user directs you.**
2. If the user iterates on the plan and saves again, do **not** re-trigger the review automatically. If the user wants a fresh review after iteration, they can ask explicitly via `/skill:review`.
3. Ask: **"Do you want to iterate on the plan before proceeding?"** Wait for the user to respond before doing anything else.
4. Once the user is satisfied, offer to explain: "Do you want me to explain?" — if yes, invoke the `explain` skill

**⚠️ Do not auto-fix any findings from the review. Do not act on them. Present and stop.**

## Errors

If the plan can't be produced sensibly (goal too vague, required context missing), stop and ask the user. Don't guess.
