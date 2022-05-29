import { gql } from 'graphql-request';

export const GET_IDENTITY = gql`
  query ($address: String!) {
    identity(address: $address) {
      domain
      followerCount
      followingCount
    }
  }
`;
