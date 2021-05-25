import "reflect-metadata";
import "dotenv/config";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import session from "express-session";
import connectRedis from "connect-redis";

import { createTOConnection } from "./utils/createTOConnection";
import { schemaWithMiddleware } from "./graphql/schema";
import { redisPrefix } from "./constants";
import { redis } from "./utils/redisConfig";
import restRoutes from "./routes/rest";

declare module "express-session" {
  interface Session {
    userId: string;
  }
}

const RedisStore = connectRedis(session);

export const startServer = async () => {
  const server = new ApolloServer({
    schema: schemaWithMiddleware,
    context: ({ req }) => ({
      req: req,
      redis,
      url: req.protocol + "://" + req.get("host"),
    }),
  });

  const connection = await createTOConnection();
  await server.start();

  const app = express();

  const cors = {
    credentials: true,
    origin: process.env.NODE_ENV === "test" ? "*" : process.env.CLIENT_HOST,
  };

  app.set("trust proxy", 1);
  app.use(
    session({
      store: new RedisStore({ client: redis, prefix: redisPrefix }),
      name: "sid",
      secret: process.env.SESSION_SECRET as string,
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: "none",
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 6,
      },
    })
  );

  app.use(function (_, res, next) {
    res.header("Access-Control-Allow-Origin", process.env.CLIENT_HOST);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.use("/", restRoutes);

  server.applyMiddleware({ app, cors });

  const listener = app.listen({ port: process.env.PORT || 4000 }, () => {
    console.log(
      `🚀  Server ready at ${
        process.env.NODE_ENV === "production"
          ? `https://basic-auth-graphql-server.herokuapp.com/graphql`
          : `http://localhost:${process.env.PORT || 4000}${server.graphqlPath}`
      }`
    );
  });

  return { connection, listener };
};
