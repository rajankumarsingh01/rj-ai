import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('nova', {
  ai: {
    sendMessage: (messages, model) => ipcRenderer.invoke('ai:sendMessage', messages, model)
  },

  conv: {
    getAll: () => ipcRenderer.invoke('conv:getAll'),
    create: (title) => ipcRenderer.invoke('conv:create', title),
    getMessages: (id) => ipcRenderer.invoke('conv:getMessages', id),
    addMessage: (id, role, content) => ipcRenderer.invoke('conv:addMessage', id, role, content),
    delete: (id) => ipcRenderer.invoke('conv:delete', id),
    updateTitle: (id, title) => ipcRenderer.invoke('conv:updateTitle', id, title)
  },

  memory: {
    getAll: () => ipcRenderer.invoke('memory:getAll'),
    save: (fact) => ipcRenderer.invoke('memory:save', fact),
    search: (query) => ipcRenderer.invoke('memory:search', query),
    delete: (id) => ipcRenderer.invoke('memory:delete', id)
  },

  speech: {
    transcribe: (audioBuffer) => ipcRenderer.invoke('speech:transcribe', audioBuffer)
  },

  desktop: {
    openApp: (appName) => ipcRenderer.invoke('desktop:openApp', appName),
    openPath: (filePath) => ipcRenderer.invoke('desktop:openPath', filePath),
    openURL: (url) => ipcRenderer.invoke('desktop:openURL', url),
    openBrowser: (browserName, url) => ipcRenderer.invoke('desktop:openBrowser', browserName, url),
    browserSearch: (browserName, query) => ipcRenderer.invoke('desktop:browserSearch', browserName, query),
    closeAllApps: () => ipcRenderer.invoke('desktop:closeAllApps')
  },

  search: {
    query: (term) => ipcRenderer.invoke('search:query', term)
  },

  window: {
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
    close: () => ipcRenderer.send('window:close')
  },

  rag: {
    processFile: (filePath, fileName) => ipcRenderer.invoke('rag:processFile', filePath, fileName),
    search: (query) => ipcRenderer.invoke('rag:search', query),
    getAllDocs: () => ipcRenderer.invoke('rag:getAllDocs'),
    deleteDoc: (docId) => ipcRenderer.invoke('rag:deleteDoc', docId),
    getFilePath: () => ipcRenderer.invoke('rag:getFilePath')
  },

  tts: {
    speak: (text, voiceId) => ipcRenderer.invoke('tts:speak', text, voiceId),
    getVoices: () => ipcRenderer.invoke('tts:getVoices')
  },

  system: {
    getStats: () => ipcRenderer.invoke('system:getStats')
  },

  systemControl: {
    shutdown: () => ipcRenderer.invoke('system:shutdown'),
    restart: () => ipcRenderer.invoke('system:restart'),
    sleep: () => ipcRenderer.invoke('system:sleep'),
    cancelShutdown: () => ipcRenderer.invoke('system:cancelShutdown')
  },

  settings: {
    getKeys: () => ipcRenderer.invoke('settings:getKeys'),
    saveKeys: (keys) => ipcRenderer.invoke('settings:saveKeys', keys)
  }
})