import { Resolvers } from "src/types/schema";

export const rootResolver: Resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || "Universe"}`,
  },
};
