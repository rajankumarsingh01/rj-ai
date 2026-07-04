import { useEffect, useRef } from 'react'
import useNovaStore from '../store/useNovaStore'
import '../styles/chatWindow.css'

export default function ChatWindow() {
  const { messages, isLoading } = useNovaStore()
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="chat-window">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`msg-row ${msg.role === 'user' ? 'msg-row-user' : 'msg-row-ai'}`}
          style={{ animationDelay: `${Math.min(i * 0.02, 0.3)}s` }}
        >
          {msg.role === 'assistant' && <div className="avatar">✦</div>}
          <div className={`bubble ${msg.role === 'user' ? 'bubble-user' : 'bubble-ai glass'}`}>
            {msg.content}
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="msg-row msg-row-ai">
          <div className="avatar">✦</div>
          <div className="bubble bubble-ai glass typing-bubble">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}