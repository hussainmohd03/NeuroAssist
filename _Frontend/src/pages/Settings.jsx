import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import SettingsToggleBtns from '../components/SettingsToggleBtns'
import { useUser } from '../context/UserContext'
import { useModal } from '../context/ModalContext'

const Settings = () => {
  const { clearData, deleteAccount } = useUser()
  const { confirm } = useModal()

  const handleDelete = async () => {
    const confirmed = await confirm(
      'Are you sure you want to delete your account?'
    )
    if (confirmed) await deleteAccount()
  }

  const handleClear = async () => {
    const confirmed = await confirm('Clear all your data?')
    if (confirmed) await clearData()
  }
  return (
    <>
      <main className="main-container">
        <Header />
        <Sidebar />
        <section className="settings-content">
          <h1 className="page-title">Settings</h1>
          <h2 className=" page-subtitle">Password and Authentication</h2>
          <h2 className="page-subtitle auth-title">Authenticator App</h2>
          <p className="auth-description">
            Configuring an authenticator app is a good way to add an extra layer
            of security to your OHP account to make sure that only you have the
            ability to log in.
          </p>
          <button className="save-button auth-button">View Backup Codes</button>
          <SettingsToggleBtns />
          <div className="button-container">
            <button
              className="delete-button save-button auth-button"
              onClick={handleDelete}
            >
              Delete Account
            </button>
            <button
              className="clear-button save-button auth-button"
              onClick={handleClear}
            >
              Clear Data
            </button>
          </div>
        </section>
        <img src="/logos/oracle-logo.svg" alt="Oracle Logo" id="oracle-logo" />
      </main>
    </>
  )
}

export default Settings
