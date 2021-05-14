import { ApolloServer } from "apollo-server-express";
import express from "express";

import { createTOConnection } from "./utils/createTOConnection";
import schema from "./graphql/schema";
import { redis } from "./utils/redisConfig";
import restRoutes from "./routes/rest";

export const startServer = async () => {
  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({
      redis,
      url: req.protocol + "://" + req.get("host"),
    }),
  });

  const connection = await createTOConnection();
  await server.start();

  const app = express();
  server.applyMiddleware({ app });

  app.use("/", restRoutes);

  app.get("/", (_, res) => {
    res.send("hello it works");
  });

  const listener = app.listen({ port: 4000 }, () => {
    console.log(`🚀  Server ready at http://localhost:4000${server.graphqlPath}`);
  });

  return { connection, listener };
};
