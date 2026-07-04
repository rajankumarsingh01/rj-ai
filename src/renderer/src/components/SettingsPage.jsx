// import { useState, useEffect } from 'react'
// import useNovaStore from '../store/useNovaStore'

// const MODELS = [
//   { id: 'google/gemini-2.5-flash', label: 'Gemini 2.5 Flash (Fast)' },
//   { id: 'deepseek/deepseek-chat', label: 'DeepSeek Chat (Smart)' },
//   { id: 'qwen/qwen-2.5-72b-instruct', label: 'Qwen 2.5 72B (Powerful)' },
// ]

// const VOICES = [
//   { id: 'en', label: 'English Female (Google)' },
//   { id: 'hi', label: 'Hindi Female (Google)' },
// ]

// const [apiKeys, setApiKeys] = useState({ openrouter: '', groq: '', elevenlabs: '' })
//   const [keyStatus, setKeyStatus] = useState({})
//   const [saveMsg, setSaveMsg] = useState('')

//   useEffect(() => {
//     loadApiKeyStatus()
//   }, [])

//   const loadApiKeyStatus = async () => {
//     const result = await window.nova.settings.getKeys()
//     setKeyStatus(result.hasKey || {})
//   }

//   const handleSaveKey = async (name) => {
//     if (!apiKeys[name]?.trim()) return
//     await window.nova.settings.saveKeys({ [name]: apiKeys[name].trim() })
//     setApiKeys((k) => ({ ...k, [name]: '' }))
//     setSaveMsg(`${name} key saved`)
//     await loadApiKeyStatus()
//     setTimeout(() => setSaveMsg(''), 2000)
//   }


// export default function SettingsPage({ onClose }) {
//   const {
//     selectedModel, setSelectedModel,
//     selectedVoice, setSelectedVoice,
//     ttsEnabled, setTtsEnabled,
//     isSidebarOpen, toggleSidebar,
//   } = useNovaStore()

//   const [memories, setMemories] = useState([])
//   const [activeTab, setActiveTab] = useState('general')

//   useEffect(() => {
//     loadMemories()
//   }, [])

//   const loadMemories = async () => {
//     const mems = await window.nova.memory.getAll()
//     setMemories(mems || [])
//   }

//   const deleteMemory = async (id) => {
//     await window.nova.memory.delete(id)
//     await loadMemories()
//   }

//   const clearAllMemory = async () => {
//     for (const mem of memories) {
//       await window.nova.memory.delete(mem.id)
//     }
//     await loadMemories()
//   }

//   const tabs = [
//     { id: 'general', label: '⚙️ General' },
//     { id: 'voice', label: '🎤 Voice' },
//     { id: 'memory', label: '🧠 Memory' },
//     { id: 'about', label: 'ℹ️ About' },
//   ]

//   return (
//     <div style={{
//       position: 'fixed',
//       top: 0, left: 0, right: 0, bottom: 0,
//       background: '#00000090',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       zIndex: 2000,
//     }}>
//       <div style={{
//         background: 'var(--bg-secondary)',
//         border: '1px solid var(--border)',
//         borderRadius: '16px',
//         width: '600px',
//         height: '500px',
//         display: 'flex',
//         flexDirection: 'column',
//         overflow: 'hidden',
//       }}>

//         {/* Header */}
//         <div style={{
//           padding: '20px 24px',
//           borderBottom: '1px solid var(--border)',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           flexShrink: 0,
//         }}>
//           <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
//             ⚙️ Nova Settings
//           </h2>
//           <button onClick={onClose} style={{
//             background: 'none', border: 'none',
//             color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px'
//           }}>✕</button>
//         </div>

//         <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

