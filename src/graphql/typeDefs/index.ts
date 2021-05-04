import { mergeTypeDefs } from "graphql-tools";

import { rootType } from "./rootType";
import { authType } from "./authType";

export default mergeTypeDefs([authType, rootType]);
