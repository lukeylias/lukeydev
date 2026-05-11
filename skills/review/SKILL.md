---
name: review
description: Review a file, diff, or document with fresh eyes and surface issues.
---

# Review

When this skill is activated, start your response with `🪨 Using skill: review`.

Review whatever the user points you at with fresh eyes. Surface issues, not praise.

## Targets

- `review <file-path>` → review that file
- `review diff` → review `git diff` (or `git diff --staged` if nothing unstaged)
- `review plan` → review `plan.md`
- `review prd` → review `prd.md`
- `review spec` → review `spec.md`
- No target → ask the user what to review

## Process

1. **Resolve the target** and read it. If the file doesn't exist, stop and tell the user.
2. **Understand the context.** If reviewing code (a single file or diff), scan imports and related files to understand how it fits. If reviewing a document (PRD, plan, spec), the document itself is the context — don't explore the codebase.
3. **Review with fresh eyes.** Assume you know nothing about this project beyond what you can read right now. Look for:
   - Bugs and logic errors
   - Edge cases not handled
   - Unclear or misleading naming
   - Missing error handling
   - Inconsistencies with the rest of the codebase
   - Assumptions that aren't validated
   - Security concerns
   - Performance issues that are obvious (not speculative)
   - For PRDs/plans: gaps, ambiguity, contradictions, missing scope
4. **Output the review.** Use the format below.

## Output Format

Present findings as a single markdown table ordered by severity (Critical first, then Important, then Nit). Within a severity, order by file then line number.

| Severity | File:Line | Finding | Why it matters |
|----------|-----------|---------|----------------|
| Critical | prd.md:24 | "Quickly" is ambiguous | Could mean 1 sec or 1 min, can't test |
| Important | prd.md:31 | Empty state not specified | Edge case will surface during build |
| Nit | prd.md:36 | Line count is implementation detail | Unnecessary constraint |

- **Severity** uses only three values: `Critical`, `Important`, `Nit`
- **File:Line** uses the format `filename:line` (e.g. `prd.md:24`). For findings about the whole document with no specific line, use `—` (em-dash)
- **Finding** is a one-sentence description. If a finding needs more detail, keep the table row brief and add an expanded explanation in a `## Detail` section below the table, referenced by line number
- **Why it matters** is one short sentence on impact

After the table, write 1–2 sentences: overall assessment and the single most important thing to fix.

If there are no issues, say so — but be skeptical first.

- **Critical** — will break something or cause data loss
- **Important** — likely to cause problems, smells, or is confusing
- **Nit** — minor; low priority

## Rules

- **Fresh eyes.** Don't carry assumptions from earlier conversation. Read what's actually there.
- **Issues, not praise.** Don't list things that are fine. Focus on what's wrong or risky.
- **Be specific.** "This could be better" is useless. Name the line, the variable, the condition.
- **Explain why.** Every issue needs a reason. "Missing null check on `user.email` — will throw if the user signed up via SSO without an email."
- **Don't rewrite.** Point out problems, don't fix them. The user decides what to act on.
- **Proportional depth.** A 10-line diff gets a quick scan. A 500-line file gets a thorough review.
- **Human checkpoint.** After presenting findings, always stop and ask the user which issues to address. Never act on findings automatically.

## Errors

- If the target doesn't exist, stop and tell the user.
- If the diff is empty, tell the user there's nothing to review.
- If the target is too large to review meaningfully (1000+ lines), focus on the riskiest sections and flag that you didn't cover everything.
