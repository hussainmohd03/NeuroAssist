export function timeAgo(createdAt) {
  const now = new Date()
  const past = new Date(createdAt)
  const diff = Math.floor((now - past) / 1000) 

  if (diff < 5) return 'Just now'
  if (diff < 60) return `${diff} seconds ago`

  const minutes = Math.floor(diff / 60)
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`

  const days = Math.floor(hours / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}
