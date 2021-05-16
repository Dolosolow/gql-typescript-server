import { gql } from "apollo-server-express";

export const authType = gql`
  type User {
    id: ID!
    email: String!
  }

  type Query {
    user: User
  }

  type Mutation {
    logout: Boolean
    login(email: String!, password: String!): [Error!]
    register(email: String!, password: String!): [Error!]
  }
`;
