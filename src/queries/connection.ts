import { gql } from 'graphql-request';

export const GET_CONNECTIONS = gql`
  fragment infoFields on Connect {
    address
    domain
    avatar
  }

  query ($address: String!, $first: Int) {
    identity(address: $address, network: ETH) {
      followings(first: $first) {
        list {
          ...infoFields
        }
      }
      followers(first: $first) {
        list {
          ...infoFields
        }
      }
      friends(first: $first) {
        list {
          ...infoFields
        }
      }
    }
  }
`;
