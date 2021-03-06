import { Redis } from "ioredis";
import { userSidsPrefix } from "../constants";

export const removeAllUserSessions = async (userId: string, redis: Redis) => {
  const sessionIds = await redis.lrange(`${userSidsPrefix}${userId}`, 0, -1);
  const promises = [];

  for (let i = 0; i < sessionIds.length; i++) {
    promises.push(redis.del(`${sessionIds[i]}`));
  }
};
