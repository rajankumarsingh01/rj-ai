import { useEffect } from 'react'
import useNovaStore from '../store/useNovaStore'
import '../styles/sidebar.css'

export default function Sidebar() {
  const {
    conversations, activeChatId, isSidebarOpen,
    loadConversations, loadMessages, createNewChat, deleteChat
  } = useNovaStore()

  useEffect(() => {
    loadConversations()
  }, [])

  if (!isSidebarOpen) return null

  return (
    <aside className="sidebar glass">
      <div className="sidebar-new-chat-wrap">
        <button
          onClick={createNewChat}
          className="btn btn-primary sidebar-new-chat-btn"
        >
          + New Session
        </button>
      </div>

      <div className="sidebar-list">
        {conversations.length === 0 && (
          <p className="sidebar-empty">Koi baat nahi hui abhi</p>
        )}
        {conversations.map((conv, i) => (
          <div
            key={conv.id}
            onClick={() => loadMessages(conv.id)}
            className={`sidebar-item ${activeChatId === conv.id ? 'active' : ''}`}
            style={{ animationDelay: `${Math.min(i * 0.03, 0.3)}s` }}
          >
            <span className="sidebar-item-title">
              <span className="sidebar-item-dot" />
              {conv.title}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); deleteChat(conv.id) }}
              className="sidebar-item-delete"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <span className="footer-line-1">RJ AI · Neural Core 2026</span>
        <span className="footer-line-2">
          Crafted with <span className="footer-heart">❤</span> by <span className="footer-name">Rajan Kumar Singh</span>
        </span>
      </div>
    </aside>
  )
}