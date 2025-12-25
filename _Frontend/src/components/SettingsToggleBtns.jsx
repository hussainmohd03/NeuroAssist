const SettingsToggleBtns = () => {
  return (
    <>
      <div className="auth-section">
        <h2 className="page-subtitle auth-title">
          Multi-factor Authentication
        </h2>
        <div className="container">
          <input type="checkbox" className="checkbox" id="checkbox" />
          <label className="switch" htmlFor="checkbox">
            <span className="slider"></span>
          </label>
        </div>
        <p>*MFA enabled</p>
      </div>
      <h2 className="page-subtitle app-theme-title">Application Theme</h2>
      <div className="auth-section dark-mode-section">
        <h2 className="page-subtitle auth-title">Dark Theme</h2>
        <div className="container2">
          <input type="checkbox" className="checkbox2" id="checkbox2" />
          <label className="switch2" htmlFor="checkbox2">
            <span className="slider2"></span>
          </label>
        </div>
      </div>
    </>
  )
}
export default SettingsToggleBtns
