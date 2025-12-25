import { useNavigate } from 'react-router-dom'
import OracleLogo from '../components/OracleLogo'
const Landing = () => {
  const navigate = useNavigate()
  return (
    <>
      <main className="page-container">
        <OracleLogo />
        <section className="page-content">
          <h2>Oracle Health</h2>
          <h1>Possibilities</h1>
          <p>
            Reimagine the future of health with an automated, secure machine
            learning platform fostering the greatness of accuracy
          </p>

          <button onClick={() => navigate('/dashboard')}>Explore OHP</button>
        </section>
        <section className="landing-page-right-img">
          <img
            src="/images/landing-side-img.svg"
            alt="Landing page Lady Image"
            id="landing-lady-img"
          />
        </section>
        <img src="/logos/oracle-logo.svg" alt="Oracle Logo" id="oracle-logo" />
      </main>
    </>
  )
}

export default Landing
