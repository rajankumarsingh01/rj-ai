// import { app, BrowserWindow, ipcMain } from 'electron'
// import { join } from 'path'
// import { sendMessage } from './services/ai.js'
// import { transcribeAudio } from './services/speech.js'
// import {
//   getAllConversations,
//   createConversation,
//   getConversationMessages,
//   addMessage,
//   deleteConversation,
//   updateConversationTitle
// } from './services/conversations.js'
// import { getAllMemory, saveMemory, searchMemory, deleteMemory } from './services/memory.js'
// import { openApp, openPath, openURL } from './services/desktop.js'
// import { searchDuckDuckGo } from './services/search.js'
// import { logger } from './services/logger.js'

// import { processFile, searchRAG, getAllDocs, deleteDoc } from './services/rag.js'

// import { textToSpeech, VOICE_LIST } from './services/tts.js'

// import { getSystemStats } from './services/system.js'

// const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY || ''

// const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || ''
// const GROQ_KEY = process.env.GROQ_API_KEY || ''

// function createWindow() {
//   const win = new BrowserWindow({
//        width: 1440,
//     height: 900,
//     minWidth: 1024,
//     minHeight: 680,
//     frame: false,
//     backgroundColor: '#050508',
//     webPreferences: {
//       preload: join(__dirname, '../preload/index.js'),
//       contextIsolation: true,
//       nodeIntegration: false,
//       webSecurity: false // ← yeh add karo
//     }
//   })

//   if (process.env.NODE_ENV === 'development') {
//     win.loadURL(process.env.ELECTRON_RENDERER_URL)
//     win.webContents.openDevTools()
//   } else {
//     win.loadFile(join(__dirname, '../renderer/index.html'))
//   }

//   return win
// }

// app.whenReady().then(() => {
//   createWindow()
//   logger.info('Nova AI started')

//   app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow()
//   })
// })

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') app.quit()
// })

// // ─── AI ───────────────────────────────────────────────
// ipcMain.handle('ai:sendMessage', async (_, messages, model) => {
//   return await sendMessage(messages, model, OPENROUTER_KEY)
// })

// // ─── Conversations ────────────────────────────────────
// ipcMain.handle('conv:getAll', async () => {
//   return await getAllConversations()
// })

// ipcMain.handle('conv:create', async (_, title) => {
//   return await createConversation(title)
// })

// ipcMain.handle('conv:getMessages', async (_, id) => {
//   return await getConversationMessages(id)
// })

// ipcMain.handle('conv:addMessage', async (_, id, role, content) => {
//   return await addMessage(id, role, content)
// })

// ipcMain.handle('conv:delete', async (_, id) => {
//   return await deleteConversation(id)
// })

// ipcMain.handle('conv:updateTitle', async (_, id, title) => {
//   return await updateConversationTitle(id, title)
// })

// // ─── Memory ───────────────────────────────────────────
// ipcMain.handle('memory:getAll', async () => {
//   return await getAllMemory()
// })

// ipcMain.handle('memory:save', async (_, fact) => {
//   return await saveMemory(fact)
// })

// ipcMain.handle('memory:search', async (_, query) => {
//   return await searchMemory(query)
// })

// ipcMain.handle('memory:delete', async (_, id) => {
//   return await deleteMemory(id)
// })

// // ─── Speech ───────────────────────────────────────────
// ipcMain.handle('speech:transcribe', async (_, audioBuffer) => {
//   return await transcribeAudio(audioBuffer, GROQ_KEY)
// })

// // ─── Desktop ──────────────────────────────────────────
// ipcMain.handle('desktop:openApp', async (_, appName) => {
//   return await openApp(appName)
// })

// ipcMain.handle('desktop:openPath', async (_, filePath) => {
//   return await openPath(filePath)
// })

// ipcMain.handle('desktop:openURL', async (_, url) => {
//   return await openURL(url)
// })

// // ─── Search ───────────────────────────────────────────
// ipcMain.handle('search:query', async (_, query) => {
//   return await searchDuckDuckGo(query)
// })

// // ─── Window Controls ──────────────────────────────────
// ipcMain.on('window:minimize', () => {
//   BrowserWindow.getFocusedWindow()?.minimize()
// })

