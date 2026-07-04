import { logger } from './logger.js'
import Groq from 'groq-sdk'
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { app } from 'electron'

export async function transcribeAudio(audioBuffer, apiKey) {
  const tempPath = join(app.getPath('temp'), `aria_audio_${Date.now()}.webm`)

  try {
    const groq = new Groq({ apiKey })
    const buffer = Buffer.from(audioBuffer)
    await writeFile(tempPath, buffer)

    const { createReadStream } = await import('fs')
    const transcription = await groq.audio.transcriptions.create({
      file: createReadStream(tempPath),
      model: 'whisper-large-v3-turbo'
      // prompt hata diya — yeh silence pe hallucination create kar raha tha
      // language bhi hata diya — auto-detect Hindi/English dono ke liye better hai
    })

    await unlink(tempPath).catch(() => {})
    console.log('Transcription:', transcription.text)
    return { success: true, text: transcription.text }
  } catch (error) {
    await unlink(tempPath).catch(() => {})
    logger.error('Transcription failed', { error: error.message })
    return { success: false, text: '' }
  }
}