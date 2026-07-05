import { useEffect, useRef, useState } from 'react'
import useNovaStore from '../store/useNovaStore'

const WAKE_WORDS = ['hey atlas', 'atlas', 'hey atlas!', ' hey, atlas']
const SILENCE_THRESHOLD = 0.015
const SILENCE_DURATION = 900
const MIN_SPEECH_DURATION = 300
const MAX_CLIP_DURATION = 8000

export default function WakeWord() {
  const [isWatching, setIsWatching] = useState(false)
  const [status, setStatus] = useState('sleeping')
  const streamRef = useRef(null)
  const isActiveRef = useRef(false)

  const { sendMessage, setIsListening, selectedVoice } = useNovaStore()

  const waitForSpeakingToEnd = () => {
    return new Promise((resolve) => {
      const check = () => {
        if (!useNovaStore.getState().isSpeaking) resolve()
        else setTimeout(check, 150)
      }
      check()
    })
  }

  const checkWakeWord = async (audioBlob) => {
    try {
      const arrayBuffer = await audioBlob.arrayBuffer()
      const result = await window.nova.speech.transcribe(arrayBuffer)
      if (!result.success || !result.text) return false
      const text = result.text.toLowerCase().trim()
      console.log('Wake check:', text)
      return WAKE_WORDS.some((w) => text.includes(w))
    } catch {
      return false
    }
  }

  const recordUntilSilence = (stream) => {
    return new Promise((resolve) => {
      const chunks = []
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      recorder.ondataavailable = (e) => chunks.push(e.data)

      let settled = false
      const finish = (result) => {
        if (settled) return
        settled = true
        resolve(result)
      }

      recorder.onstop = () => finish(new Blob(chunks, { type: 'audio/webm' }))

      const audioCtx = new AudioContext()
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 512
      source.connect(analyser)
      const data = new Uint8Array(analyser.frequencyBinCount)

      let speechStarted = false
      let silenceStart = null
      let speechStart = null
      let rafId = null
      let hardStopTimer = null

      const getEnergy = () => {
        analyser.getByteTimeDomainData(data)
        let sum = 0
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128
          sum += v * v
        }
        return Math.sqrt(sum / data.length)
      }

      const cleanup = () => {
        cancelAnimationFrame(rafId)
        clearTimeout(hardStopTimer)
        try { source.disconnect() } catch { }
        audioCtx.close().catch(() => { })
      }

      const tick = () => {
        if (!isActiveRef.current) {
          cleanup()
          finish(null)
          return
        }

        const energy = getEnergy()

        if (energy > SILENCE_THRESHOLD) {
          if (!speechStarted) {
            speechStarted = true
            speechStart = Date.now()
            recorder.start()
            hardStopTimer = setTimeout(() => {
              if (recorder.state === 'recording') recorder.stop()
              cleanup()
            }, MAX_CLIP_DURATION)
          }
          silenceStart = null
        } else if (speechStarted) {
          if (!silenceStart) silenceStart = Date.now()
          if (Date.now() - silenceStart > SILENCE_DURATION) {
            const duration = Date.now() - speechStart
            cleanup()
            if (recorder.state === 'recording') recorder.stop()
            if (duration < MIN_SPEECH_DURATION) finish(null)
            return
          }
        }

        rafId = requestAnimationFrame(tick)
      }

      rafId = requestAnimationFrame(tick)
    })
  }

  const runWakeLoop = async (stream) => {
    while (isActiveRef.current) {
      if (useNovaStore.getState().isSpeaking) {
        setStatus('waiting...')
        await waitForSpeakingToEnd()
        if (!isActiveRef.current) break
      }

      setStatus('sleeping 💤')
      const clip = await recordUntilSilence(stream)
      if (!clip || !isActiveRef.current) continue

      setStatus('checking...')
      const detected = await checkWakeWord(clip)
      if (!detected || !isActiveRef.current) continue

      setStatus('awake 👂')
      await useNovaStore.getState().speak('Haan boss, boliye')
      if (!isActiveRef.current) break

      setIsListening(true)
      setStatus('listening...')
      const commandClip = await recordUntilSilence(stream)
      setIsListening(false)

      if (commandClip && isActiveRef.current) {
        setStatus('processing...')
        const arrayBuffer = await commandClip.arrayBuffer()
        const result = await window.nova.speech.transcribe(arrayBuffer)
        if (result.success && result.text?.trim()) {
          await sendMessage(result.text)
          await waitForSpeakingToEnd()
        }
      }

      setStatus('sleeping 💤')
    }
  }

  const startWatching = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      setIsWatching(true)
      isActiveRef.current = true
      setStatus('sleeping')
      runWakeLoop(stream)
    } catch (err) {
      console.error('Mic error:', err)
      setIsWatching(false)
    }
  }

  const stopWatching = () => {
    isActiveRef.current = false
    setIsWatching(false)
    setStatus('off')

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }

  useEffect(() => {
    return () => stopWatching()
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '4px 10px',
        background: isWatching ? '#00e5ff20' : 'var(--bg-active)',
        border: `1px solid ${isWatching ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: '20px',
        cursor: 'pointer',
        transition: 'all 0.3s'
      }}
      onClick={isWatching ? stopWatching : startWatching}
    >
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: isWatching
            ? status.includes('awake')
              ? '#22c55e'
              : status.includes('listen') || status.includes('processing')
                ? '#f59e0b'
                : 'var(--accent)'
            : 'var(--text-muted)',
          animation: isWatching ? 'pulse 2s infinite' : 'none',
          boxShadow: isWatching ? '0 0 8px var(--accent)' : 'none'
        }}
      />
      <span style={{ fontSize: '12px', color: isWatching ? 'var(--accent)' : 'var(--text-muted)' }}>
        {isWatching ? `Aria ${status}` : 'Wake Word Off'}
      </span>
    </div>
  )
}