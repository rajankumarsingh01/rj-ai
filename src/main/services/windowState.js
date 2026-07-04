import { readJSON, writeJSON } from './storage.js'

const STATE_FILE = 'window-state.json'

const DEFAULT_STATE = {
  width: 1440,
  height: 900,
  x: null,
  y: null,
  isMaximized: false
}

export async function getWindowState() {
  const saved = await readJSON(STATE_FILE)
  const state = { ...DEFAULT_STATE, ...(saved || {}) }

  // Safety: agar saved size bahut chhota ho gaya ho kisi wajah se
  if (state.width < 1024) state.width = DEFAULT_STATE.width
  if (state.height < 680) state.height = DEFAULT_STATE.height

  return state
}

export function attachWindowStateSaver(win) {
  let saveTimeout = null

  const save = async () => {
    if (win.isDestroyed()) return
    const isMaximized = win.isMaximized()
    const bounds = win.getBounds()
    await writeJSON(STATE_FILE, { ...bounds, isMaximized })
  }

  const debouncedSave = () => {
    clearTimeout(saveTimeout)
    saveTimeout = setTimeout(save, 400)
  }

  win.on('resize', debouncedSave)
  win.on('move', debouncedSave)
  win.on('close', save)
}