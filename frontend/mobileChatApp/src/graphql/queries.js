import { gql } from '@apollo/client'

export const GET_CURRENT_USER = gql`
  query getCurrentUser($fetchFriends: Boolean!) {
    me {
      id
      name
      friends @include(if: $fetchFriends)
    }
  }
`