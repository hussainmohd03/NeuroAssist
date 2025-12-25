import Client from '../services/api'

export const fetchStudies = async (setStudies, setLoading) => {
  try {
    const res = await Client.get('/api/study')
    setStudies(res.data.studies || [])
  } catch (err) {
    console.error('Failed to load studies', err)
  } finally {
    setLoading(false)
  }
}

export const formatDateTime = (isoString) => {
  const date = new Date(isoString)

  const day = date.getDate()
  const month = date.toLocaleString('en-US', { month: 'long' })
  const weekday = date.toLocaleString('en-US', { weekday: 'long' })
  const year = date.getFullYear()
  const time = date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  })

  const getOrdinal = (n) => {
    if (n > 3 && n < 21) return 'th'
    switch (n % 10) {
      case 1:
        return 'st'
      case 2:
        return 'nd'
      case 3:
        return 'rd'
      default:
        return 'th'
    }
  }

  return `${weekday}, ${day}${getOrdinal(day)} of ${month}, ${year} | ${time}`
}
