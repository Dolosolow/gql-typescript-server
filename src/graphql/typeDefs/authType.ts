import { gql } from "apollo-server-express";

export const authType = gql`
  type Mutation {
    register(email: String!, password: String!): Boolean
  }
`;
