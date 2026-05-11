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

For each file reviewed, output a file path header followed by a table. One table per file. Order rows by severity (Critical first, then Warning, then Nit).

Review: <target>

path/to/file

#    Severity    Lines    Description
1    Critical    42–58    No signal defined for identifying the recommendation — ambiguous phrasing will fail silently
2    Warning    12–15    Relationship between components never explained
3    Nit    34    Term undefined — behaviour when mid-typing not specified

1-2 sentence summary: overall assessment and the single most important thing to fix.

- **Critical** — will break something or cause data loss
- **Warning** — likely to cause problems, smells, or is confusing
- **Nit** — style, naming, minor improvements

If there are no issues, say so — but be skeptical first.

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
