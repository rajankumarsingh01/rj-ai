import os from 'os'
import { promises as fs } from 'fs'
import { exec } from 'child_process'
import { powerMonitor } from 'electron'
import { logger } from './logger.js'

// ─── CPU Usage ────────────────────────────────────────
function cpuSnapshot() {
  const cpus = os.cpus()
  let idle = 0
  let total = 0
  cpus.forEach((cpu) => {
    for (const type in cpu.times) total += cpu.times[type]
    idle += cpu.times.idle
  })
  return { idle: idle / cpus.length, total: total / cpus.length }
}

function getCpuUsage() {
  return new Promise((resolve) => {
    const start = cpuSnapshot()
    setTimeout(() => {
      const end = cpuSnapshot()
      const idleDiff = end.idle - start.idle
      const totalDiff = end.total - start.total
      const usage = totalDiff > 0 ? 100 - Math.round((idleDiff / totalDiff) * 100) : 0
      resolve(Math.max(0, Math.min(100, usage)))
    }, 200)
  })
}

function getMemoryUsage() {
  const total = os.totalmem()
  const free = os.freemem()
  const used = total - free
  return {
    usedGB: +(used / 1024 ** 3).toFixed(1),
    totalGB: +(total / 1024 ** 3).toFixed(1)
  }
}

async function getDiskUsage() {
  try {
    const target = process.platform === 'win32' ? 'C:\\' : '/'
    const stats = await fs.statfs(target)
    const total = stats.blocks * stats.bsize
    const free = stats.bfree * stats.bsize
    const used = total - free
    return {
      usedGB: Math.round(used / 1024 ** 3),
      totalGB: Math.round(total / 1024 ** 3)
    }
  } catch (error) {
    logger.error('Disk stat failed', { error: error.message })
    return { usedGB: 0, totalGB: 0 }
  }
}

function getLocalIP() {
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return { ip: iface.address, interfaceName: name }
      }
    }
  }
  return { ip: '127.0.0.1', interfaceName: 'none' }
}

function getPowerStatus() {
  try {
    const onBattery = powerMonitor.isOnBatteryPower()
    return onBattery ? 'BATTERY' : 'AC'
  } catch {
    return 'AC'
  }
}

export async function getSystemStats() {
  try {
    const [cpu, disk] = await Promise.all([getCpuUsage(), getDiskUsage()])
    const memory = getMemoryUsage()
    const network = getLocalIP()
    const power = getPowerStatus()
    const uptimeMin = Math.round(os.uptime() / 60)

    return {
      success: true,
      cpu,
      memory,
      disk,
      network,
      power,
      uptimeMin,
      platform: os.platform(),
      hostname: os.hostname()
    }
  } catch (error) {
    logger.error('getSystemStats failed', { error: error.message })
    return { success: false }
  }
}

// ─── Power Controls — destructive, always confirmed in UI before calling ──
export function shutdownSystem(delaySeconds = 5) {
  return new Promise((resolve) => {
    const platform = process.platform
    let cmd
    if (platform === 'win32') cmd = `shutdown /s /t ${delaySeconds}`
    else if (platform === 'darwin') cmd = `osascript -e 'tell app "System Events" to shut down'`
    else cmd = `shutdown -h +${Math.max(1, Math.ceil(delaySeconds / 60))}`

    exec(cmd, (error) => {
      if (error) {
        logger.error('Shutdown failed', { error: error.message })
        resolve({ success: false, message: 'System shutdown nahi ho paya, boss' })
      } else {
        logger.info('System shutdown triggered')
        resolve({ success: true, message: `System ${delaySeconds} second mein shutdown ho raha hai, boss` })
      }
    })
  })
}

export function restartSystem(delaySeconds = 5) {
  return new Promise((resolve) => {
    const platform = process.platform
    let cmd
    if (platform === 'win32') cmd = `shutdown /r /t ${delaySeconds}`
    else if (platform === 'darwin') cmd = `osascript -e 'tell app "System Events" to restart'`
    else cmd = `shutdown -r +${Math.max(1, Math.ceil(delaySeconds / 60))}`

    exec(cmd, (error) => {
      if (error) {
        logger.error('Restart failed', { error: error.message })
        resolve({ success: false, message: 'System restart nahi ho paya, boss' })
      } else {
        logger.info('System restart triggered')
        resolve({ success: true, message: `System ${delaySeconds} second mein restart ho raha hai, boss` })
      }
    })
  })
}

export function sleepSystem() {
  return new Promise((resolve) => {
    const platform = process.platform
    let cmd
    if (platform === 'win32') cmd = `rundll32.exe powrprof.dll,SetSuspendState 0,1,0`
    else if (platform === 'darwin') cmd = `pmset sleepnow`
    else cmd = `systemctl suspend`

    exec(cmd, (error) => {
      if (error) {
        logger.error('Sleep failed', { error: error.message })
        resolve({ success: false, message: 'System sleep nahi ho paya, boss' })
      } else {
        resolve({ success: true, message: 'System sleep mode mein ja raha hai, boss' })
      }
    })
  })
}

export function cancelShutdown() {
  return new Promise((resolve) => {
    const platform = process.platform
    const cmd = platform === 'win32' ? 'shutdown /a' : 'echo no-op'
    exec(cmd, () => resolve({ success: true, message: 'Shutdown cancel kar diya, boss' }))
  })
}