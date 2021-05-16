import { applyMiddleware } from "graphql-middleware";
import { makeExecutableSchema } from "graphql-tools";

import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import middlewares from "../middlewares";

const schema = makeExecutableSchema({ typeDefs, resolvers });
const schemaWithMiddleware = applyMiddleware(schema, ...middlewares);

export { schema, schemaWithMiddleware };
