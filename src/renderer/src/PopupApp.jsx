import { useEffect, useState } from 'react'
import useNovaStore from './store/useNovaStore'
import NovaOrb from './components/NovaOrb'
import './styles/main.css'
import './styles/popup.css'

export default function PopupApp() {
  const { messages, sendMessage, isLoading, isSpeaking } = useNovaStore()
  const [input, setInput] = useState('')

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') window.nova.window.closePopup()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isLoading) return
    setInput('')
    await sendMessage(text)
  }

  const lastMessage = messages[messages.length - 1]

  return (
    <div className="popup-container glass-strong">
      <div className="popup-orb-area">
        <NovaOrb state={isSpeaking ? 'speaking' : isLoading ? 'thinking' : 'idle'} size={90} />
      </div>

      {lastMessage && (
        <div className="popup-last-message">
          <span className="popup-message-role">{lastMessage.role === 'user' ? 'You' : 'Atlas'}</span>
          <p>{lastMessage.content}</p>
        </div>
      )}

      <div className="popup-input-row">
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Atlas se pucho..."
          className="popup-input"
        />
        <button onClick={handleSend} className="btn btn-primary popup-send-btn">➤</button>
      </div>

      <button onClick={() => window.nova.window.closePopup()} className="popup-close-btn">✕</button>
    </div>
  )
}