//           {/* Sidebar Tabs */}
//           <div style={{
//             width: '160px',
//             borderRight: '1px solid var(--border)',
//             padding: '12px',
//             display: 'flex',
//             flexDirection: 'column',
//             gap: '4px',
//             flexShrink: 0,
//           }}>
//             {tabs.map(tab => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 style={{
//                   background: activeTab === tab.id ? 'var(--accent-light)' : 'none',
//                   border: activeTab === tab.id ? '1px solid var(--accent)' : '1px solid transparent',
//                   color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-secondary)',
//                   borderRadius: '8px',
//                   padding: '10px 12px',
//                   cursor: 'pointer',
//                   fontSize: '13px',
//                   textAlign: 'left',
//                   transition: 'all 0.15s',
//                 }}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </div>

//           {/* Content */}
//           <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>

//             {/* General Tab */}
//             {activeTab === 'general' && (
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
//                 <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
//                   AI Model
//                 </h3>
//                 {MODELS.map(model => (
//                   <div
//                     key={model.id}
//                     onClick={() => setSelectedModel(model.id)}
//                     style={{
//                       padding: '14px 16px',
//                       background: selectedModel === model.id ? 'var(--accent-light)' : 'var(--bg-active)',
//                       border: `1px solid ${selectedModel === model.id ? 'var(--accent)' : 'var(--border)'}`,
//                       borderRadius: '10px',
//                       cursor: 'pointer',
//                       transition: 'all 0.15s',
//                     }}
//                   >
//                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                       <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{model.label}</span>
//                       {selectedModel === model.id && (
//                         <span style={{ color: 'var(--accent)', fontSize: '16px' }}>✓</span>
//                       )}
//                     </div>
//                   </div>
//                 ))}

//                 <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
//                   <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
//                     Interface
//                   </h3>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Sidebar</span>
//                     <div
//                       onClick={toggleSidebar}
//                       style={{
//                         width: '44px', height: '24px',
//                         background: isSidebarOpen ? 'var(--accent)' : 'var(--bg-hover)',
//                         borderRadius: '12px',
//                         cursor: 'pointer',
//                         position: 'relative',
//                         transition: 'background 0.2s',
//                       }}
//                     >
//                       <div style={{
//                         width: '18px', height: '18px',
//                         background: '#fff',
//                         borderRadius: '50%',
//                         position: 'absolute',
//                         top: '3px',
//                         left: isSidebarOpen ? '23px' : '3px',
//                         transition: 'left 0.2s',
//                       }} />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Voice Tab */}
//             {activeTab === 'voice' && (
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

//                 {/* TTS Toggle */}
//                 <div style={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   padding: '14px 16px',
//                   background: 'var(--bg-active)',
//                   border: '1px solid var(--border)',
//                   borderRadius: '10px',
//                 }}>
//                   <div>
//                     <p style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Voice Response</p>
//                     <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
//                       Nova bolke jawab degi
//                     </p>
//                   </div>
//                   <div
//                     onClick={() => setTtsEnabled(!ttsEnabled)}
//                     style={{
//                       width: '44px', height: '24px',
//                       background: ttsEnabled ? 'var(--accent)' : 'var(--bg-hover)',
//                       borderRadius: '12px',
//                       cursor: 'pointer',
//                       position: 'relative',
//                       transition: 'background 0.2s',
//                     }}
//                   >
//                     <div style={{
//                       width: '18px', height: '18px',
//                       background: '#fff',
//                       borderRadius: '50%',
//                       position: 'absolute',
//                       top: '3px',
//                       left: ttsEnabled ? '23px' : '3px',
//                       transition: 'left 0.2s',
//                     }} />
//                   </div>
//                 </div>

