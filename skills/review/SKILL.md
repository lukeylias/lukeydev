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
2. **Understand the context.** If reviewing a single file, scan imports and related files to understand how it fits. If reviewing a diff, read the surrounding code for context.
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

```
## Review: <target>

### Issues
- 🔴 **Critical:** [description] — [why it matters]
- 🟡 **Warning:** [description] — [why it matters]
- 🔵 **Nit:** [description] — [suggestion]

### Summary
[1-2 sentences: overall assessment and the single most important thing to fix]
```

- **Critical** — will break something or cause data loss
- **Warning** — likely to cause problems, smells, or is confusing
- **Nit** — style, naming, minor improvements

If there are no issues at a level, omit that level. If everything looks good, say so — but be skeptical first.

## Rules

- **Fresh eyes.** Don't carry assumptions from earlier conversation. Read what's actually there.
- **Issues, not praise.** Don't list things that are fine. Focus on what's wrong or risky.
- **Be specific.** "This could be better" is useless. Name the line, the variable, the condition.
- **Explain why.** Every issue needs a reason. "Missing null check on `user.email` — will throw if the user signed up via SSO without an email."
- **Don't rewrite.** Point out problems, don't fix them. The user decides what to act on.
- **Proportional depth.** A 10-line diff gets a quick scan. A 500-line file gets a thorough review.
- **Offer to explain.** After printing the review, ask: "Do you want me to explain?" If the user says yes, invoke the `explain` skill to read the review aloud.

## Errors

- If the target doesn't exist, stop and tell the user.
- If the diff is empty, tell the user there's nothing to review.
- If the target is too large to review meaningfully (1000+ lines), focus on the riskiest sections and flag that you didn't cover everything.
