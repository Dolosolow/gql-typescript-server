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
    login(email: String!, password: String!): [Error!]
    register(email: String!, password: String!): [Error!]
  }
`;