// ipcMain.on('window:maximize', () => {
//   const win = BrowserWindow.getFocusedWindow()
//   win?.isMaximized() ? win.unmaximize() : win.maximize()
// })

// ipcMain.on('window:close', () => {
//   BrowserWindow.getFocusedWindow()?.close()
// })

// ipcMain.handle('test:openChrome', async () => {
//   const { shell } = await import('electron')
//   const result = await shell.openPath('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
//   console.log('Shell result:', result)
//   return result
// })

// // ─── RAG ──────────────────────────────────────────

// ipcMain.handle('rag:processFile', async (_, filePath, fileName) => {
//   return await processFile(filePath, fileName)
// })

// ipcMain.handle('rag:search', async (_, query) => {
//   return await searchRAG(query)
// })

// ipcMain.handle('rag:getAllDocs', async () => {
//   return await getAllDocs()
// })

// ipcMain.handle('rag:deleteDoc', async (_, docId) => {
//   return await deleteDoc(docId)
// })

// ipcMain.handle('rag:getFilePath', async () => {
//   const { dialog } = await import('electron')
//   const result = await dialog.showOpenDialog({
//     properties: ['openFile'],
//     filters: [{ name: 'Documents', extensions: ['pdf', 'txt', 'docx'] }]
//   })
//   if (result.canceled) return null
//   return result.filePaths[0]
// })

// // ─── TTS ──────────────────────────────────────────
// ipcMain.handle('tts:speak', async (_, text, voiceId) => {
//   return await textToSpeech(text, ELEVENLABS_KEY, voiceId)
// })

// ipcMain.handle('tts:getVoices', async () => {
//   return VOICE_LIST
// })


// // ─── System Stats ─────────────────────────────────
// ipcMain.handle('system:getStats', async () => {
//   return await getSystemStats()
// })

import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { sendMessage } from './services/ai.js'
import { transcribeAudio } from './services/speech.js'
import {
  getAllConversations,
  createConversation,
  getConversationMessages,
  addMessage,
  deleteConversation,
  updateConversationTitle
} from './services/conversations.js'
import { getAllMemory, saveMemory, searchMemory, deleteMemory } from './services/memory.js'
import { openApp, openPath, openURL, openBrowser, browserSearch, closeAllApps } from './services/desktop.js'
import { searchDuckDuckGo } from './services/search.js'
import { logger } from './services/logger.js'
import { processFile, searchRAG, getAllDocs, deleteDoc } from './services/rag.js'
import { textToSpeech, VOICE_LIST } from './services/tts.js'
import {
  getSystemStats,
  shutdownSystem,
  restartSystem,
  sleepSystem,
  cancelShutdown
} from './services/system.js'
import { getApiKeys, saveApiKeys, resolveKey } from './services/settings.js'
import { getWindowState, attachWindowStateSaver } from './services/windowState.js'

