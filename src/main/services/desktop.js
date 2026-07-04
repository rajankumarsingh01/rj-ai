import { shell } from 'electron'
import { exec, spawn } from 'child_process'
import { logger } from './logger.js'

const APP_PATHS = {
  chrome: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'google chrome': 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  brave: 'C:\\Users\\asus\\AppData\\Local\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
  'brave browser': 'C:\\Users\\asus\\AppData\\Local\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
  vscode: 'code',
  'vs code': 'code',
  'visual studio code': 'code',
  notepad: 'notepad.exe',
  calculator: 'calc.exe',
  cmd: 'cmd.exe',
  terminal: 'cmd.exe',
  explorer: 'explorer.exe',
  'file explorer': 'explorer.exe'
}

const BROWSER_PATHS = {
  win32: {
    brave: 'C:\\Users\\asus\\AppData\\Local\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
    chrome: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    edge: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    firefox: 'C:\\Program Files\\Mozilla Firefox\\firefox.exe'
  },
  darwin: {
    brave: '/Applications/Brave Browser.app',
    chrome: '/Applications/Google Chrome.app',
    edge: '/Applications/Microsoft Edge.app',
    firefox: '/Applications/Firefox.app'
  },
  linux: {
    brave: 'brave-browser',
    chrome: 'google-chrome',
    edge: 'microsoft-edge',
    firefox: 'firefox'
  }
}

const FRIENDLY_NAMES = {
  'rajankumarsingh.me': 'aapka portfolio',
  'youtube.com': 'YouTube',
  'github.com': 'GitHub',
  'gmail.com': 'Gmail',
  'linkedin.com': 'LinkedIn'
}

function getFriendlyLabel(url) {
  if (!url) return null
  for (const key in FRIENDLY_NAMES) {
    if (url.includes(key)) return FRIENDLY_NAMES[key]
  }
  return null
}

function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export async function openApp(appName) {
  try {
    const key = appName.toLowerCase().trim()
    const appPath = APP_PATHS[key]

    if (!appPath) {
      return { success: false, message: `${appName} ka path nahi pata, boss` }
    }

    await shell.openPath(appPath)
    logger.info('App opened', { appName, appPath })
    return { success: true, message: `${appName} khol raha hoon, boss` }
  } catch (error) {
    logger.error('openApp failed', { error: error.message })
    return { success: false, message: 'App open nahi ho paya, boss' }
  }
}

export async function openPath(filePath) {
  try {
    const result = await shell.openPath(filePath)
    if (result) throw new Error(result)
    return { success: true, message: `${filePath} khol raha hoon, boss` }
  } catch (error) {
    logger.error('openPath failed', { error: error.message })
    return { success: false, message: 'File/folder open nahi ho paya, boss' }
  }
}

export async function openURL(url) {
  try {
    const fullUrl = url.startsWith('http') ? url : `https://${url}`
    const friendly = getFriendlyLabel(fullUrl)
    await shell.openExternal(fullUrl)
    return { success: true, message: friendly ? `${friendly} khol raha hoon, boss` : `Website khol raha hoon, boss` }
  } catch (error) {
    logger.error('openURL failed', { error: error.message })
    return { success: false, message: 'URL open nahi ho paya, boss' }
  }
}

// ─── Open a SPECIFIC browser (Brave, Chrome, Edge, Firefox) ──
export async function openBrowser(browserName, url = null) {
  try {
    const platform = process.platform
    const key = (browserName || '').toLowerCase().trim()
    const browserPath = BROWSER_PATHS[platform]?.[key]
    const fullUrl = url ? (url.startsWith('http') ? url : `https://${url}`) : null
    const displayName = capitalize(key)
    const friendly = getFriendlyLabel(fullUrl)

    if (!browserPath) {
      if (fullUrl) await shell.openExternal(fullUrl)
      return {
        success: !!fullUrl,
        message: fullUrl
          ? `${displayName} nahi mila, default browser mein khol raha hoon, boss`
          : `${displayName} ka path nahi pata, boss`
      }
    }

    if (platform === 'darwin') {
      const args = fullUrl ? ['-a', browserPath, fullUrl] : ['-a', browserPath]
      spawn('open', args, { detached: true, stdio: 'ignore' }).unref()
    } else {
      const args = fullUrl ? [fullUrl] : []
      spawn(browserPath, args, { detached: true, stdio: 'ignore' }).unref()
    }

    logger.info('Browser opened', { browserName, url: fullUrl })
    return {
      success: true,
      message: fullUrl
        ? `${displayName} khol ke ${friendly || 'website'} dikha raha hoon, boss`
        : `${displayName} khol raha hoon, boss`
    }
  } catch (error) {
    logger.error('openBrowser failed', { error: error.message })
    return { success: false, message: 'Browser open nahi ho paya, boss' }
  }
}

// ─── Open a specific browser and search a query in it ──
export async function browserSearch(browserName, query) {
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`
  const result = await openBrowser(browserName, searchUrl)
  const displayName = capitalize((browserName || '').toLowerCase().trim())
  return {
    ...result,
    message: result.success ? `${displayName} mein "${query}" search kar raha hoon, boss` : result.message
  }
}

// ─── Close all visible desktop apps — leaves background/system processes untouched ──
export async function closeAllApps() {
  return new Promise((resolve) => {
    const platform = process.platform
    let cmd

    if (platform === 'win32') {
      cmd = `powershell -Command "Get-Process | Where-Object {$_.MainWindowTitle -ne '' -and $_.ProcessName -notin @('Aria','electron')} | Stop-Process -Force"`
    } else if (platform === 'darwin') {
      cmd = `osascript -e 'tell application "System Events" to set visible of every process to false'`
    } else {
      cmd = `wmctrl -l | awk '{print $1}' | xargs -I{} wmctrl -ic {}`
    }

    exec(cmd, (error) => {
      if (error) {
        logger.error('closeAllApps failed', { error: error.message })
        resolve({ success: false, message: 'Sab apps band nahi ho paye Boss' })
      } else {
        logger.info('All visible apps closed')
        resolve({ success: true, message: 'Saare khule apps band kar diye Boss' })
      }
    })
  })
}