import { gql } from "apollo-server-express";

export const rootType = gql`
  type Query {
    hello(name: String): String!
  }
`;
