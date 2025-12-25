import OracleLogo from '../components/OracleLogo'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

const ResetPassword = () => {
  const { ResetPassword } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [formData, setFormData] = useState({
    confirmPassword: '',
    password: '',
    token: ''
  })
  const hasNumber = /\d/.test(formData.password)
  const hasSpecial = /[^A-Za-z0-9]/.test(formData.password)
  const hasMinLength = formData.password.length >= 8
  const passwordsMatch =
    formData.password === formData.confirmPassword && formData.password !== ''

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      setFormData((prev) => ({ ...prev, token }))
    }
  }, [searchParams])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validatePassword) {
      ResetPassword(formData)
    }
  }

  const validatePassword = () => {
    return hasNumber && hasSpecial && hasMinLength && passwordsMatch
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
              <label htmlFor="password">Password*</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>{' '}
            <div className="input-field">
              <label htmlFor="confirmPassword">Confirm Password*</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="password-instructions">
              <p>
                {hasSpecial ? '✔' : ''} Include a special character (&, @, #, %)
              </p>
              <p>{hasMinLength ? '✔' : ''} At least 8 characters</p>
              <p>{hasNumber ? '✔' : ''} Include at least one number</p>
              <p>{passwordsMatch ? '✔' : ''} Passwords match</p>
            </div>
            <button className="signup-button" type="submit">
              Reset Password
            </button>
          </form>
        </section>
        <img src="/logos/oracle-logo.svg" alt="Oracle Logo" id="oracle-logo" />
      </main>
    </>
  )
}
export default ResetPassword
