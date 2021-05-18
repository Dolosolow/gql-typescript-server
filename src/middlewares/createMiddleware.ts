import { Redis } from "ioredis";
import { ResolverFn } from "../types/schema";

const createMiddleware = async (
  resolver: ResolverFn<any, any, { url: string; redis: Redis; req: Express.Request }, any>,
  parent: any,
  args: any,
  context: { url: string; redis: Redis; req: Express.Request },
  info: any
) => {
  const result = await resolver(parent, args, context, info);
  return result;
};

export const AuthMiddleware = {
  Query: {
    user: createMiddleware,
  },
};
