import axios from 'axios'
import { NHRA_API } from '../globals'

export async function fetchDoctorByLicense(license) {
  try {
    const res = await axios.get(
      `${NHRA_API}/doctors?nhra_license_no=${license}`
    )
    return res.data[0]
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null
    }
    console.error('error fetching user info from nhra', error)
  }
}

export async function fetchDoctorByEmail(email) {
  try {
    const res = await axios.get(`${NHRA_API}/doctors?email=${email}`)
    return res.data[0]
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null
    }
    console.error('error fetching user info from nhra', error)
  }
}
