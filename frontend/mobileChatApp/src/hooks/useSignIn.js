import { useMutation, useApolloClient } from "@apollo/client"
import { LOGIN } from '../graphql/mutations'
import { useAuthStorage } from "./useAuthStorage"

const useSignIn = () => {
  const authStorage = useAuthStorage()
  const apolloClient = useApolloClient()
  const [mutate, result] = useMutation(LOGIN)

  const signIn = async ({ username, password }) => {
    const payload = await mutate ({ variables: {username, password} })
    const { data } = payload

    // set the access token
    await authStorage.setAccessToken(data.login.value)
    apolloClient.resetStore()

    return payload
  }

  return [signIn, result]
}

export default useSignIn