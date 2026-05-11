---
name: jira
description: Synthesise conversation context into a structured, copy-paste-ready Jira ticket.
---

# Jira Ticket

When this skill is activated, start your response with `🪨 Using skill: jira`.

## When to Use

Use after decisions have been resolved (typically via Shape) and the user wants a formal ticket.

## Process

1. **Check scope** — review conversation context. If it covers multiple unrelated pieces of functionality, ask the user to clarify which one to ticket before proceeding.
2. **Synthesise** — do not re-interview. Extract what was already resolved and generate the ticket.
3. **Output** — present three independently copyable blocks (Title, Description, Acceptance Criteria). Scale depth to the size of the work.

## Output Format

### Block 1: Title

```
[Verb] [what's changing] [where]
```

- 2–8 words, under 80 characters, action-oriented.
- No dashes, en-dashes, or em-dashes. Use plain connective words (on, for, in, to, at).
- No jargon unless established team terminology.

### Block 2: Description

```
**Current State:**
[One sentence on the problem or gap]

**Future State:**
[One sentence on what should exist]

**Proposed Solution:**
[Brief approach]
```

Include additional sections (Dependencies, Design, etc.) only if they came up in conversation. Never pad with empty or speculative sections.

### Block 3: Acceptance Criteria

3–7 ACs. If more than 7 are needed, suggest splitting the ticket.

```
**AC1: [Brief Title]**
- **Given** [context]
- **When** [action]
- **Then** [result]

**More simply put:** [One plain English sentence]
```

## Rules

- UK English spelling.
- No em-dashes or en-dashes anywhere.
- Bold keywords (**Given**, **When**, **Then**, **Current State**, etc.).
- Wrap UI element text in backticks.
- Omit empty sections entirely. Mark genuine unknowns as TBC.
- One ticket per invocation. One piece of functionality per ticket.
- Do not re-ask questions already answered in conversation.

## Self-Check (silent)

Before outputting, verify:
- Title is concise, action-oriented, under 80 chars, no dashes.
- Description answers what, why, and how without padding.
- ACs are specific and testable.
- Ticket is proportional to the work.
- No empty or speculative sections.

## Errors

- **Scope too broad:** Ask user which piece of functionality to focus on.
- **Insufficient context:** State what's missing and ask only for that specific gap.