async function createWindow() {
  const state = await getWindowState()

  const win = new BrowserWindow({
    width: state.width,
    height: state.height,
    x: state.x ?? undefined,
    y: state.y ?? undefined,
    minWidth: 1024,
    minHeight: 680,
    frame: false,
    backgroundColor: '#050508',
    title: 'Aria AI',
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  if (state.isMaximized) win.maximize()
  win.once('ready-to-show', () => win.show())
  attachWindowStateSaver(win)

  if (process.env.NODE_ENV === 'development') {
    win.loadURL(process.env.ELECTRON_RENDERER_URL)
    win.webContents.openDevTools()
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return win
}

app.whenReady().then(async () => {
  await createWindow()
  logger.info('Aria AI started')

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// ─── AI ───────────────────────────────────────────────
ipcMain.handle('ai:sendMessage', async (_, messages, model) => {
  const apiKey = await resolveKey('openrouter')
  return await sendMessage(messages, model, apiKey)
})

// ─── Conversations ────────────────────────────────────
ipcMain.handle('conv:getAll', async () => await getAllConversations())
ipcMain.handle('conv:create', async (_, title) => await createConversation(title))
ipcMain.handle('conv:getMessages', async (_, id) => await getConversationMessages(id))
ipcMain.handle('conv:addMessage', async (_, id, role, content) => await addMessage(id, role, content))
ipcMain.handle('conv:delete', async (_, id) => await deleteConversation(id))
ipcMain.handle('conv:updateTitle', async (_, id, title) => await updateConversationTitle(id, title))

// ─── Memory ───────────────────────────────────────────
ipcMain.handle('memory:getAll', async () => await getAllMemory())
ipcMain.handle('memory:save', async (_, fact) => await saveMemory(fact))
ipcMain.handle('memory:search', async (_, query) => await searchMemory(query))
ipcMain.handle('memory:delete', async (_, id) => await deleteMemory(id))

// ─── Speech ───────────────────────────────────────────
ipcMain.handle('speech:transcribe', async (_, audioBuffer) => {
  const apiKey = await resolveKey('groq')
  return await transcribeAudio(audioBuffer, apiKey)
})

// ─── Desktop ──────────────────────────────────────────
ipcMain.handle('desktop:openApp', async (_, appName) => await openApp(appName))
ipcMain.handle('desktop:openPath', async (_, filePath) => await openPath(filePath))
ipcMain.handle('desktop:openURL', async (_, url) => await openURL(url))
ipcMain.handle('desktop:openBrowser', async (_, browserName, url) => await openBrowser(browserName, url))
ipcMain.handle('desktop:browserSearch', async (_, browserName, query) => await browserSearch(browserName, query))
ipcMain.handle('desktop:closeAllApps', async () => await closeAllApps())

// ─── Search ───────────────────────────────────────────
ipcMain.handle('search:query', async (_, query) => await searchDuckDuckGo(query))

// ─── Window Controls ──────────────────────────────────
ipcMain.on('window:minimize', () => BrowserWindow.getFocusedWindow()?.minimize())
ipcMain.on('window:maximize', () => {
  const win = BrowserWindow.getFocusedWindow()
  win?.isMaximized() ? win.unmaximize() : win.maximize()
})
ipcMain.on('window:close', () => BrowserWindow.getFocusedWindow()?.close())

// ─── RAG ──────────────────────────────────────────
ipcMain.handle('rag:processFile', async (_, filePath, fileName) => await processFile(filePath, fileName))
ipcMain.handle('rag:search', async (_, query) => await searchRAG(query))
ipcMain.handle('rag:getAllDocs', async () => await getAllDocs())
ipcMain.handle('rag:deleteDoc', async (_, docId) => await deleteDoc(docId))
ipcMain.handle('rag:getFilePath', async () => {
  const { dialog } = await import('electron')
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Documents', extensions: ['pdf', 'txt', 'docx'] }]
  })
  if (result.canceled) return null
  return result.filePaths[0]
})

// ─── TTS ──────────────────────────────────────────
ipcMain.handle('tts:speak', async (_, text, voiceId) => {
  const apiKey = await resolveKey('elevenlabs')
  return await textToSpeech(text, apiKey, voiceId)
})
ipcMain.handle('tts:getVoices', async () => VOICE_LIST)

// ─── System Stats ─────────────────────────────────
ipcMain.handle('system:getStats', async () => await getSystemStats())

// ─── System Power Controls ────────────────────────
ipcMain.handle('system:shutdown', async () => await shutdownSystem())
ipcMain.handle('system:restart', async () => await restartSystem())
ipcMain.handle('system:sleep', async () => await sleepSystem())
ipcMain.handle('system:cancelShutdown', async () => await cancelShutdown())

// ─── Settings / API Keys ──────────────────────────
ipcMain.handle('settings:getKeys', async () => {
  const keys = await getApiKeys()
  const masked = {}
  for (const k in keys) {
    masked[k] = keys[k] ? `${'•'.repeat(Math.max(0, keys[k].length - 4))}${keys[k].slice(-4)}` : ''
  }
  return { masked, hasKey: Object.fromEntries(Object.keys(keys).map((k) => [k, !!keys[k]])) }
})
ipcMain.handle('settings:saveKeys', async (_, keys) => {
  await saveApiKeys(keys)
  return { success: true }
})