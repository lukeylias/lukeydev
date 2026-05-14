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
9. When all branches are resolved, state that the shape is complete and present a full summary of every resolved decision. Then tell the user: "Say **build** when ready to run the automation loop."

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

## Question format

Every question must be presented in this exact format — output it as plain text, no markdown syntax, no code blocks, no heading symbols:

🪨 Shape question N · Topic

Question
- <Ask one concrete decision question.>

Recommendation
- <State the recommended answer.>

Why
- <Briefly explain the reasoning.>

Options
1. <Recommended option> ← Recommended
2. <Alternative option>
3. <Alternative option>

Reply with a number, or type your own answer.

- `N` is the sequential question number (1, 2, 3, …)
- `Topic` is a short 2–4 word label for the decision area
- Always list the recommended option first, marked with ← Recommended
- Include 2–4 options total (add more only when clearly warranted)
- End every question block with the "Reply with a number…" prompt — no exceptions

## Rules

- **One question at a time.** Never batch questions.
- **Always recommend.** Every question comes with your suggested answer. The user can accept, reject, or modify.
- **Scout first, always.** Step 2 is non-negotiable — the scout subagent must be invoked before any questions are asked. Never skip or substitute this with manual file reads.
- **Explore before asking.** After the scout runs, if a follow-up question can be answered by exploring the codebase, invoke the `scout` subagent again with a targeted task — do not explore files yourself. Say what you found.
- **Follow dependencies.** Don't ask downstream questions until upstream decisions are locked in.
- **Be relentless.** Don't stop because it feels like enough. Stop when every branch is resolved.
- **Stay concrete.** "How should errors work?" is weak. "When the API returns 429, should we retry with backoff or surface the error to the user immediately?" is strong.
- **No implementation.** This skill produces shared understanding, not code.
