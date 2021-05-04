import "reflect-metadata";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server";

import schema from "./graphql/schema";

const server = new ApolloServer({ schema });

createConnection().then(() => {
  server.listen().then(({ url }: { url: string }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
});
