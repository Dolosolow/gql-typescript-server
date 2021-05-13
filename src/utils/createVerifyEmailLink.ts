import { Redis } from "ioredis";
import { v4 as uuidv4 } from "uuid";

export const createVerifyEmailLink = async (url: string, userId: string, redis: Redis) => {
  const id = uuidv4();
  await redis.set(id, userId, "ex", 60 * 60 * 23);
  return `${url}/confirm/${id}`;
};
