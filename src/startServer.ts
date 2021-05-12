import { ApolloServer } from "apollo-server-express";
import express from "express";

import { createTOConnection } from "./utils/createTOConnection";
import schema from "./graphql/schema";

export const startServer = async () => {
  const server = new ApolloServer({ schema });

  const connection = await createTOConnection();
  await server.start();

  const app = express();
  server.applyMiddleware({ app });

  const listener = app.listen({ port: 4000 }, () => {
    console.log(`🚀  Server ready at http://localhost:4000${server.graphqlPath}`);
  });

  return { connection, listener };
};
