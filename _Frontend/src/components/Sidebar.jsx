import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar = () => {
  const { logout } = useAuth()

  return (
    <>
      <nav className="sidebar">
        <div className="nav-links">
          <NavLink to="/create-study">
            <img src="/icons/create-new-study.svg" alt="Create New Study" />
          </NavLink>
          <NavLink to="/dashboard" data-title="Dashboard">
            <img src="/icons/dashboard-icon.svg" alt="Dashboard" />
          </NavLink>
          <NavLink to="/settings">
            <img src="/icons/settings-icon.svg" alt="Settings" />
          </NavLink>
          <NavLink to="/profile">
            <img src="/icons/profile-icon.svg" alt="Profile" />
          </NavLink>
        </div>
        <div className="bottom-navlinks">
          <NavLink to="">
            <img
              src="/icons/logout-icon.svg"
              alt="logout"
              id="logout-btn"
              onClick={logout}
            />
          </NavLink>
          <img src="/icons/oracle-health-icon.svg" alt="oracle health logo" />
        </div>
      </nav>
    </>
  )
}
export default Sidebar
