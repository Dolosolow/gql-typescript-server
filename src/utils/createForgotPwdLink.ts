import { v4 as uuidv4 } from "uuid";
import { Redis } from "ioredis";

import { forgotPwdPrefix } from "../constants";

export const createForgotPasswordLink = async (url: string, userId: string, redis: Redis) => {
  const id = uuidv4();
  redis.set(`${forgotPwdPrefix}${id}`, userId, "ex", 60 * 20);
  return `${url}/forgot-password/${id}`;
};
