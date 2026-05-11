---
name: commit
description: Make clean, safe, well-formatted git commits.
---

# Commit

Make clean, safe, well-formatted commits.

When this skill is activated, start your response with `🪨 Using skill: commit`.

## Steps

1. Run `git status` and `git diff --staged` to understand the current state
2. Scan for secrets: API key patterns, `.env` files, `*.pem`, `*.key`, suspicious hex/base64 strings — stop and flag if anything looks sensitive
3. If changes are already staged, commit those. If nothing is staged, show the user the unstaged changes and ask what to include. **Don't stage untracked files** unless the user confirms they should be included in this commit — the default assumption is that untracked files are excluded
4. If `.gitignore` is missing or doesn't cover common patterns (`.env`, `node_modules`, build output), flag gaps to the user. **This is a blocker** — resolve any `.gitignore` gaps with the user before proceeding to stage and commit. Don't move past this step until it's handled
5. Group changes into logical units — one coherent change per commit, stage selectively if needed. If a commit message would need "and" to describe two different kinds of change, that's a signal to split
6. Run lint or tests if the repo has known commands. Ask: **"Proceed with commit, or fix first?"** before moving on
7. Confirm the commit message with the user before committing — skip for single-file trivial changes (typo fixes, version bumps)

## Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject
```

- **Imperative mood**, lowercase, no full stop, under ~50 chars
- Types: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `test`
- Add a body only when the *why* isn't obvious from the diff
- Scope is optional but encouraged when changes are localised

## Post-Commit

Print the commit hash and message: `✓ a3f21c8 feat(nav): add mobile menu`. Don't push — pushing is a separate decision.

## Errors

If the commit fails (pre-commit hook rejection, merge conflict, nothing to commit), surface the error to the user and stop. Don't try to force it.
