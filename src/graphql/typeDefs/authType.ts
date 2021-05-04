import { gql } from "apollo-server";

export const authType = gql`
  type Mutation {
    register(email: String!, password: String!): Boolean
  }
`;
