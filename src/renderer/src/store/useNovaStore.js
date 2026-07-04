import { create } from 'zustand'

const RISKY_ACTIONS = [
  'closeAllApps', 'systemShutdown', 'systemRestart', 'systemSleep'
]

const useNovaStore = create((set, get) => ({

  // ─── Conversations ──────────────────────────────
  conversations: [],
  activeChatId: null,
  messages: [],

  setConversations: (conversations) => set({ conversations }),
  setActiveChatId: (id) => set({ activeChatId: id }),
  setMessages: (messages) => set({ messages }),

  addMessageToState: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  updateLastMessage: (content) =>
    set((state) => {
      const msgs = [...state.messages]
      if (msgs.length > 0) {
        msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], content }
      }
      return { messages: msgs }
    }),

  // ─── UI State ───────────────────────────────────
  isLoading: false,
  setIsLoading: (val) => set({ isLoading: val }),

  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  // ─── Model ──────────────────────────────────────
  selectedModel: 'google/gemini-2.5-flash',
  setSelectedModel: (model) => set({ selectedModel: model }),

  // ─── Voice ──────────────────────────────────────
  isListening: false,
  setIsListening: (val) => set({ isListening: val }),

  isSpeaking: false,
  setIsSpeaking: (val) => set({ isSpeaking: val }),
  activeAudio: null,

  selectedVoice: 'adam',
  setSelectedVoice: (voiceId) => set({ selectedVoice: voiceId }),

  ttsEnabled: true,
  setTtsEnabled: (val) => set({ ttsEnabled: val }),

  // ─── Memory ─────────────────────────────────────
  memories: [],
  setMemories: (memories) => set({ memories }),

  // ─── Action Confirmation ────────────────────────
  pendingConfirmation: null,

  requestActionConfirmation: (type, value) => {
    return new Promise((resolve) => {
      set({ pendingConfirmation: { type, value, resolve } })
    })
  },

  resolveActionConfirmation: (allowed) => {
    const { pendingConfirmation } = get()
    if (pendingConfirmation) pendingConfirmation.resolve(allowed)
    set({ pendingConfirmation: null })
  },

  // ─── Actions ────────────────────────────────────
  loadConversations: async () => {
    const convs = await window.nova.conv.getAll()
    set({ conversations: convs || [] })
  },

  loadMessages: async (chatId) => {
    const msgs = await window.nova.conv.getMessages(chatId)
    set({ messages: msgs || [], activeChatId: chatId })
  },

  createNewChat: async () => {
    const conv = await window.nova.conv.create('Nai Baat')
    const convs = await window.nova.conv.getAll()
    set({ conversations: convs || [], activeChatId: conv.id, messages: [] })
    return conv
  },

  deleteChat: async (id) => {
    await window.nova.conv.delete(id)
    const state = get()
    const convs = await window.nova.conv.getAll()

    if (state.activeChatId === id) {
      if (convs.length > 0) {
        const msgs = await window.nova.conv.getMessages(convs[0].id)
        set({ conversations: convs, activeChatId: convs[0].id, messages: msgs || [] })
      } else {
        set({ conversations: [], activeChatId: null, messages: [] })
      }
    } else {
      set({ conversations: convs })
    }
  },

  sendMessage: async (content) => {
    const state = get()
    let chatId = state.activeChatId

    if (!chatId) {
      const conv = await window.nova.conv.create('Nai Baat')
      chatId = conv.id
      const convs = await window.nova.conv.getAll()
      set({ conversations: convs, activeChatId: chatId })
    }

    const userMsg = { role: 'user', content, timestamp: new Date().toISOString() }
    set((state) => ({ messages: [...state.messages, userMsg], isLoading: true }))
    await window.nova.conv.addMessage(chatId, 'user', content)

    const allMemory = await window.nova.memory.getAll()
    const memoryContext = allMemory.length > 0
      ? `[Mujhe yeh baatein yaad hain user ke baare mein: ${allMemory.map((m) => m.fact).join(' | ')}]`
      : ''

    const ragResults = await window.nova.rag.search(content)
    const ragContext = ragResults.length > 0
      ? `[Documents se relevant information:\n${ragResults.map((r) => `[${r.fileName}]: ${r.chunk}`).join('\n\n')}]`
      : ''

    console.log('Memory context:', memoryContext ? 'hai' : 'nahi')
    console.log('RAG results:', ragResults.length)

    const currentMessages = get().messages
    const allMessages = currentMessages.map((m) => ({ role: m.role, content: m.content }))

    let injectedContent = content
    if (ragContext) injectedContent = `${ragContext}\n\n${injectedContent}`
    if (memoryContext) injectedContent = `${memoryContext}\n\n${injectedContent}`

    if (allMessages.length > 0) {
      allMessages[allMessages.length - 1] = { role: 'user', content: injectedContent }
    }

    const aiResponse = await window.nova.ai.sendMessage(allMessages, state.selectedModel)
    let assistantContent = aiResponse.content

    console.log('AI raw response:', assistantContent)

    // ─── Action Handler ───────────────────────────────
    const lines = assistantContent.trim().split('\n').map(l => l.trim()).filter(l => l.startsWith('ACTION:'))

    if (lines.length > 0) {
      const actionMessages = []

      for (const line of lines) {
        const parts = line.split(':')
        const actionType = parts[1]
        const actionValue = parts.slice(2).join(':')

        console.log('Action detected:', actionType, '|', actionValue)

        if (RISKY_ACTIONS.includes(actionType)) {
          const allowed = await get().requestActionConfirmation(actionType, actionValue)
          if (!allowed) {
            actionMessages.push(`${actionType} cancel kar diya`)
            continue
          }
        }

        let actionResult = null

        if (actionType === 'openApp') {
          actionResult = await window.nova.desktop.openApp(actionValue)
        } else if (actionType === 'openURL') {
          actionResult = await window.nova.desktop.openURL(actionValue)
        } else if (actionType === 'openPath') {
          actionResult = await window.nova.desktop.openPath(actionValue)
        } else if (actionType === 'openBrowser') {
          const [browserName, url] = actionValue.split('|')
          actionResult = await window.nova.desktop.openBrowser(browserName?.trim(), url?.trim())
        } else if (actionType === 'browserSearch') {
          const [browserName, query] = actionValue.split('|')
          actionResult = await window.nova.desktop.browserSearch(browserName?.trim(), query?.trim())
        } else if (actionType === 'closeAllApps') {
          actionResult = await window.nova.desktop.closeAllApps()
        } else if (actionType === 'systemShutdown') {
          actionResult = await window.nova.systemControl.shutdown()
        } else if (actionType === 'systemRestart') {
          actionResult = await window.nova.systemControl.restart()
        } else if (actionType === 'systemSleep') {
          actionResult = await window.nova.systemControl.sleep()
        } else if (actionType === 'search') {
          const searchResult = await window.nova.search.query(actionValue)
          if (searchResult.success) {
            window.dispatchEvent(new CustomEvent('nova:search', {
              detail: { results: searchResult.results, query: actionValue }
            }))
          }
          actionResult = { message: `"${actionValue}" search kar raha hoon` }
        } else if (actionType === 'remember') {
          await window.nova.memory.save(actionValue)
          actionResult = { message: 'Yaad rakh liya' }
        }

        if (actionResult?.message) actionMessages.push(actionResult.message)
      }

      assistantContent = actionMessages.join(', ') || 'Kaam ho gaya!'
      console.log('Actions done:', assistantContent)
    }

    const assistantMsg = {
      role: 'assistant',
      content: assistantContent,
      timestamp: new Date().toISOString()
    }
    set((state) => ({ messages: [...state.messages, assistantMsg], isLoading: false }))
    await window.nova.conv.addMessage(chatId, 'assistant', assistantContent)

    const lower = content.toLowerCase()
    if (lower.includes('yaad rakho') || lower.includes('remember') || lower.includes('note karo')) {
      await window.nova.memory.save(content)
      console.log('Memory saved:', content)
    }

    const currentConvs = get().conversations
    const conv = currentConvs.find((c) => c.id === chatId)
    if (conv && conv.title === 'Nai Baat') {
      const shortTitle = content.slice(0, 30)
      await window.nova.conv.updateTitle(chatId, shortTitle)
      await get().loadConversations()
    }

    const currentState = get()
    if (currentState.ttsEnabled) {
      try {
        set({ isSpeaking: true })
        const ttsResult = await window.nova.tts.speak(assistantContent, currentState.selectedVoice)

        if (ttsResult.success && ttsResult.audioData) {
          const audioUrl = `data:${ttsResult.mimeType};base64,${ttsResult.audioData}`
          const audio = new Audio()
          set({ activeAudio: audio })

          audio.onended = () => set({ isSpeaking: false, activeAudio: null })
          audio.onerror = (e) => {
            console.error('Audio play error:', e)
            set({ isSpeaking: false, activeAudio: null })
            const utterance = new SpeechSynthesisUtterance(assistantContent)
            utterance.lang = 'en-US'
            utterance.onend = () => set({ isSpeaking: false })
            window.speechSynthesis.speak(utterance)
          }

          audio.src = audioUrl
          try {
            await audio.play()
          } catch (playErr) {
            console.error('Play() rejected:', playErr)
            audio.onerror(playErr)
          }
        } else {
          set({ isSpeaking: false })
        }
      } catch (err) {
        console.error('TTS block error:', err)
        set({ isSpeaking: false })
      }
    }

    return assistantContent
  }

}))

export default useNovaStore