---
name: grill
description: Interview the user relentlessly about a plan or design until reaching shared understanding.
---

# Grill

When this skill is activated, start your response with `🪨 Using skill: grill`.

Interview the user relentlessly about every aspect of a plan or design until reaching shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one by one.

## Process

1. Read the plan, spec, or design the user points you at (or ask what to grill on)
2. Identify every decision point, ambiguity, unstated assumption, and dependency
3. Ask questions **one at a time**, in dependency order — don't ask about B if the answer depends on A
4. For each question, **provide your recommended answer** with brief reasoning
5. If a question can be answered by exploring the codebase, **explore the codebase instead of asking** — then state what you found
6. After each answer, update your mental model and determine the next most important question
7. Continue until all branches are resolved and you've reached shared understanding
8. Summarise the resolved decisions at the end

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
- **Explore before asking.** If the codebase can answer it, go look. Say what you found.
- **Follow dependencies.** Don't ask downstream questions until upstream decisions are locked in.
- **Be relentless.** Don't stop because it feels like enough. Stop when every branch is resolved.
- **Stay concrete.** "How should errors work?" is weak. "When the API returns 429, should we retry with backoff or surface the error to the user immediately?" is strong.
- **No implementation.** This skill produces shared understanding, not code.