//                 {/* Voice Select */}
//                 <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Voice Select</h3>
//                 {VOICES.map(voice => (
//                   <div
//                     key={voice.id}
//                     onClick={() => setSelectedVoice(voice.id)}
//                     style={{
//                       padding: '14px 16px',
//                       background: selectedVoice === voice.id ? 'var(--accent-light)' : 'var(--bg-active)',
//                       border: `1px solid ${selectedVoice === voice.id ? 'var(--accent)' : 'var(--border)'}`,
//                       borderRadius: '10px',
//                       cursor: 'pointer',
//                       display: 'flex',
//                       justifyContent: 'space-between',
//                       alignItems: 'center',
//                       transition: 'all 0.15s',
//                     }}
//                   >
//                     <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{voice.label}</span>
//                     {selectedVoice === voice.id && (
//                       <span style={{ color: 'var(--accent)', fontSize: '16px' }}>✓</span>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Memory Tab */}
//             {activeTab === 'memory' && (
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                   <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
//                     Saved Memories ({memories.length})
//                   </h3>
//                   {memories.length > 0 && (
//                     <button
//                       onClick={clearAllMemory}
//                       style={{
//                         background: 'none',
//                         border: '1px solid var(--danger)',
//                         color: 'var(--danger)',
//                         borderRadius: '6px',
//                         padding: '4px 10px',
//                         cursor: 'pointer',
//                         fontSize: '12px',
//                       }}
//                     >
//                       Sab Clear Karo
//                     </button>
//                   )}
//                 </div>

//                 {memories.length === 0 ? (
//                   <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', marginTop: '20px' }}>
//                     Koi memory nahi hai abhi
//                   </p>
//                 ) : (
//                   memories.map(mem => (
//                     <div key={mem.id} style={{
//                       display: 'flex',
//                       justifyContent: 'space-between',
//                       alignItems: 'flex-start',
//                       padding: '12px 14px',
//                       background: 'var(--bg-active)',
//                       border: '1px solid var(--border)',
//                       borderRadius: '8px',
//                       gap: '10px',
//                     }}>
//                       <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.5', flex: 1 }}>
//                         🧠 {mem.fact}
//                       </p>
//                       <button
//                         onClick={() => deleteMemory(mem.id)}
//                         style={{
//                           background: 'none', border: 'none',
//                           color: 'var(--text-muted)', cursor: 'pointer',
//                           fontSize: '13px', flexShrink: 0,
//                         }}
//                         onMouseEnter={e => e.target.style.color = 'var(--danger)'}
//                         onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
//                       >✕</button>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}

//             {/* About Tab */}
//             {activeTab === 'about' && (
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', paddingTop: '20px' }}>
//                 <div style={{
//                   width: '64px', height: '64px',
//                   background: 'var(--accent)',
//                   borderRadius: '50%',
//                   display: 'flex', alignItems: 'center', justifyContent: 'center',
//                   fontSize: '28px',
//                 }}>✦</div>
//                 <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Nova AI</h2>
//                 <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Version 1.0.0 — 2026</p>
//                 <div style={{
//                   width: '100%',
//                   background: 'var(--bg-active)',
//                   border: '1px solid var(--border)',
//                   borderRadius: '10px',
//                   padding: '16px',
//                   display: 'flex',
//                   flexDirection: 'column',
//                   gap: '10px',
//                 }}>
//                   {[
//                     ['AI Engine', 'OpenRouter (Gemini, DeepSeek, Qwen)'],
//                     ['STT', 'Groq Whisper'],
//                     ['TTS', 'Google TTS'],
//                     ['Memory', 'JSON Storage'],
//                     ['Platform', 'Electron 39 + React 19'],
//                   ].map(([key, val]) => (
//                     <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
//                       <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{key}</span>
//                       <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{val}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }











import { useState, useEffect } from 'react'
import useNovaStore from '../store/useNovaStore'

const MODELS = [
  { id: 'google/gemini-2.5-flash', label: 'Gemini 2.5 Flash (Fast)' },
  { id: 'deepseek/deepseek-chat', label: 'DeepSeek Chat (Smart)' },
  { id: 'qwen/qwen-2.5-72b-instruct', label: 'Qwen 2.5 72B (Powerful)' },
]

const VOICES = [
  { id: 'adam', label: 'Adam — Deep, Calm & Professional (Recommended)' },
  { id: 'daniel', label: 'Daniel — British, Formal' },
  { id: 'arnold', label: 'Arnold — Deep & Composed' },
  { id: 'josh', label: 'Josh — Young & Energetic' },
  { id: 'sam', label: 'Sam — Natural & Raspy' },
  { id: 'rachel', label: 'Rachel — Warm Female' },
  { id: 'bella', label: 'Bella — Soft Female' },
]

