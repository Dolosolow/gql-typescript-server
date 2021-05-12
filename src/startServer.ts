import { ApolloServer } from "apollo-server";

import { createTOConnection } from "./utils/createTOConnection";
import schema from "./graphql/schema";

export const startServer = async () => {
  const server = new ApolloServer({ schema });
  await createTOConnection();
  await server.listen(4000, () => {
    console.log(`🚀  Server ready at http://localhost:4000`);
  });
};
