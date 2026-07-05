import { useEffect, useRef } from 'react'

const CLAP_ENERGY_THRESHOLD = 0.35   // clap ek loud sharp sound hai, high threshold
const CLAP_MIN_GAP = 150             // do spikes ke beech minimum gap (same clap dobara na count ho)
const DOUBLE_CLAP_WINDOW = 1200      // do claps itne time ke andar hone chahiye

export default function ClapDetector() {
  const claptimestampsRef = useRef([])

  useEffect(() => {
    let audioCtx = null
    let stream = null
    let rafId = null
    let active = true

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        audioCtx = new AudioContext()
        const source = audioCtx.createMediaStreamSource(stream)
        const analyser = audioCtx.createAnalyser()
        analyser.fftSize = 512
        source.connect(analyser)
        const data = new Uint8Array(analyser.frequencyBinCount)

        let lastSpikeTime = 0

        const tick = () => {
          if (!active) return

          analyser.getByteTimeDomainData(data)
          let peak = 0
          for (let i = 0; i < data.length; i++) {
            const v = Math.abs((data[i] - 128) / 128)
            if (v > peak) peak = v
          }

          const now = Date.now()

          if (peak > CLAP_ENERGY_THRESHOLD && now - lastSpikeTime > CLAP_MIN_GAP) {
            lastSpikeTime = now
            claptimestampsRef.current.push(now)

            // Purane (bahut purane) claps hata do
            claptimestampsRef.current = claptimestampsRef.current.filter(
              (t) => now - t < DOUBLE_CLAP_WINDOW
            )

            if (claptimestampsRef.current.length >= 2) {
              console.log('👏👏 Double clap detected!')
              claptimestampsRef.current = []
              window.nova.window.togglePopup()
            }
          }

          rafId = requestAnimationFrame(tick)
        }

        rafId = requestAnimationFrame(tick)
      } catch (err) {
        console.error('ClapDetector mic error:', err)
      }
    }

    start()

    return () => {
      active = false
      cancelAnimationFrame(rafId)
      if (stream) stream.getTracks().forEach((t) => t.stop())
      if (audioCtx) audioCtx.close().catch(() => {})
    }
  }, [])

  return null // yeh sirf background listener hai, UI nahi dikhata
}