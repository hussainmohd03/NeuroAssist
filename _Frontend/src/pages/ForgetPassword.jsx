import OracleLogo from '../components/OracleLogo'
import { useAuth } from '../context/AuthContext'

import { useState } from 'react'

const ForgetPassword = () => {
  const { sendResetLink } = useAuth()
  const [emailSent, setEmailSent] = useState(false)
  const [formData, setFormData] = useState({
    email: ''
  })
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await sendResetLink(formData)
    if (res.status === 200) {
      setEmailSent(true)
    }
  }
  return (
    <>
      <main className="page-container">
        <OracleLogo />
        <section className="page-content signup-content">
          <h2 id="signup-title">Get client intuitive clinical experiences </h2>
          <h1 id="signup-header">Reset password</h1>
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <label htmlFor="email">Email*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            {emailSent && (
              <p id="Reset-link-msg">
                Password reset link has been sent to your email
              </p>
            )}
            <button
              className="signup-button reset-btn"
              type="submit"
              disabled={emailSent}
            >
              Send Reset Link
            </button>
          </form>
        </section>
        <img src="/logos/oracle-logo.svg" alt="Oracle Logo" id="oracle-logo" />
      </main>
    </>
  )
}
export default ForgetPassword
