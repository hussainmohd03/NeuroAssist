import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Client from '../../services/api'

const VerifyEmail = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token')

      try {
        if (token) {
          await Client.post('/api/auth/verify-email', { token })
        }
      } catch (error) {
        throw error
      } finally {
        navigate('/signin', { replace: true })
      }
    }

    verifyEmail()
  }, [])

  return null
}

export default VerifyEmail
