import Terms from './Terms'

const SignupStep2 = ({ formData, handleChange }) => {
  const hasNumber = /\d/.test(formData.password)
  const hasSpecial = /[^A-Za-z0-9]/.test(formData.password)
  const hasMinLength = formData.password.length >= 8
  const passwordsMatch =
    formData.password === formData.confirmPassword && formData.password !== ''

  return (
    <>
      <div className="input-field">
        <label htmlFor="password">Choose a strong password*</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div className="input-field">
        <label htmlFor="confirmPassword">Confirm password*</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>
      <div className="password-instructions">
        <p>{hasSpecial ? '✔' : ''} Include a special character (&, @, #, %)</p>
        <p>{hasMinLength ? '✔' : ''} At least 8 characters</p>
        <p>{hasNumber ? '✔' : ''} Include at least one number</p>
        <p>{passwordsMatch ? '✔' : ''} Passwords match</p>
      </div>
      <Terms formData={formData} handleChange={handleChange} />
    </>
  )
}
export default SignupStep2
