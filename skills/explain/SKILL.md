---
name: explain
description: Summarise and explain content aloud via ElevenLabs TTS.
---

# Explain

When this skill is activated, start your response with `🪨 Using skill: explain`.

Produce a short spoken explanation of a target. The agent reads the content, summarises it in plain language, prints the summary to the terminal, and reads it aloud via ElevenLabs.

Use for: quickly understanding a plan, spec, review, code file, diff, error, or any pasted text without reading it yourself.

## Usage

- `explain` → ask the user what to explain
- `explain plan` → read `plan.md` and explain aloud
- `explain review` → read `review.md` and explain
- `explain spec` → read `spec.md` and explain
- `explain <file-path>` → read and explain the given file
- `explain diff` → summarise recent `git diff`
- `explain "pasted text"` → explain the provided string

## Steps

1. **Resolve the target:**
   - `plan` / `review` / `spec` → look for the matching `.md` file in the project root
   - File path → read the file
   - `diff` → run `git diff` and use that output
   - Quoted string → use the string directly
   - No input → ask the user what to explain
   - File not found → stop and tell the user

2. **Read and comprehend the content.**

3. **Produce a spoken explanation** (the "explanation output"):
   - Conversational tone, like a knowledgeable colleague
   - Lead with the main point, not setup
   - 2-3 key points maximum — be ruthlessly concise
   - Structure as short paragraphs (2-3 lines each) or dot points where it fits naturally
   - Skip the obvious ("this is a plan file")
   - Flag risks, decisions, or trade-offs only if genuinely notable
   - Match the user's technical level: they know basic code, not deep engineering
   - Keep it under 300 characters total (aim for 150-250)
   - No markdown formatting (it'll be read aloud, so plain prose only)
   - Don't quote the source verbatim, summarise in your own words

4. **Print the explanation to the terminal** so the user can follow along while listening. This must be the exact same text that gets sent to TTS.

5. **Run the TTS script** with the same text:
   - Execute `node skills/explain/speak.mjs` with the explanation piped via stdin
   - **Do not set a timeout** on the bash call — the audio may take a while to generate and play
   - The script handles ElevenLabs API call and audio playback

6. **Handle interruption:** Ctrl+C stops playback cleanly.

## Rules

- **Summarise, don't recite.** Never read the source text verbatim. The whole point is compression.
- **If the content is huge, pick the most important stuff.** Don't try to cover everything.
- **No markdown in the spoken output.** No `#`, `*`, backticks, or code blocks. Plain spoken prose.
- **If there's genuine ambiguity or risk in the source, name it.** That's the most valuable thing you can add.
- **For code:** explain what it does at a high level, not line-by-line. "This handles user login by checking the password hash and creating a session token" beats "it imports bcrypt, then defines a function..."
- **For diffs:** focus on what changed and why it matters, not every file touched.

## Errors

- If `ELEVENLABS_API_KEY` env var is not set → tell the user to set it in their shell config
- If the API call fails (rate limit, invalid key, network) → surface the error
- If `afplay` isn't available (non-macOS) → tell the user the skill currently only supports macOS
- If the target file doesn't exist → stop and tell the user
