# Skills

A collection of reusable agent skills for [pi](https://github.com/mariozechner/pi-coding-agent). Each skill is a self-contained set of instructions that teaches an AI coding agent how to perform a specific task.

## Skills

| Skill | Description | Output |
|-------|-------------|--------|
| [`branch`](branch/SKILL.md) | Create a new git branch from an up-to-date base branch. | New git branch |
| [`commit`](commit/SKILL.md) | Make clean, safe, well-formatted git commits. | Git commit |
| [`explain`](explain/SKILL.md) | Summarise and explain content aloud via ElevenLabs TTS. | Spoken audio + terminal summary |
| [`grill`](grill/SKILL.md) | Interview the user relentlessly about a plan or design until reaching shared understanding. | Shared understanding (conversation) |
| [`overview`](overview/SKILL.md) | High-level overview of the current repository. | Terminal summary |
| [`plan`](plan/SKILL.md) | Break a goal into executable phases. | `plan.md` |
| [`pr`](pr/SKILL.md) | Open a pull request for the current branch. | GitHub PR |
| [`prd`](prd/SKILL.md) | Turn conversation context into a PRD. | `prd.md` |
| [`review`](review/SKILL.md) | Review a file, diff, or document with fresh eyes and surface issues. | Terminal review with severity levels |
| [`write-skill`](write-skill/SKILL.md) | Create a new agent skill. | New skill directory |

## Skill Composition

Some skills are designed to work together:

- **pr** → invokes **commit** for any uncommitted changes before opening a PR
- **review**, **plan**, **prd** → offer to invoke **explain** to read results aloud
- **grill** → pairs well before **prd** to resolve ambiguity first

## Structure

Each skill lives in its own directory with a `SKILL.md` file:

```
skills/
├── branch/SKILL.md
├── commit/SKILL.md
├── explain/SKILL.md
│   └── speak.mjs
├── grill/SKILL.md
├── overview/SKILL.md
├── plan/SKILL.md
├── pr/SKILL.md
├── prd/SKILL.md
├── review/SKILL.md
└── write-skill/SKILL.md
```
