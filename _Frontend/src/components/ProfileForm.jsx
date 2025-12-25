import { useAuth } from '../context/AuthContext'

const ProfileForm = () => {
  const { user } = useAuth()

  return (
    <>
      <div className="input-field profile-edit">
        <label htmlFor="NHRA-License">NHRA License</label>
        <div className="edit-field readonly-field">
          <input
            type="text"
            id="NHRA-License"
            name="nhraLicense"
            readOnly
            value={`NHRA-${user?.nhra}`}
          />
        </div>
      </div>
      <hr className="profile-edit " />
      <div className="input-field profile-edit">
        <label htmlFor="NHRA-Holder-Name">NHRA Holder Name</label>
        <div className="edit-field readonly-field">
          <input
            type="text"
            id="NHRA-Holder-Name"
            name="nhraHolderName"
            value={user?.fullName}
          />
        </div>
      </div>
      <div className="input-field profile-edit">
        <label htmlFor="NHRA-Holder-Email">NHRA Holder Email</label>
        <div className="edit-field readonly-field">
          <input
            type="email"
            id="NHRA-Holder-Email"
            name="nhraHolderEmail"
            value={user?.email}
          />
        </div>
      </div>
    </>
  )
}
export default ProfileForm
