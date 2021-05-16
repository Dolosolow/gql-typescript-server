import { Redis } from "ioredis";
import { ResolverFn } from "../types/schema";

const addDataToContext = async (
  resolver: ResolverFn<any, any, { url: string; redis: Redis; req: Express.Request }, any>,
  parent: any,
  args: any,
  context: { url: string; redis: Redis; req: Express.Request },
  info: any
) => {
  return await resolver(parent, args, context, info);
};

export const AuthMiddleware = {
  Query: {
    user: addDataToContext,
  },
};
