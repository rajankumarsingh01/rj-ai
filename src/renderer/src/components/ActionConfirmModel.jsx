import useNovaStore from '../store/useNovaStore'
import '../styles/actionConfirm.css'

const ACTION_LABELS = {
  openApp: { icon: '⚡', title: 'Open Application', verb: 'open', danger: false },
  openURL: { icon: '🌐', title: 'Open Website', verb: 'visit', danger: false },
  openPath: { icon: '📁', title: 'Open File / Folder', verb: 'access', danger: false },
  openBrowser: { icon: '🧭', title: 'Open Browser', verb: 'open', danger: false },
  browserSearch: { icon: '🔍', title: 'Browser Search', verb: 'search using', danger: false },
  closeAllApps: { icon: '🗂️', title: 'Close All Apps', verb: 'close all open apps for', danger: true },
  systemShutdown: { icon: '⏻', title: 'Shutdown System', verb: 'shut down', danger: true },
  systemRestart: { icon: '🔄', title: 'Restart System', verb: 'restart', danger: true },
  systemSleep: { icon: '🌙', title: 'Sleep System', verb: 'put to sleep', danger: false }
}

export default function ActionConfirmModal() {
  const { pendingConfirmation, resolveActionConfirmation } = useNovaStore()

  if (!pendingConfirmation) return null

  const { type, value } = pendingConfirmation
  const meta = ACTION_LABELS[type] || { icon: '⚙', title: 'Action', verb: 'run', danger: false }

  return (
    <div className="modal-overlay">
      <div className={`confirm-card glass-strong ${meta.danger ? 'confirm-danger' : ''}`}>
        <div className="confirm-icon">{meta.icon}</div>
        <h3 className="confirm-title">{meta.title}</h3>
        <p className="confirm-body">Aria {meta.verb} karna chahti hai:</p>

        {value && <div className="confirm-value">{value.replace('|', '  →  ')}</div>}

        {meta.danger && (
          <p className="confirm-warning">⚠ Yeh action wapas nahi ho sakta — sochke Allow karo</p>
        )}

        <div className="confirm-actions">
          <button className="btn confirm-deny" onClick={() => resolveActionConfirmation(false)}>
            Deny
          </button>
          <button
            className={`btn ${meta.danger ? 'confirm-allow-danger' : 'btn-primary'} confirm-allow`}
            onClick={() => resolveActionConfirmation(true)}
          >
            Allow
          </button>
        </div>
      </div>
    </div>
  )
}