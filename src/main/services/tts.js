import { logger } from './logger.js'
import { promises as fs } from 'fs'
import path from 'path'
import { app } from 'electron'

const ELEVENLABS_VOICES = {
  adam: 'pNInz6obpgDQGcFmaJgB',
  daniel: 'onwK4e9ZLuTAKqWW03F9',
  arnold: 'VR6AewLTigWG4xSOukaG',
  josh: 'TxGEqnHWrfWFTfGW9XjX',
  sam: 'yoZ06aMxZJJ28mfd3POQ',
  rachel: '21m00Tcm4TlvDq8ikWAM',
  bella: 'EXAVITQu4vr4xnSDxMaL'
}

export const VOICE_LIST = [
  { id: 'adam', name: 'Adam — Deep, Calm & Professional (Recommended)' },
  { id: 'daniel', name: 'Daniel — British, Formal' },
  { id: 'arnold', name: 'Arnold — Deep & Composed' },
  { id: 'josh', name: 'Josh — Young & Energetic' },
  { id: 'sam', name: 'Sam — Natural & Raspy' },
  { id: 'rachel', name: 'Rachel — Warm Female' },
  { id: 'bella', name: 'Bella — Soft Female' }
]

function trimToSentenceBoundary(text, maxLen) {
  if (text.length <= maxLen) return text.trim()
  const cut = text.slice(0, maxLen)
  const lastPunct = Math.max(
    cut.lastIndexOf('.'), cut.lastIndexOf('!'),
    cut.lastIndexOf('?'), cut.lastIndexOf('।')
  )
  return (lastPunct > maxLen * 0.5 ? cut.slice(0, lastPunct + 1) : cut).trim()
}

async function elevenLabsTTS(text, apiKey, voiceId) {
  const id = ELEVENLABS_VOICES[voiceId] || ELEVENLABS_VOICES.adam
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${id}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
      Accept: 'audio/mpeg'
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.65, similarity_boost: 0.8, style: 0.3 }
    })
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`ElevenLabs error: ${response.status} ${err}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer).toString('base64')
}

async function googleTTSFallback(text) {
  const tempPath = path.join(app.getPath('temp'), `aria_tts_${Date.now()}.mp3`)
  const { default: gTTS } = await import('gtts')

  await new Promise((resolve, reject) => {
    const gtts = new gTTS(text, 'en')
    gtts.save(tempPath, (err) => (err ? reject(err) : resolve()))
  })

  const buffer = await fs.readFile(tempPath)
  await fs.unlink(tempPath).catch(() => {})
  return buffer.toString('base64')
}

export async function textToSpeech(text, apiKey, voiceId = 'adam') {
  const cleanText = trimToSentenceBoundary(text, 2000)
  if (!cleanText) return { success: false, audioData: null }

  try {
    let base64Audio

    if (apiKey) {
      try {
        base64Audio = await elevenLabsTTS(cleanText, apiKey, voiceId)
        console.log('TTS via ElevenLabs, size:', base64Audio.length)
      } catch (elError) {
        console.error('❌ ElevenLabs failed:', elError.message)
        logger.error('ElevenLabs TTS failed, falling back', { error: elError.message })
        base64Audio = await googleTTSFallback(cleanText)
        console.log('TTS via Google fallback')
      }
    } else {
      base64Audio = await googleTTSFallback(cleanText)
      console.log('TTS via Google (no ElevenLabs key set)')
    }

    return { success: true, audioData: base64Audio, mimeType: 'audio/mpeg' }
  } catch (error) {
    logger.error('TTS failed completely', { error: error.message })
    return { success: false, audioData: null }
  }
}