import { gql } from "apollo-server-express";

export const rootType = gql`
  type Error {
    path: String!
    message: String!
  }

  type Query {
    hello(name: String): String!
  }
`;
