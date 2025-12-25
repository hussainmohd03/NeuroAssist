import { createContext, useContext, useEffect, useState } from 'react'
import Client from '../../services/api'
import { useAuth } from './AuthContext'

const NotificationContext = createContext(null)

export const NotificationProvider = ({ children }) => {
  const { user, setUnreadCount, setNotifications, unreadCount, notifications } =
    useAuth()

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!user) return

    const loadNotification = async () => {
      try {
        const res = await Client.get('/api/user/notifications')
        setNotifications(res.data.notifications)
        setUnreadCount(res.data.notifications.length)
      } catch (error) {
        console.error('error loading notifications', error)
      }
    }

    loadNotification()
  }, [user])

  const openPanel = () => setIsOpen(true)

  const closePanel = async () => {
    if (unreadCount === 0) return setIsOpen(false)
    try {
      await Client.post('/api/user/notifications')
    } catch (err) {
      console.error('Failed to mark notifications as read', err)
    } finally {
      setIsOpen(false)
      setUnreadCount(0)
    }
  }

  const clearNotifications = async () => {
    if (notifications.length === 0) return
    try {
      await Client.delete('/api/user/notifications')
    } catch (err) {
      console.error('Failed to delete notifications ', err)
    } finally {
      setNotifications([])
    }
  }
  return (
    <NotificationContext.Provider
      value={{
        isOpen,
        openPanel,
        closePanel,
        clearNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
