import { useState } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import ProfileForm from '../components/ProfileForm'

const Profile = () => {
  return (
    <>
      <main className="main-container">
        <Header />
        <Sidebar />
        <section className="profile-right profile-section">
          <div className="profile-image-container">
            <img
              src="/images/profile-placeholder.svg"
              alt="Profile"
              className="profile-image"
            />
            <img
              src="/icons/image-edit-icon.svg"
              alt="Edit"
              className="image-edit-icon"
            />
          </div>
        </section>
        <section className="profile-left">
          <h1 className="page-title">Profile</h1>
          <form>
            <ProfileForm />
          </form>
        </section>
        <img src="/logos/oracle-logo.svg" alt="Oracle Logo" id="oracle-logo" />
      </main>
    </>
  )
}

export default Profile
