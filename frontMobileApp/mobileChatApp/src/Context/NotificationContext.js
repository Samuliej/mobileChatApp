import React, { createContext, useState } from 'react'

/**
 * Provides a React context for managing notifications.
 *
 * This context allows components within the provider to access and update the current notification message.
 *
 *
 * @module NotificationContext
 */
export const NotificationContext = createContext()

/**
 * `NotificationProvider` is a component that uses the `NotificationContext.Provider` to pass down `notification` and `setNotification` to its children.
 *
 * @param {object} props - The props object.
 * @param {React.ReactNode} props.children - The child components that will have access to the context.
 * @returns {React.ReactElement} The Provider component with `notification` and `setNotification` passed down.
 */
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState('')

  return (
    <NotificationContext.Provider value={{ notification, setNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}