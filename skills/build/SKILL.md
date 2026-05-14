---
name: build
description: Run the full PRD → plan → code → review automation loop after a Shape session without human intervention.
---

# Build

When this skill is activated, start your response with `🪨 Using skill: build`.

## Trigger

Activate this skill when the user says "build", "go", "run it", "start", or any message that unambiguously expresses intent to begin the automation loop.

## No-stop rule

Once the pre-flight check passes, never pause for user input between loop start and the final narrative. Run every step to completion without asking for confirmation, approval, or review at any intermediate point.

## Pre-flight check

Before starting the loop, run `git rev-parse --show-toplevel` in the project directory to resolve the git root (`<git-root>`). If the command fails, stop immediately, tell the user the path could not be resolved, and ask where to save output files. Do not proceed until a valid path is provided. This is the only permitted stop before the narrative.

## Loop steps

### Step 1 — Generate PRD

Generate `prd.md` inline from the current Shape conversation context, following the same output structure as the `prd` skill (Problem Statement, Solution, User Stories, Modules, Implementation Decisions, Acceptance Criteria, Out of Scope). Save to `<git-root>/prd.md`, overwriting any existing file unconditionally. Do not pause for review or confirmation.

### Step 2 — Review PRD

Invoke the `review` subagent in spawn mode on `<git-root>/prd.md`. Pass this task string: "Review `<git-root>/prd.md` for ambiguities, gaps, contradictions, and missing acceptance criteria. Label every finding with a severity of Critical, Important, Minor, or Suggestion."

### Step 3 — Fix PRD findings

If the review returns any Critical or Important findings, apply those fixes directly as the main agent — edit `<git-root>/prd.md` to resolve each finding. Do not invoke Coder for this step. If no Critical or Important findings are returned, skip this step and continue immediately.

If any finding cannot be resolved without user input, append it to `<git-root>/build-log.md` under a `## PRD Fix Blockers` section header.

**Override:** The sequence continues regardless of whether all findings are resolved. Do not pause or re-review after this step.

### Step 4 — Generate Plan

Generate `plan.md` inline following the same output format as the `plan` skill, using the updated `<git-root>/prd.md` as the sole source of truth. Save to `<git-root>/plan.md`. Do not pause for review or approval.

### Step 5 — Review Plan

Invoke the `review` subagent in spawn mode on `<git-root>/plan.md`. Pass this task string: "Review `<git-root>/plan.md` for: (1) phase ordering — no phase should depend on a later phase; (2) hidden coupling between phases; (3) untestable phases; (4) scope creep against `<git-root>/prd.md`; (5) phases missing clear done-when criteria. Label every finding with a severity of Critical, Important, Minor, or Suggestion."

### Step 6 — Fix Plan findings

If the review returns any Critical or Important findings, apply those fixes directly as the main agent — edit `<git-root>/plan.md` to resolve each finding. Do not invoke Coder for this step. If no Critical or Important findings are returned, skip this step and continue immediately.

If any finding cannot be resolved without user input, append it to `<git-root>/build-log.md` under a `## Plan Fix Blockers` section header.

**Override:** The sequence continues regardless of whether all findings are resolved. Do not pause or re-review after this step.

### Step 7 — Execute Plan

Invoke the `coder` subagent with task: `"Execute the plan at <git-root>/plan.md against the repository at <git-root>. Write build-log.md to <git-root>/build-log.md."` Pass mode as spawn.

### Step 8 — Discover check files

Invoke the `scout` subagent in spawn mode with task: `"List all .md files in ~/.pi/agent/checks/ and return their absolute paths."` Collect the list of absolute paths returned.

If Scout returns an empty list, skip Steps 9–11 entirely. In Step 12's Code review sub-section, write "Code review skipped — no check files found in `~/.pi/agent/checks/`." instead of a findings table.

If Scout errors or returns an unreadable response, also skip Steps 9–11 entirely. In Step 12's Code review sub-section, write "Check discovery failed — code review skipped" instead of a findings table.

### Step 9 — Parallel code review

