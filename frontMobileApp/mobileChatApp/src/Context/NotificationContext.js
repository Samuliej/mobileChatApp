import React, { createContext, useState } from 'react'

/*

  Notification context for displaying notifications

*/

export const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState('')

  return (
    <NotificationContext.Provider value={{ notification, setNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}