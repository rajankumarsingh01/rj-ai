import { readJSON, writeJSON, ensureDir } from './storage.js'
import { logger } from './logger.js'
import { promises as fs } from 'fs'
import path from 'path'
import { getBasePath } from './storage.js'

// Text ko chunks mein todna
function chunkText(text, chunkSize = 200, overlap = 20) {
  const words = text.split(/\s+/).filter(w => w.trim().length > 0)
  
  if (words.length === 0) return []
  
  // Agar text bahut chhota hai to ek hi chunk banao
  if (words.length <= chunkSize) {
    return [words.join(' ')]
  }
  
  const chunks = []
  let i = 0

  while (i < words.length) {
    const chunk = words.slice(i, i + chunkSize).join(' ')
    if (chunk.trim().length > 0) chunks.push(chunk)
    i += chunkSize - overlap
  }

  return chunks
}

// PDF parse karo
async function extractPDF(filePath) {
  try {
    const buffer = await fs.readFile(filePath)
    const uint8Array = new Uint8Array(buffer)

    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')
    const loadingTask = pdfjsLib.getDocument({ data: uint8Array })
    const pdf = await loadingTask.promise

    let fullText = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map((item) => item.str).join(' ')
      fullText += pageText + '\n'
    }
    console.log('Extracted text length:', fullText.length)
    console.log('Extracted text preview:', fullText.slice(0, 500))

    return fullText
  } catch (error) {
    logger.error('PDF extract failed', { error: error.message })
    throw error
  }
}

// TXT parse karo
async function extractTXT(filePath) {
  return await fs.readFile(filePath, 'utf-8')
}

// DOCX parse karo
async function extractDOCX(filePath) {
  try {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ path: filePath })
    return result.value
  } catch (error) {
    logger.error('DOCX extract failed', { error: error.message })
    throw error
  }
}

// File process karo
export async function processFile(filePath, fileName) {
  try {
    const ext = path.extname(fileName).toLowerCase()
    let text = ''

    if (ext === '.pdf') {
      text = await extractPDF(filePath)
    } else if (ext === '.txt') {
      text = await extractTXT(filePath)
    } else if (ext === '.docx') {
      text = await extractDOCX(filePath)
    } else {
      return { success: false, message: 'Sirf PDF, TXT, DOCX supported hain' }
    }

    if (!text || text.trim().length === 0) {
      return { success: false, message: 'File mein koi text nahi mila' }
    }

    // Chunks banao
    const chunks = chunkText(text)

    // Save karo
    const docId = 'doc_' + Date.now()
    const ragIndex = (await readJSON('rag/index.json')) || []

    ragIndex.push({
      id: docId,
      fileName,
      chunkCount: chunks.length,
      createdAt: new Date().toISOString()
    })

    await writeJSON('rag/index.json', ragIndex)
    await writeJSON(`rag/${docId}.json`, { chunks, fileName, docId })

    logger.info('File processed', { fileName, chunks: chunks.length })
    return {
      success: true,
      docId,
      chunkCount: chunks.length,
      message: `${fileName} process ho gaya — ${chunks.length} chunks`
    }
  } catch (error) {
    logger.error('processFile failed', { error: error.message })
    return { success: false, message: error.message }
  }
}

// Query ke liye relevant chunks dhundo
export async function searchRAG(query) {
  try {
    const ragIndex = (await readJSON('rag/index.json')) || []
    if (ragIndex.length === 0) return []

    const queryWords = query.toLowerCase().split(/\s+/)
    const results = []

    for (const doc of ragIndex) {
      const docData = await readJSON(`rag/${doc.id}.json`)
      if (!docData) continue

      for (const chunk of docData.chunks) {
        const chunkLower = chunk.toLowerCase()
        const score = queryWords.filter((w) => chunkLower.includes(w)).length
        if (score > 0) {
          results.push({ chunk, score, fileName: doc.fileName })
        }
      }
    }

    // Score ke hisaab se sort karo — top 3 do
    results.sort((a, b) => b.score - a.score)
    return results.slice(0, 3)
  } catch (error) {
    logger.error('searchRAG failed', { error: error.message })
    return []
  }
}

// Saare documents list karo
export async function getAllDocs() {
  const ragIndex = (await readJSON('rag/index.json')) || []
  return ragIndex
}

// Document delete karo
export async function deleteDoc(docId) {
  try {
    const ragIndex = (await readJSON('rag/index.json')) || []
    const filtered = ragIndex.filter((d) => d.id !== docId)
    await writeJSON('rag/index.json', filtered)

    const { deleteFile } = await import('./storage.js')
    await deleteFile(`rag/${docId}.json`)

    return { success: true }
  } catch (error) {
    logger.error('deleteDoc failed', { error: error.message })
    return { success: false }
  }
}
