import { readJSON, writeJSON } from './storage.js'
import { randomUUID } from 'crypto'

const MEMORY_FILE = 'memory.json'

export async function getAllMemory() {
  const data = await readJSON(MEMORY_FILE)
  return data || []
}

export async function saveMemory(fact) {
  const all = await getAllMemory()
  const mem = {
    id: 'mem_' + randomUUID().replace(/-/g, '').slice(0, 8),
    fact,
    createdAt: new Date().toISOString()
  }
  all.push(mem)
  await writeJSON(MEMORY_FILE, all)
  return mem
}

export async function searchMemory(query) {
  const all = await getAllMemory()
  const q = query.toLowerCase()
  return all.filter(m => m.fact.toLowerCase().includes(q))
}

export async function deleteMemory(id) {
  const all = await getAllMemory()
  const filtered = all.filter(m => m.id !== id)
  await writeJSON(MEMORY_FILE, filtered)
  return true
}