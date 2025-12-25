const BASE_URL = import.meta.env.VITE_BACKEND_URL
const NHRA_API = import.meta.env.VITE_NHRA_API
const ALLOWED_SPECIALTIES = [
  'Radiology',
  'Neuroradiology',
  'Oncology',
  'Neurosurgery',
  'Neurology',
  'Medical Imaging'
]
export { BASE_URL, ALLOWED_SPECIALTIES, NHRA_API }
