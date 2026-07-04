import { useEffect, useState } from 'react'
import '../../styles/rightPanel.css'

export default function RightPanel() {
  const [now, setNow] = useState(new Date())
  const [network, setNetwork] = useState({
    ip: '—',
    down: 38.6,
    up: 9.2,
    ssid: 'Local Network',
    signal: 90
  })

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const fetchNetwork = async () => {
    const data = await window.nova.system.getStats()
    if (!data.success) return
    setNetwork((n) => ({
      ...n,
      ip: data.network.ip,
      ssid: data.network.interfaceName
    }))
  }

  useEffect(() => {
    fetchNetwork()
    const interval = setInterval(fetchNetwork, 5000)
    return () => clearInterval(interval)
  }, [])

  const timeStr = now.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })

  const signalLevel = Math.round((network.signal / 100) * 4)

  return (
    <div className="hud-section">
      <span className="right-panel-title">TEMPORAL SYNC</span>

      <div className="clock-card">
        <span className="clock-time">{timeStr}</span>
        <span className="clock-date">{dateStr}</span>
      </div>

      <span className="right-panel-title" style={{ marginTop: 8 }}>NETWORK INTERFACE</span>

      <div className="net-card">
        <span className="net-label">IP Address</span>
        <span className="net-value net-value-glow">{network.ip}</span>
      </div>

      <div className="net-card">
        <span className="net-label">Bandwidth</span>
        <div className="net-row">
          <span className="net-arrow-up">↑</span>
          <span className="net-value">{network.up} Mbps</span>
          <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>/</span>
          <span className="net-arrow-down">↓</span>
          <span className="net-value">{network.down} Mbps</span>
        </div>
      </div>

      <div className="net-card">
        <span className="net-label">Connection</span>
        <div className="net-row conn-status">
          <span className="conn-dot" />
          <span className="net-value" style={{ fontSize: 13 }}>
            {network.ssid} — {network.signal}%
          </span>
          <div className="signal-bars">
            {[1, 2, 3, 4].map((bar) => (
              <div
                key={bar}
                className={`signal-bar ${bar <= signalLevel ? 'active' : ''}`}
                style={{ height: `${bar * 3 + 3}px` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}