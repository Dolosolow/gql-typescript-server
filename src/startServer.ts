import { ApolloServer } from "apollo-server-express";
import express from "express";
import Redis from "ioredis";

import { createTOConnection } from "./utils/createTOConnection";
import schema from "./graphql/schema";

import { User } from "./entity/User";

export const startServer = async () => {
  const redis = new Redis();
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

  app.use("/confirm/:id", async (req, res) => {
    const { id } = req.params;
    const userId = await redis.get(id);

    if (userId) {
      await User.update({ id: userId }, { confirmed: true });
    } else {
      res.send("invalid");
    }

    res.send("ok email confirmed");
  });

  const listener = app.listen({ port: 4000 }, () => {
    console.log(`🚀  Server ready at http://localhost:4000${server.graphqlPath}`);
  });

  return { connection, listener };
};
