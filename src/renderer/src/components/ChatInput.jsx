import { useState, useRef } from 'react'
import useNovaStore from '../store/useNovaStore'

export default function ChatInput() {
    const [input, setInput] = useState('')
    const { sendMessage, isLoading, isListening, setIsListening } = useNovaStore()
    const textareaRef = useRef(null)
    const mediaRecorderRef = useRef(null)
    const chunksRef = useRef([])

    const handleSend = async () => {
        const text = input.trim()
        if (!text || isLoading) return
        setInput('')
        textareaRef.current.style.height = 'auto'
        await sendMessage(text)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleInput = (e) => {
        setInput(e.target.value)
        e.target.style.height = 'auto'
        e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
    }

    const handleVoice = async () => {

        console.log('Voice button clicked')
        console.log('isListening:', isListening)

        if (isListening) {
            console.log('Stopping recorder...')

            mediaRecorderRef.current?.stop()
            return
        }

        try {
            console.log('Requesting mic permission...')
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

            console.log('Mic permission granted:', stream)

            const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })

            console.log('MediaRecorder created:', recorder)

            mediaRecorderRef.current = recorder
            chunksRef.current = []

            recorder.ondataavailable = (e) => chunksRef.current.push(e.data)

            recorder.onstop = async () => {
                stream.getTracks().forEach(t => t.stop())
                setIsListening(false)

                console.log('Recording stopped, chunks:', chunksRef.current.length)

                const blob = new Blob(chunksRef.current, { type: 'audio/webm' })

                  console.log('Blob size:', blob.size)

                const arrayBuffer = await blob.arrayBuffer()

                console.log('ArrayBuffer size:', arrayBuffer.byteLength)

                const result = await window.nova.speech.transcribe(arrayBuffer)

                console.log('Transcribe result:', result)

                if (result.success && result.text) {
                    setInput(result.text)
                    textareaRef.current?.focus()
                }
            }

            recorder.start()
            setIsListening(true)
        } catch (err) {
            console.error('Mic error:', err)
            setIsListening(false)
        }
    }

    return (
        <div style={{
            padding: '16px 20px',
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border)',
            flexShrink: 0,
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '10px',
                background: 'var(--bg-active)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '8px 12px',
            }}>
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                   placeholder="RJ se kuch bhi pucho..."
                    rows={1}
                    style={{
                        flex: 1,
                        background: 'none',
                        border: 'none',
                        outline: 'none',
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                        resize: 'none',
                        lineHeight: '1.5',
                        maxHeight: '120px',
                        overflowY: 'auto',
                        fontFamily: 'var(--font)',
                    }}
                />

                {/* Voice Button */}
                <button
                    onClick={handleVoice}
                    title={isListening ? 'Recording... click to stop' : 'Voice input'}
                    style={{
                        background: isListening ? 'var(--danger)' : 'var(--bg-hover)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 10px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: isListening ? '#fff' : 'var(--text-secondary)',
                        transition: 'all 0.2s',
                        flexShrink: 0,
                        animation: isListening ? 'pulse 1s infinite' : 'none',
                    }}
                >
                    🎤
                </button>

                {/* Send Button */}
                <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    style={{
                        background: input.trim() && !isLoading ? 'var(--accent)' : 'var(--bg-hover)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 14px',
                        cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                        fontSize: '14px',
                        color: input.trim() && !isLoading ? '#fff' : 'var(--text-muted)',
                        transition: 'all 0.2s',
                        flexShrink: 0,
                        fontWeight: 600,
                    }}
                >
                    ➤
                </button>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '8px' }}>
                Enter to send • Shift+Enter for new line • 🎤 for voice
            </p>
        </div>
    )
}