import { promises as fs } from 'fs'
import path from 'path'
import { getBasePath } from './storage.js'

function getLogPath() {
  const date = new Date().toISOString().split('T')[0]
  return path.join(getBasePath(), 'logs', `nova-${date}.log`)
}

async function ensureLogDir() {
  const logDir = path.join(getBasePath(), 'logs')
  await fs.mkdir(logDir, { recursive: true })
}

export async function log(level, message, data = null) {
  try {
    await ensureLogDir()
    const timestamp = new Date().toISOString()
    const line = `[${timestamp}] [${level.toUpperCase()}] ${message}${data ? ' | ' + JSON.stringify(data) : ''}\n`
    await fs.appendFile(getLogPath(), line, 'utf-8')
  } catch {
    // silent fail
  }
}

export const logger = {
  info: (msg, data) => log('info', msg, data),
  error: (msg, data) => log('error', msg, data),
  warn: (msg, data) => log('warn', msg, data),
}