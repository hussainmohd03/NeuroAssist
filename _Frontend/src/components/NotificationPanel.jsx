import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import { timeAgo } from '../../utils/timeAgo'
const NotificationPanel = () => {
  const { isOpen, closePanel, clearNotifications } = useNotifications()
  const { notifications } = useAuth()

  if (!isOpen) return null

  return (
    <>
      <div className="notif-overlay" onClick={closePanel}>
        <aside className="notif-panel" onClick={(e) => e.stopPropagation()}>
          <div className="notif-panel-header">
            <h3></h3>
            <button onClick={clearNotifications}>clear</button>
          </div>
          <div className="notif-list">
            {notifications.length === 0 && (
              <p className="notif-empty">No notifications yet.</p>
            )}

            {[...notifications].reverse().map((n) => (
              <div key={n.id} className="notif-row">
                <div className="notif-row-top">
                  <div className="notif-left">
                    <img
                      src="/logos/oracle_notif_logo.svg"
                      className="notif-oracle-icon"
                    />
                    <span className="notif-oracle-title">ORACLE</span>
                  </div>
                  <span className="notif-time">{timeAgo(n.createdAt)}</span>
                </div>
                <p className="notif-row-message">{n.message}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </>
  )
}

export default NotificationPanel
