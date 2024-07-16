import { createContext, useState } from 'react'

/**
 * Provides a React context for managing friend requests.
 *
 * This context allows components within the provider to access and manipulate the list of friend requests.
 *
 */

/**
 * `FriendRequestContext` is the context created by React's `createContext` method.
 * It should be used with React's `useContext` hook to access the `friendRequests` and `setFriendRequests` in a component.
 *
 * @type {React.Context<{friendRequests: array, setFriendRequests: function}>}
 */
export const FriendRequestContext = createContext()


/**
 * `FriendRequestProvider` is a component that uses the `FriendRequestContext.Provider` to pass down `friendRequests` and `setFriendRequests` to its children.
 *
 * @param {object} props - The props object.
 * @param {React.ReactNode} props.children - The child components that will have access to the context.
 * @returns {React.ReactElement} The Provider component with `friendRequests` and `setFriendRequests` passed down.
 */
export const FriendRequestProvider = ({ children }) => {
  const [friendRequests, setFriendRequests] = useState([])

  return (
    <FriendRequestContext.Provider value={{ friendRequests, setFriendRequests }}>
      {children}
    </FriendRequestContext.Provider>
  )
}