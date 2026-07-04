import { logger } from './logger.js'


export async function searchDuckDuckGo(query) {
  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1`
    const response = await fetch(url)
    const data = await response.json()

    const result = {
      abstract: data.Abstract || '',
      answer: data.Answer || '',
      url: data.AbstractURL || '',
      relatedTopics: (data.RelatedTopics || []).slice(0, 3).map(t => t.Text).filter(Boolean)
    }

    return { success: true, result }
  } catch (error) {
    logger.error('Search failed', { error: error.message })
    return { success: false, result: null }
  }
}






// export async function searchDuckDuckGo(query) {
//   try {
//     const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1`
//     const response = await fetch(url)
//     const data = await response.json()

//     const results = {
//       abstract: data.Abstract || '',
//       answer: data.Answer || '',
//       url: data.AbstractURL || '',
//       image: data.Image || '',
//       relatedTopics: (data.RelatedTopics || [])
//         .slice(0, 5)
//         .filter(t => t.Text)
//         .map(t => ({
//           text: t.Text,
//           url: t.FirstURL || ''
//         }))
//     }

//     return { success: true, results }
//   } catch (error) {
//     logger.error('Search failed', { error: error.message })
//     return { success: false, results: null }
//   }
// }