import express from "express";
import { ApolloServer } from "apollo-server-express";

import schema from "./graphql/schema";
import { createTOConnection } from "./utils/createTOConnection";

export const startServer = async () => {
  const server = new ApolloServer({ schema });

  await createTOConnection();
  await server.start();

  const app = express();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () => {
    console.log(`🚀  Server ready at http://localhost:4000${server.graphqlPath}`);
  });

  return { server, app };
};
