import '../styles/novaOrb.css'

export default function NovaOrb({ state = 'idle', size = 260 }) {
  // state: 'idle' | 'listening' | 'speaking' | 'thinking'
  return (
    <div className={`orb-container orb-${state}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 300 300" className="orb-svg">
        <defs>
          <radialGradient id="coreGlow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#eafffe" />
            <stop offset="45%" stopColor="#00e5ff" />
            <stop offset="100%" stopColor="#0091a8" />
          </radialGradient>
        </defs>

        {/* Outer dashed rings - rotate at different speeds */}
        <circle className="ring ring-a" cx="150" cy="150" r="140" />
        <circle className="ring ring-b" cx="150" cy="150" r="120" />
        <circle className="ring ring-c" cx="150" cy="150" r="100" />
        <circle className="ring ring-d" cx="150" cy="150" r="82" />

        {/* Orbiting dots */}
        <g className="orbit-dots">
          <circle className="dot" cx="150" cy="10" r="3" />
        </g>
        <g className="orbit-dots orbit-dots-rev">
          <circle className="dot" cx="150" cy="248" r="2.5" />
        </g>

        {/* Inner static thin ring */}
        <circle className="ring-static" cx="150" cy="150" r="62" />

        {/* Core */}
        <circle className="core" cx="150" cy="150" r="48" fill="url(#coreGlow)" />
      </svg>

      <span className="orb-label">ATLAS</span>
    </div>
  )
}