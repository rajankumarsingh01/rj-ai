import { useEffect, useState } from 'react'
import '../../styles/leftPanel.css'

export default function LeftPanel() {
  const [stats, setStats] = useState({
    cpu: 0,
    memUsed: 0,
    memTotal: 0,
    diskUsed: 0,
    diskTotal: 0,
    temp: 55,
    power: 'AC'
  })

  const fetchStats = async () => {
    const data = await window.nova.system.getStats()
    if (!data.success) return

    setStats((s) => ({
      ...s,
      cpu: data.cpu,
      memUsed: data.memory.usedGB,
      memTotal: data.memory.totalGB,
      diskUsed: data.disk.usedGB,
      diskTotal: data.disk.totalGB,
      power: data.power,
      // Temp not available via OS-level APIs without native drivers —
      // simulated proportional to CPU load for a "live" feel
      temp: Math.min(90, 40 + Math.round(data.cpu * 0.5))
    }))
  }

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 3000)
    return () => clearInterval(interval)
  }, [])

  const memPercent = stats.memTotal ? (stats.memUsed / stats.memTotal) * 100 : 0
  const diskPercent = stats.diskTotal ? (stats.diskUsed / stats.diskTotal) * 100 : 0

  return (
    <div className="hud-section">
      <span className="left-panel-title">SYSTEM STATUS</span>

      <div className="stat-card">
        <span className="stat-label">CPU Utilization</span>
        <span className="stat-value">{Math.round(stats.cpu)}%</span>
        <div className="stat-bar-track">
          <div className="stat-bar-fill" style={{ width: `${stats.cpu}%` }} />
        </div>
      </div>

      <div className="stat-card">
        <span className="stat-label">Memory Allocation</span>
        <span className="stat-value">
          {stats.memUsed} <span className="stat-value-sm">/ {stats.memTotal} GB</span>
        </span>
        <div className="stat-bar-track">
          <div className="stat-bar-fill" style={{ width: `${memPercent}%` }} />
        </div>
      </div>

      <div className="stat-card">
        <span className="stat-label">Storage Capacity</span>
        <span className="stat-value">
          {stats.diskUsed} <span className="stat-value-sm">/ {stats.diskTotal} GB</span>
        </span>
        <div className="stat-bar-track">
          <div className="stat-bar-fill" style={{ width: `${diskPercent}%` }} />
        </div>
      </div>

      <div className="stat-card">
        <span className="stat-label">Core Temperature</span>
        <span className="stat-value">{stats.temp}°C</span>
        <div className="stat-bar-track">
          <div
            className="stat-bar-fill temp-gradient"
            style={{ width: `${Math.min(100, stats.temp)}%` }}
          />
        </div>
      </div>

      <div className="stat-card">
        <span className="stat-label">Power Status</span>
        <span className="power-pill">
          <span className="power-dot" />
          POWER: {stats.power}
        </span>
      </div>

      <span className="left-panel-title" style={{ marginTop: 8 }}>ENVIRONMENT</span>

      <div className="env-card">
        <span className="env-icon">🌧️</span>
        <div className="env-info">
          <span className="env-city">Neural City</span>
          <span className="env-temp">18°C</span>
          <span className="env-condition">RAIN</span>
        </div>
      </div>
    </div>
  )
}