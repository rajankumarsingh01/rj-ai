import { useState } from 'react'
import useNovaStore from '../store/useNovaStore'
import RAGPanel from './RAGPanel'
import WakeWord from './WakeWord'
import SettingsPage from './SettingsPage'
import '../styles/header.css'

export default function Header() {
  const { toggleSidebar, isSpeaking, selectedModel, setSelectedModel } = useNovaStore()

  const [showRAG, setShowRAG] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const models = [
    { id: 'google/gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
    { id: 'deepseek/deepseek-chat', label: 'DeepSeek Chat' },
    { id: 'qwen/qwen-2.5-72b-instruct', label: 'Qwen 2.5 72B' }
  ]

  return (
    <>
      <header className="hud-header glass">
        <div className="header-left">
          <button onClick={toggleSidebar} className="btn-icon">☰</button>
          <button onClick={() => setShowSettings(true)} className="btn-icon" title="Settings">⚙</button>

          <span className="header-brand">
            <span className="header-brand-icon">✦</span> RJ
          </span>

          <WakeWord />

          {isSpeaking && <span className="speaking-indicator">● SPEAKING</span>}

          <button onClick={() => setShowRAG(true)} className="btn-icon" title="Documents">📄</button>
        </div>

        <div>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="model-select"
          >
            {models.map((model) => (
              <option key={model.id} value={model.id}>{model.label}</option>
            ))}
          </select>
        </div>

        <div className="header-right">
          <button onClick={() => window.nova.window.minimize()} className="win-btn" style={{ color: 'var(--text-secondary)' }}>─</button>
          <button onClick={() => window.nova.window.maximize()} className="win-btn" style={{ color: 'var(--text-secondary)' }}>□</button>
          <button onClick={() => window.nova.window.close()} className="win-btn close-btn" style={{ color: 'var(--text-secondary)' }}>✕</button>
        </div>
      </header>

      {showRAG && <RAGPanel onClose={() => setShowRAG(false)} />}
      {showSettings && <SettingsPage onClose={() => setShowSettings(false)} />}
    </>
  )
}