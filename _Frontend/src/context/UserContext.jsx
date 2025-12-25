import { createContext, useContext, useState, useEffect } from 'react'
import Client from '../../services/api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

const UserContext = createContext(null)

export const UserProvider = ({ children }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const clearData = async () => {
    try {
      await Client.delete('/api/user/data')
    } catch (error) {
      console.error({ msg: 'error clearing data', error })
    }
  }
  const deleteAccount = async () => {
    try {
      await Client.delete('/api/user/')
    } catch (error) {
      console.error({ msg: 'error deleting user', error })
    } finally {
      logout()
    }
  }
  const getUserData = async () => {
    try {
      const res = await Client.get('/api/user/data')
      return res.data
    } catch (error) {
      console.error({ msg: 'error getting user data', error })
    }
  }

  const getUserNotifications = async () => {
    try {
      const res = await Client.get('/api/user/notifications')
      return res.data
    } catch (error) {
      console.error({ msg: 'error getting user notifications', error })
    }
  }
  return (
    <UserContext.Provider
      value={{
        clearData,
        deleteAccount,
        getUserData,
        getUserNotifications
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
