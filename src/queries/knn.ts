import { gql } from 'graphql-request';

// Cyberconnect_Follow
export const GET_RECOMMENDATIONS = gql`
  query ($address: String!) {
    JACCARD(address: $address, socialConnect: RSS3_Follow) {
      data {
        address
      }
    }
  }
`;
