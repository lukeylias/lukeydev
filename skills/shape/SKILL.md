---
name: shape
description: Interview the user relentlessly about a plan or design until reaching shared understanding.
---

# Shape

When this skill is activated, start your response with `🪨 Using skill: shape`.

Interview the user relentlessly about every aspect of a plan or design until reaching shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one by one.

## Process

1. Read the plan, spec, or design the user points you at (or ask what to shape)
2. **Invoke the `scout` subagent now.** This is mandatory — do not skip it. Call the scout agent with a task like: `"Scan this repo: summarise the stack, directory structure, key config files, and any existing docs relevant to: <topic>"`. Wait for the result before proceeding. Use the scout's findings to pre-answer as many upcoming questions as possible before asking the user anything.
3. Identify every decision point, ambiguity, unstated assumption, and dependency
4. Ask questions **one at a time**, in dependency order — don't ask about B if the answer depends on A
5. For each question, **provide your recommended answer** with brief reasoning
6. If a question can be answered by exploring the codebase, **invoke the `scout` subagent again instead of asking** — then state what you found
7. After each answer, update your mental model and determine the next most important question
8. Continue until all branches are resolved and you've reached shared understanding
9. When all branches are resolved, state that the shape is complete and present a summary of every resolved decision. Then immediately invoke the `prd` skill — do not wait for the user to ask.

## What to probe

- Goals and non-goals
- User-facing behaviour
- Edge cases and error states
- Data model and state management
- API boundaries and contracts
- Naming and conventions
- Dependencies between decisions
- Things that sound simple but aren't
- Things that were left unsaid

## Rules

- **One question at a time.** Never batch questions.
- **Always recommend.** Every question comes with your suggested answer. The user can accept, reject, or modify.
- **Scout first, always.** Step 2 is non-negotiable — the scout subagent must be invoked before any questions are asked. Never skip or substitute this with manual file reads.
- **Explore before asking.** After the scout runs, if a follow-up question can be answered by exploring the codebase, invoke the `scout` subagent again with a targeted task — do not explore files yourself. Say what you found.
- **Follow dependencies.** Don't ask downstream questions until upstream decisions are locked in.
- **Be relentless.** Don't stop because it feels like enough. Stop when every branch is resolved.
- **Stay concrete.** "How should errors work?" is weak. "When the API returns 429, should we retry with backoff or surface the error to the user immediately?" is strong.
- **No implementation.** This skill produces shared understanding, not code.
