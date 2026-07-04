import { readJSON, writeJSON } from './storage.js'

const SETTINGS_FILE = 'settings.json'

const DEFAULT_KEYS = {
  openrouter: '',
  groq: '',
  elevenlabs: ''
}

export async function getApiKeys() {
  const stored = await readJSON(SETTINGS_FILE)
  return { ...DEFAULT_KEYS, ...(stored || {}) }
}

export async function saveApiKeys(keys) {
  const current = await getApiKeys()
  const updated = { ...current, ...keys }
  await writeJSON(SETTINGS_FILE, updated)
  return updated
}

// Resolves the key to actually use: stored value takes priority, falls back to env var
export async function resolveKey(name) {
  const keys = await getApiKeys()
  const envMap = {
    openrouter: process.env.OPENROUTER_API_KEY,
    groq: process.env.GROQ_API_KEY,
    elevenlabs: process.env.ELEVENLABS_API_KEY
  }
  return keys[name] || envMap[name] || ''
}