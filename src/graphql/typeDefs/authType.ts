import { gql } from "apollo-server-express";

export const authType = gql`
  type Mutation {
    login(email: String!, password: String!): [Error!]
    register(email: String!, password: String!): [Error!]
  }
`;
