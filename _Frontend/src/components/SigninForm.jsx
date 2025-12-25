const SigninForm = ({ formData, handleChange }) => {
  return (
    <>
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
      <div className="input-field">
        <label htmlFor="password">Password*</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

    </>
  )
}
export default SigninForm
