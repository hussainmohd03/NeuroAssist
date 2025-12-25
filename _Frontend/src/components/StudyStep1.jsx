const StudyStep1 = ({ formData, handleChange, user }) => {
  const today = new Date()

  return (
    <>
      <h3 className="create-study-subtitle">Fill in the following fields</h3>
      <div className="input-field profile-edit create-study-input">
        <label htmlFor="NHRA-License">NHRA License No*</label>
        <div className="edit-field readonly-field">
          <input
            type="text"
            id="NHRA-License"
            name="nhraLicense"
            value={`NHRA-${user?.nhra}`}
            readOnly
          />
        </div>
      </div>
      <hr className="profile-edit create-study-hr" />
      <div className="input-field profile-edit create-study-input">
        <label htmlFor="Patient-ID">Patient ID*</label>
        <div className="edit-field">
          <input
            type="text"
            id="Patient-ID"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="input-field profile-edit create-study-input">
        <label htmlFor="Date-Time">Date & Time</label>
        <div className="edit-field readonly-field">
          <input
            type="text"
            id="Date-Time"
            name="dateTime"
            value={today.toDateString()}
            readOnly
          />
        </div>
      </div>
    </>
  )
}
export default StudyStep1
