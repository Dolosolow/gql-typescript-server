import { mergeResolvers } from "graphql-tools";

import { rootResolver } from "./rootResolver";
import { authResolver } from "./authResolver";

export default mergeResolvers([authResolver, rootResolver]);
