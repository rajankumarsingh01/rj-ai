export default function SearchResults({ results, query, onClose }) {
  if (!results) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: '#00000080',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '24px',
        width: '560px',
        maxHeight: '75vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '15px' }}>
            🔍 "{query}" ke results
          </h3>
          <button onClick={onClose} style={{
            background: 'none', border: 'none',
            color: 'var(--text-muted)', cursor: 'pointer', fontSize: '16px'
          }}>✕</button>
        </div>

        {/* Abstract */}
        {results.abstract && (
          <div style={{
            background: 'var(--bg-active)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '16px',
          }}>
            <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.6' }}>
              {results.abstract}
            </p>
            {results.url && (
              <button
                onClick={() => window.nova.desktop.openURL(results.url)}
                style={{
                  marginTop: '10px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  padding: 0,
                }}
              >
                🔗 Source kholein →
              </button>
            )}
          </div>
        )}

        {/* Answer */}
        {results.answer && (
          <div style={{
            background: 'var(--accent-light)',
            border: '1px solid var(--accent)',
            borderRadius: '10px',
            padding: '14px',
          }}>
            <p style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
              💡 {results.answer}
            </p>
          </div>
        )}

        {/* Related Topics */}
        {results.relatedTopics.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Related Topics:</p>
            {results.relatedTopics.map((topic, i) => (
              <div
                key={i}
                onClick={() => topic.url && window.nova.desktop.openURL(topic.url)}
                style={{
                  background: 'var(--bg-active)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  cursor: topic.url ? 'pointer' : 'default',
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.5',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-active)'}
              >
                {topic.text}
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {!results.abstract && !results.answer && results.relatedTopics.length === 0 && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '13px' }}>
            Koi result nahi mila — browser mein search karein?
            <button
              onClick={() => window.nova.desktop.openURL(`https://google.com/search?q=${encodeURIComponent(query)}`)}
              style={{
                display: 'block',
                margin: '10px auto 0',
                background: 'var(--accent)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              Google pe search karo
            </button>
          </p>
        )}
      </div>
    </div>
  )
}