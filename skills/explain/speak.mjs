#!/usr/bin/env node

import { writeFileSync, unlinkSync } from 'fs';
import { execSync } from 'child_process';
import { tmpdir } from 'os';
import { join } from 'path';

const VOICE_ID = 'JBFqnCBsd6RMkjVDRZzb'; // George (free-tier compatible)
const MODEL_ID = 'eleven_turbo_v2_5';
const API_KEY = process.env.ELEVENLABS_API_KEY;

if (!API_KEY) {
  console.error('ELEVENLABS_API_KEY not set. Add it to your shell config.');
  process.exit(1);
}

// Read text from stdin
let text = '';
process.stdin.setEncoding('utf8');

for await (const chunk of process.stdin) {
  text += chunk;
}

text = text.trim();

if (!text) {
  console.error('No text provided.');
  process.exit(1);
}

console.log(`Speaking ${text.length} characters...`);

try {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`ElevenLabs API error (${response.status}): ${errorText}`);
    process.exit(1);
  }

  const audioBuffer = Buffer.from(await response.arrayBuffer());
  const tmpFile = join(tmpdir(), `pi-explain-${Date.now()}.mp3`);

  writeFileSync(tmpFile, audioBuffer);

  try {
    execSync(`afplay "${tmpFile}"`, { stdio: 'inherit' });
  } finally {
    unlinkSync(tmpFile);
  }
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}
