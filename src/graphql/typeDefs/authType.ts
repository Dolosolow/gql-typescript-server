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
    changeForgottenPassword(newPassword: String!, key: String!): [Error!]
    logout: Boolean
    login(email: String!, password: String!): [Error!]
    register(email: String!, password: String!): [Error!]
    sendForgotPasswordEmail(email: String!): Boolean
  }
`;
