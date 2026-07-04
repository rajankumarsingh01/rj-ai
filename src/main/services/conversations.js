import { readJSON, writeJSON, deleteFile } from './storage.js'
import { logger } from './logger.js'
import { randomUUID } from 'crypto'

const INDEX_FILE = 'conversations.json'

export async function getAllConversations() {
  const data = await readJSON(INDEX_FILE)
  return data || []
}

export async function createConversation(title = 'Nai Baat') {
  const id = 'chat_' + randomUUID().replace(/-/g, '').slice(0, 12)
  const now = new Date().toISOString()
  const conv = { id, title, createdAt: now, updatedAt: now }

  const all = await getAllConversations()
  all.unshift(conv)
  await writeJSON(INDEX_FILE, all)
  await writeJSON(`conversations/${id}.json`, [])

  logger.info('Conversation created', { id })
  return conv
}

export async function getConversationMessages(id) {
  const messages = await readJSON(`conversations/${id}.json`)
  return messages || []
}

export async function addMessage(id, role, content) {
  const messages = await getConversationMessages(id)
  const msg = { role, content, timestamp: new Date().toISOString() }
  messages.push(msg)
  await writeJSON(`conversations/${id}.json`, messages)

  // update updatedAt in index
  const all = await getAllConversations()
  const idx = all.findIndex(c => c.id === id)
  if (idx !== -1) {
    all[idx].updatedAt = msg.timestamp
    await writeJSON(INDEX_FILE, all)
  }

  return msg
}

export async function updateConversationTitle(id, title) {
  const all = await getAllConversations()
  const idx = all.findIndex(c => c.id === id)
  if (idx !== -1) {
    all[idx].title = title
    await writeJSON(INDEX_FILE, all)
  }
}

export async function deleteConversation(id) {
  const all = await getAllConversations()
  const filtered = all.filter(c => c.id !== id)
  await writeJSON(INDEX_FILE, filtered)
  await deleteFile(`conversations/${id}.json`)
  logger.info('Conversation deleted', { id })
  return true
}