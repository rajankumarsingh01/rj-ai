import { useState, useEffect } from 'react'

export default function RAGPanel({ onClose }) {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    loadDocs()
  }, [])

  const loadDocs = async () => {
    const allDocs = await window.nova.rag.getAllDocs()
    setDocs(allDocs || [])
  }

  const handleUpload = async () => {
    const filePath = await window.nova.rag.getFilePath()
    if (!filePath) return

    // Windows path se sirf file name nikalo
    const fileName = filePath.split('\\').pop().split('/').pop()

    setLoading(true)
    setStatus(`${fileName} process ho raha hai...`)

    const result = await window.nova.rag.processFile(filePath, fileName)
    setStatus(result.message)
    setLoading(false)

    if (result.success) await loadDocs()
  }
  const handleDelete = async (docId) => {
    await window.nova.rag.deleteDoc(docId)
    await loadDocs()
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#00000080',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '24px',
          width: '480px',
          maxHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '16px' }}>📄 Mere Documents</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          style={{
            padding: '10px',
            background: loading ? 'var(--bg-hover)' : 'var(--accent)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 600
          }}
        >
          {loading ? '⏳ Processing...' : '+ File Upload Karo (PDF / TXT / DOCX)'}
        </button>

        {/* Status */}
        {status && (
          <p style={{ fontSize: '12px', color: 'var(--success)', textAlign: 'center' }}>{status}</p>
        )}

        {/* Doc List */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {docs.length === 0 ? (
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '13px',
                textAlign: 'center',
                marginTop: '20px'
              }}
            >
              Koi document upload nahi hua abhi
            </p>
          ) : (
            docs.map((doc) => (
              <div
                key={doc.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  background: 'var(--bg-active)',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  border: '1px solid var(--border)'
                }}
              >
                <div>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                    📄 {doc.fileName}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {doc.chunkCount} chunks
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(doc.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                  onMouseEnter={(e) => (e.target.style.color = 'var(--danger)')}
                  onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
