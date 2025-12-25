import { useNotifications } from '../context/NotificationContext'
import { useAuth } from '../context/AuthContext'
const Header = () => {
  const { openPanel } = useNotifications()
  const { unreadCount } = useAuth()
  return (
    <>
      <header className="header">
        <img
          src="/logos/logo-small.svg"
          alt="Oracle Logo"
          className="oracle-logo-small"
        />
        <button className="bell-wrapper" onClick={openPanel}>
          <img src="/icons/bell.svg" className="bell-icon" />
          {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
        </button>
      </header>
    </>
  )
}
export default Header