export default function SettingsPage({ onClose }) {
  const {
    selectedModel, setSelectedModel,
    selectedVoice, setSelectedVoice,
    ttsEnabled, setTtsEnabled,
    isSidebarOpen, toggleSidebar,
  } = useNovaStore()

  const [memories, setMemories] = useState([])
  const [activeTab, setActiveTab] = useState('general')

  const [apiKeys, setApiKeys] = useState({ openrouter: '', groq: '', elevenlabs: '' })
  const [keyStatus, setKeyStatus] = useState({})
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    loadMemories()
    loadApiKeyStatus()
  }, [])

  const loadMemories = async () => {
    const mems = await window.nova.memory.getAll()
    setMemories(mems || [])
  }

  const deleteMemory = async (id) => {
    await window.nova.memory.delete(id)
    await loadMemories()
  }

  const clearAllMemory = async () => {
    for (const mem of memories) {
      await window.nova.memory.delete(mem.id)
    }
    await loadMemories()
  }

  const loadApiKeyStatus = async () => {
    const result = await window.nova.settings.getKeys()
    setKeyStatus(result.hasKey || {})
  }

  const handleSaveKey = async (name) => {
    if (!apiKeys[name]?.trim()) return
    await window.nova.settings.saveKeys({ [name]: apiKeys[name].trim() })
    setApiKeys((k) => ({ ...k, [name]: '' }))
    setSaveMsg(`${name} key saved`)
    await loadApiKeyStatus()
    setTimeout(() => setSaveMsg(''), 2000)
  }

  const tabs = [
    { id: 'general', label: '⚙️ General' },
    { id: 'voice', label: '🎤 Voice' },
    { id: 'memory', label: '🧠 Memory' },
    { id: 'about', label: 'ℹ️ About' },
  ]

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: '#00000090',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
    }}>
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        width: '600px',
        height: '500px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>

        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
            ⚙️ Nova Settings
          </h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none',
            color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px'
          }}>✕</button>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* Sidebar Tabs */}
          <div style={{
            width: '160px',
            borderRight: '1px solid var(--border)',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            flexShrink: 0,
          }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? 'var(--accent-light)' : 'none',
                  border: activeTab === tab.id ? '1px solid var(--accent)' : '1px solid transparent',
                  color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-secondary)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>

            {/* General Tab */}
            {activeTab === 'general' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  AI Model
                </h3>
                {MODELS.map(model => (
                  <div
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    style={{
                      padding: '14px 16px',
                      background: selectedModel === model.id ? 'var(--accent-light)' : 'var(--bg-active)',
                      border: `1px solid ${selectedModel === model.id ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{model.label}</span>
                      {selectedModel === model.id && (
                        <span style={{ color: 'var(--accent)', fontSize: '16px' }}>✓</span>
                      )}
                    </div>
                  </div>
                ))}

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                  <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    Interface
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Sidebar</span>
                    <div
                      onClick={toggleSidebar}
                      style={{
                        width: '44px', height: '24px',
                        background: isSidebarOpen ? 'var(--accent)' : 'var(--bg-hover)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'background 0.2s',
                      }}
                    >
                      <div style={{
                        width: '18px', height: '18px',
                        background: '#fff',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '3px',
                        left: isSidebarOpen ? '23px' : '3px',
                        transition: 'left 0.2s',
                      }} />
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                  <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    API Keys
                  </h3>

                  {[
                    { key: 'openrouter', label: 'OpenRouter (AI Chat)' },
                    { key: 'groq', label: 'Groq (Voice Transcription)' },
                    { key: 'elevenlabs', label: 'ElevenLabs (Text to Speech)' }
                  ].map(({ key, label }) => (
                    <div key={key} style={{ marginBottom: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{label}</span>
                        <span style={{
                          fontSize: '11px',
                          color: keyStatus[key] ? 'var(--success)' : 'var(--text-muted)'
                        }}>
                          {keyStatus[key] ? '✓ Connected' : '✗ Not set'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="password"
                          placeholder={keyStatus[key] ? 'Update key...' : 'Paste API key...'}
                          value={apiKeys[key]}
                          onChange={(e) => setApiKeys((k) => ({ ...k, [key]: e.target.value }))}
                          style={{
                            flex: 1,
                            background: 'var(--bg-active)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            padding: '8px 10px',
                            color: 'var(--text-primary)',
                            fontSize: '12px',
                            outline: 'none'
                          }}
                        />
                        <button
                          onClick={() => handleSaveKey(key)}
                          style={{
                            background: 'var(--accent)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 14px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 600
                          }}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ))}

                  {saveMsg && (
                    <p style={{ fontSize: '11px', color: 'var(--success)', textAlign: 'center' }}>
                      {saveMsg}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Voice Tab */}
            {activeTab === 'voice' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* TTS Toggle */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 16px',
                  background: 'var(--bg-active)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                }}>
                  <div>
                    <p style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Voice Response</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Nova bolke jawab degi
                    </p>
                  </div>
                  <div
                    onClick={() => setTtsEnabled(!ttsEnabled)}
                    style={{
                      width: '44px', height: '24px',
                      background: ttsEnabled ? 'var(--accent)' : 'var(--bg-hover)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'background 0.2s',
                    }}
                  >
                    <div style={{
                      width: '18px', height: '18px',
                      background: '#fff',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '3px',
                      left: ttsEnabled ? '23px' : '3px',
                      transition: 'left 0.2s',
                    }} />
                  </div>
                </div>

                {/* Voice Select */}
                <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Voice Select</h3>
                {VOICES.map(voice => (
                  <div
                    key={voice.id}
                    onClick={() => setSelectedVoice(voice.id)}
                    style={{
                      padding: '14px 16px',
                      background: selectedVoice === voice.id ? 'var(--accent-light)' : 'var(--bg-active)',
                      border: `1px solid ${selectedVoice === voice.id ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{voice.label}</span>
                    {selectedVoice === voice.id && (
                      <span style={{ color: 'var(--accent)', fontSize: '16px' }}>✓</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Memory Tab */}
            {activeTab === 'memory' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Saved Memories ({memories.length})
                  </h3>
                  {memories.length > 0 && (
                    <button
                      onClick={clearAllMemory}
                      style={{
                        background: 'none',
                        border: '1px solid var(--danger)',
                        color: 'var(--danger)',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      Sab Clear Karo
                    </button>
                  )}
                </div>

                {memories.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', marginTop: '20px' }}>
                    Koi memory nahi hai abhi
                  </p>
                ) : (
                  memories.map(mem => (
                    <div key={mem.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      padding: '12px 14px',
                      background: 'var(--bg-active)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      gap: '10px',
                    }}>
                      <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.5', flex: 1 }}>
                        🧠 {mem.fact}
                      </p>
                      <button
                        onClick={() => deleteMemory(mem.id)}
                        style={{
                          background: 'none', border: 'none',
                          color: 'var(--text-muted)', cursor: 'pointer',
                          fontSize: '13px', flexShrink: 0,
                        }}
                        onMouseEnter={e => e.target.style.color = 'var(--danger)'}
                        onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                      >✕</button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', paddingTop: '20px' }}>
                <div style={{
                  width: '64px', height: '64px',
                  background: 'var(--accent)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '28px',
                }}>✦</div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>RJ AI</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Version 1.0.0 — 2026</p>
                <div style={{
                  width: '100%',
                  background: 'var(--bg-active)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}>
                  {[
                    ['AI Engine', 'OpenRouter (Gemini, DeepSeek, Qwen)'],
                    ['STT', 'Groq Whisper'],
                    ['TTS', 'Google TTS'],
                    ['Memory', 'JSON Storage'],
                    ['Platform', 'Electron 39 + React 19'],
                  ].map(([key, val]) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{key}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}