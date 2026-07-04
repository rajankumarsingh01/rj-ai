import { app } from 'electron'
import { promises as fs } from 'fs'
import path from 'path'

const BASE_PATH = app.getPath('userData')

export async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true })
}

export async function readJSON(filePath) {
  try {
    const full = path.join(BASE_PATH, filePath)
    await ensureDir(path.dirname(full))
    const data = await fs.readFile(full, 'utf-8')
    return JSON.parse(data)
  } catch {
    return null
  }
}

export async function writeJSON(filePath, data) {
  try {
    const full = path.join(BASE_PATH, filePath)
    await ensureDir(path.dirname(full))
    await fs.writeFile(full, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch {
    return false
  }
}

export async function deleteFile(filePath) {
  try {
    const full = path.join(BASE_PATH, filePath)
    await fs.unlink(full)
    return true
  } catch {
    return false
  }
}

export function getBasePath() {
  return BASE_PATH
}