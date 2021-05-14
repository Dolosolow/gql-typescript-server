import { ApolloServer } from "apollo-server-express";
import express from "express";
import session from "express-session";
import connectRedis from "connect-redis";

import { createTOConnection } from "./utils/createTOConnection";
import schema from "./graphql/schema";
import { redis } from "./utils/redisConfig";
import restRoutes from "./routes/rest";

const RedisStore = connectRedis(session);

export const startServer = async () => {
  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({
      req,
      redis,
      url: req.protocol + "://" + req.get("host"),
    }),
  });

  const connection = await createTOConnection();
  await server.start();

  const app = express();
  const cors = {
    Credential: true,
    origin: "http://localhost:3000",
  };
  server.applyMiddleware({ app, cors });

  app.use(
    session({
      store: new RedisStore({}),
      name: "qid",
      secret: process.env.SESSION_SECRET as string,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    })
  );

  app.use("/", restRoutes);

  const listener = app.listen({ port: 4000 }, () => {
    console.log(`🚀  Server ready at http://localhost:4000${server.graphqlPath}`);
  });

  return { connection, listener };
};
