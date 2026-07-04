import { useState, useEffect } from 'react'
import ChatWindow from '../components/ChatWindow'
import ChatInput from '../components/ChatInput'
import SearchResults from '../components/SearchResults'

export default function ChatPage() {
  const [searchData, setSearchData] = useState(null)

  useEffect(() => {
    const handler = (e) => setSearchData(e.detail)
    window.addEventListener('nova:search', handler)
    return () => window.removeEventListener('nova:search', handler)
  }, [])

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: 'var(--bg-primary)',
    }}>
      <ChatWindow />
      <ChatInput />
      {searchData && (
        <SearchResults
          results={searchData.results}
          query={searchData.query}
          onClose={() => setSearchData(null)}
        />
      )}
    </div>
  )
}