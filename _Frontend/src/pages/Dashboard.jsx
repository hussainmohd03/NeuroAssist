import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { useEffect, useState } from 'react'
import { fetchStudies } from '../../utils'
import { useAuth } from '../context/AuthContext'
import TableRow from '../components/TableRow'

const Dashboard = () => {
  const { studies, setStudies } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudies(setStudies, setLoading)
  }, [])

  return (
    <>
      <main className="main-container">
        <Header />
        <Sidebar />
        <section className="settings-content">
          <h1 className="page-title">All studies</h1>

          <section className="table-container">
            <h3 className="table-header file-name">Filename</h3>
            <h3 className="table-header created-on">Created on</h3>
            <h3 className="table-header status">Status</h3>

            <div className="table-content">
              {loading && <div className="table-empty">Loading studies…</div>}

              {!loading && studies.length === 0 && (
                <div className="table-empty">No studies found.</div>
              )}
              {studies.map(
                (s) => (<TableRow key={s.id} study={s} />)
              )}
            </div>
          </section>
        </section>
        <img src="/logos/oracle-logo.svg" alt="Oracle Logo" id="oracle-logo" />
      </main>
    </>
  )
}

export default Dashboard
