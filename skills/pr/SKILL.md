---
name: pr
description: Open a pull request for the current branch.
---

# PR

When this skill is activated, start your response with `🪨 Using skill: pr`.

Open a pull request for the current branch. Commits any outstanding work, pushes the branch, and opens the PR via `gh`.

Use when a chunk of work is ready for review.

## Steps

1. **Check git status.** Run `git status` and check for unpushed commits to determine:
   - Are there uncommitted changes?
   - Are there local commits not yet pushed?
   - Is the branch tracking a remote?

2. **Commit any uncommitted changes.** If uncommitted changes exist, invoke the `commit` skill to commit them. Don't bundle them into the PR without going through the commit flow.

3. **Push the branch.** Ask the user: "Branch needs pushing to origin. Go ahead?" and wait for approval. Then push to the remote. Use `git push -u origin <branch>` if the branch has no upstream, otherwise `git push`.

4. **Generate the PR title.** Convert the current branch name to a readable title:
   - `PHISL-2929-mobile-nav` → `PHISL-2929 Mobile nav`
   - `feature/think-agent` → `feature: Think agent`
   - `fix/login-redirect` → `fix: Login redirect`
   
   Rule: replace separators with spaces or colons, capitalise the first word of the description, leave ticket IDs and type prefixes intact.

5. **Ask about Jira ticket.** Ask the user: "Is there a Jira ticket for this PR? If yes, paste the URL."
   - If the user provides a URL: extract the ticket ID from the URL path (everything after `/browse/`) and include it at the top of the description as a markdown link. Format: `[TICKET-ID](full-url)`
   - If the user says no or skips: omit the link entirely
   
   Example: URL `https://nibgroup.atlassian.net/browse/PHISL-2929` becomes `[PHISL-2929](https://nibgroup.atlassian.net/browse/PHISL-2929)` at the top of the description.

6. **Gather verification notes.** Review conversation context for evidence of testing (e.g. discussing results, confirming behaviour, pasting ACs and working through them). If testing is evident, synthesise plain bullet points describing what was verified. If no testing context exists, prompt the user: "Any verification you want to call out?" The user can skip if there's nothing to add. Bullets should be short, scannable, and conversational. Use backticks for code/UI elements. Edge cases tested outside ACs belong here too with a brief note (e.g. "Also verified empty state renders correctly (not covered by ACs)").

7. **Generate the PR description.** Use this format:

```markdown
   [PHISL-2929](https://nibgroup.atlassian.net/browse/PHISL-2929)
   
   ## Summary
   - Bullet point describing change, with `code` or `functions` in backticks
   - Another bullet
   - Another bullet
   
   ## Verification
   - Verified X behaves correctly when Y
   - Verified `component` renders in empty state
   - Also verified Z (not covered by ACs)
   
   ## Notes for reviewer
   - Anything worth flagging
```
   
   Rules:
   - Summary is always present, plain language, bullet list
   - Wrap code, function names, file paths, and component names in backticks
   - Verification is **optional**: omit entirely if there's nothing to verify. Each bullet describes a specific thing tested. Align with ACs where possible.
   - Notes for reviewer is **optional**: include only if there's something genuinely worth flagging (architectural decision, tricky logic, follow-up work, known limitation). If nothing notable, omit the entire section.
   - Summary bullets should use past tense ("Added X", "Updated Y", "Changed Z"), not present tense — the PR describes completed work
   - Jira link at the top, no preamble. Skip if no ticket.

8. **Confirm with the user.** Show the title and description. Wait for approval, edits, or cancellation.

9. **Open the PR.** Use `gh pr create --title "<title>" --body "<body>"`. Default base branch is `main`. If the repo uses a different default (e.g. `develop`, `master`), ask the user once and remember the answer for that repo.

10. **Confirm to the user.** Print the PR URL: `✓ Opened PR: <url>`

## Rules

- **Don't merge.** PR creates the PR, not merges it. Merging is the user's call after review.
- **Don't auto-detect base branch.** Assume `main`. Ask if unclear.
- **Don't create the branch.** That's the `branch` skill's job. If the user is on `main` when invoking `pr`, stop and tell them to create a branch first.
- **Don't bundle uncommitted changes silently.** Always go through the `commit` skill for outstanding changes.

## Errors

- If `gh` CLI is not installed or not authenticated, surface the error and stop.
- If the branch is `main` (or the configured base), stop and tell the user to create a feature branch first.
- If the push fails (rejected, conflict, network), surface the error and stop. Don't try to force-push.
- If `gh pr create` fails (PR already exists, permissions), surface the error and stop.
- If `gh pr create` warns about uncommitted changes due to untracked files, acknowledge the warning to the user but explain it's harmless noise from untracked files, not a problem.
