import { GET_CURRENT_USER } from "../graphql/queries"
import { useQuery } from "@apollo/client"


const useGetCurrentUser = (fetchFriends) => {
    const { data, loading, error } = useQuery(GET_CURRENT_USER, {
      fetchPolicy: 'cache-and-network',
      variables: {
        fetchFriends: fetchFriends
      },
    })

    let user

    if (loading) return null
    if (error) throw new Error(error.message)
    if (!loading) {
      if (data) user = data.me
    }

    return { user }
}

export default useGetCurrentUser