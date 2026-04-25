---
name: branch
description: Create a new git branch from an up-to-date base branch.
---

# Branch

Create a new git branch from an up-to-date base branch.

When this skill is activated, start your response with `🪨 Using skill: branch`.

## Steps

1. Run `git status`. If there are staged or modified tracked files, **stop and tell the user**. Untracked files are fine — note them but proceed
2. Determine the base branch: use `main` unless the repo has a different configured default (e.g. `master`, `develop`)
3. Switch to the base branch and pull latest: `git switch <base> && git pull`
4. Determine context:
   - **Work repo** (has `PHISL-` branches or remotes suggesting a work project): expect a ticket ID
   - **Personal project**: use a type prefix
5. Ask the user for the branch name, or derive it if the context makes it obvious (e.g. a ticket ID or spec/plan was just discussed). If it can't be derived, ask — don't guess
6. Validate and format the name:
   - **Work repo:** `PHISL-XXXX-kebab-case-description`
   - **Personal:** `<type>/kebab-case-description` where type is one of: `feature`, `fix`, `chore`, `refactor`, `spike`, `style` (`style` is for visual/cosmetic changes that don't affect functionality)
7. Create and switch to the branch: `git switch -c <name>`
8. Confirm: `✓ Switched to new branch <name>`

## Errors

If the base branch has uncommitted changes or the pull fails, stop and tell the user. Don't try to stash, force-pull, or auto-resolve.