Fan out one `code-review` subagent per check file discovered in Step 8, running all in parallel using the parallel tasks array. For each check file, pass: repo path `<git-root>` and the check file's absolute path. The code-review subagents collect the diff themselves via `git diff HEAD` in the project repo — do not pass diff content. Instruct each code-review subagent to exclude the following paths from its diff scope: `prd.md`, `plan.md`, `build-log.md`, and `skills/build/SKILL.md` (all relative to `<git-root>`). These are documentation artefacts covered by earlier review steps and must not appear in code review findings.

If a code-review subagent fails or returns no parseable output, note the failing check in Step 12's Code review sub-section as "Check [name] failed — results unavailable" rather than omitting it.

### Step 10 — Merge and deduplicate findings

Collect all code-review responses. Merge all findings into a single table with columns: Severity | File Location | Problem | Source Checks. Deduplicate rows where the same file location and problem appear across multiple checks: keep the most severe instance and combine the source check names into a single "Source Checks" entry (e.g. "Security, Error Handling").

### Step 11 — Fix code-review findings

If the merged table contains any Critical or Important findings, invoke the `coder` subagent in findings mode, passing only the Critical and Important rows (exclude Nits — Nits are surfaced in the narrative for the user's consideration) and `<git-root>`. If no Critical or Important findings are present, skip this step and continue immediately.

**Override:** The sequence continues regardless of whether the Coder resolves all findings. Do not pause or re-review after this step.

### Step 12 — Guided review narrative

Assemble and output the guided review narrative inline in chat (do not write it to a file). The narrative must contain exactly four named sections, in this order:

**What was built** — a short prose summary of what the Coder implemented, derived from `<git-root>/plan.md` and `<git-root>/build-log.md`.

**Review findings** — one sub-section per review stage: PRD review, Plan review, Code review. Each sub-section contains a two-column table (Severity | Finding) listing every item returned by that stage's review subagent. If a stage produced no findings, write "No findings." If the code review was skipped due to no check files, write "Code review skipped — no check files found in `~/.pi/agent/checks/`."

**What was fixed** — a bulleted list per stage of findings that were successfully resolved. Derive this as follows for each stage:
- PRD fix stage: the main agent applied fixes directly. List all Critical or Important PRD review findings that do not appear as blockers in the `## PRD Fix Blockers` section of `<git-root>/build-log.md` as resolved. If there were no Critical or Important PRD findings, write "No Critical/Important findings — no fixes needed." If `build-log.md` is absent, write "build-log.md not found — fix status unknown; treat all Critical/Important PRD findings as unresolved."
- Plan fix stage: the main agent applied fixes directly. List all Critical or Important Plan review findings that do not appear as blockers in the `## Plan Fix Blockers` section of `<git-root>/build-log.md` as resolved. If there were no Critical or Important Plan findings, write "No Critical/Important findings — no fixes needed." If `build-log.md` is absent, write "build-log.md not found — fix status unknown; treat all Critical/Important Plan findings as unresolved."
- Code fix stage: take the Critical and Important findings passed to Coder and subtract any items that appear as blockers elsewhere in `<git-root>/build-log.md` (outside the PRD/Plan Fix Blockers sections); the remainder are treated as fixed.
- If `build-log.md` is absent, write "build-log.md not found — fix status unknown; treat all passed findings as unresolved" for the Code fix stage rather than assuming anything was fixed.
- If Coder was not invoked for code fixes, write "Coder not invoked (no Critical/Important findings)."

**Unresolved items** — all blocker entries from `<git-root>/build-log.md`, including items in `## PRD Fix Blockers` and `## Plan Fix Blockers` sections. For each blocker, include a "needs your judgement" call-to-action.
- If `build-log.md` exists and contains no blockers, write "Coder completed cleanly — no unresolved items."
- If `build-log.md` is absent, write "build-log.md not found — Coder execution status unknown; treat all passed findings as unresolved."

End the narrative with this actionable signal on its own line:
- `Actionable: yes — N items need your attention` — where N is the count of unresolved Critical/Important findings across all stages
- `Actionable: no — all clean` — if there are zero unresolved Critical/Important findings
