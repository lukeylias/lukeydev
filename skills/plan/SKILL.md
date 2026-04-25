---
name: plan
description: Break a goal into executable phases.
---

# Plan

When this skill is activated, start your response with `🪨 Using skill: plan`.

Turn a spec or clear goal into a phased plan. The output is `plan.md` in the project root. That's it — this skill does not execute the plan.

Skip planning for one-line changes, typos, or obvious fixes — unless the user explicitly asks for a plan.

## Input

1. If `spec.md` exists, use it as the source of truth
2. If not, work from the user's stated goal
3. If the goal is too vague to plan, stop and suggest writing a spec first

## Steps

1. Read the spec and any relevant source files
2. Scan for existing conventions: `AGENTS.md`, `CLAUDE.md`, `README.md`, `CONTRIBUTING.md`, or similar. Note any relevant patterns (framework, style, testing, routing, naming) in the plan's Context section
3. Identify natural phase boundaries based on the work type:
   - **Features** → vertical slices (user-outcome based)
   - **Refactors** → logical units of change (one module at a time)
   - **Small changes** → one phase is fine
4. Write `plan.md` in the project root using the format below
5. **Tell the user the plan is ready for review.** Done.

## Plan format

The generated `plan.md` should follow this structure:

- `# Plan: <title>`
- `## Objective` — one sentence, what this plan delivers
- `## Context` — what's being built or changed, what spec this plans (if any), relevant conventions found in the codebase
- `## Out of scope` — what this plan explicitly does not do
- `## Phases` — one section per phase, structure below
- `## Assumptions and risks` — short list, only what affects phasing
- `## Testing` — plain-English one-liners the user can use to verify the work once it's been built

Each phase section contains:

- `### Phase N: <name>`
- `**Goal:**` what this phase delivers
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

- **Be concrete.** "Update the header" is not a step. "Edit `Header.tsx` to accept `isMobile` prop and render `MobileNav` conditionally" is.
- **No inline code.** Steps describe intent, not implementation.
- **Phase sizing.** Each phase should involve files the agent can hold in context. If a phase touches 20+ files, split it.
- **Phase count.** Aim for 3–7 phases. Over 10 is almost always over-phasing.
- **One phase can be enough.** Don't pad with artificial phases. Small work deserves small plans.
- **Do not execute the plan.** This skill produces `plan.md` and nothing else.
- **Offer to explain.** After telling the user the plan is ready, ask: "Do you want me to explain?" If the user says yes, invoke the `explain` skill to read the plan aloud.

## Errors

If the plan can't be produced sensibly (goal too vague, required context missing), stop and ask the user. Don't guess.
