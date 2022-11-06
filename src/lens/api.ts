import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import {LENS_API} from "./utils/apollo-client";

export const client = new ApolloClient({
    uri: LENS_API,
    cache: new InMemoryCache()
})

export const challenge = gql`
  query Challenge($address: EthereumAddress!) {
    challenge(request: { address: $address }) {
      text
    }
  }
`

export const authenticate = gql`
  mutation Authenticate(
    $address: EthereumAddress!
    $signature: Signature!
  ) {
    authenticate(request: {
      address: $address,
      signature: $signature
    }) {
      accessToken
      refreshToken
    }
  }
`