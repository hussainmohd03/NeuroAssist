import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import StartStudy from '../components/StartStudy'
import StudyStep1 from '../components/StudyStep1'
import StudyStep2 from '../components/StudyStep2'
import { useStudy } from '../context/StudyContext'
import { useAuth } from '../context/AuthContext'
const CreateStudy = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { createStudy } = useStudy()
  const [starting, setStarting] = useState(true)
  const [next, setNext] = useState(false)

  const [formData, setFormData] = useState({
    nhraLicense: '',
    patientId: '',
    dateTime: ''
  })
  
  const [scans, setScans] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!next) {
      setNext(true)
      return
    }
    const studyData = new FormData()
    studyData.append('patientId', formData.patientId)
    scans.forEach((scan) => {
      studyData.append('scans', scan)
    })

    // send data to back end
    await createStudy(studyData)
    setNext(false)
    navigate('/dashboard')
  }

  return (
    <>
      <main className="main-container">
        <Header />
        <Sidebar />
        <section className="create-study-section">
          {(starting && <StartStudy setStarting={setStarting} />) || (
            <>
              <div className="study-form">
                <h1 className="create-study-title">Create a new study</h1>
                <div className="upload-form-1">
                  <form onSubmit={handleSubmit}>
                    {(!next && (
                      <StudyStep1
                        formData={formData}
                        handleChange={handleChange}
                        user={user}
                      />
                    )) || <StudyStep2 scans={scans} setScans={setScans} />}

                    <button
                      className="save-button create-study-button"
                      type="submit"
                    >
                      {!next ? 'Continue' : 'submit'}
                    </button>
                  </form>
                </div>
                <div className="step-progress">
                  <div className={`step ${!next ? 'active' : ''}`}></div>
                  <div className={`step ${next ? 'active' : ''}`}></div>
                </div>
              </div>
            </>
          )}
        </section>
        <img src="/logos/oracle-logo.svg" alt="Oracle Logo" id="oracle-logo" />
      </main>
    </>
  )
}

export default CreateStudy
