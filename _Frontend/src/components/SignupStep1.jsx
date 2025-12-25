const SignupStep1 = ({ formData, handleChange }) => {
  return (
    <>
      <p id="nhra-hint">
        Your information will be auto-filled once your license is verified.
      </p>
      <div className="input-field">
        <label htmlFor="NHRA">NHRA License*</label>
        <input
          type="text"
          name="nhra"
          minLength={8}
          maxLength={8}
          value={formData.nhra}
          onChange={handleChange}
          required
        />
      </div>
      <div className="input-field">
        <label htmlFor="fullName">Full Name*</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          readOnly
        />
      </div>
      <div className="input-field">
        <label htmlFor="email">Email*</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          readOnly
        />
      </div>
      <div className="input-field">
        <label htmlFor="institution">Institution*</label>
        <input
          type="text"
          name="institution"
          value={formData.institution}
          onChange={handleChange}
          readOnly
        />
      </div>
    </>
  )
}
export default SignupStep1
