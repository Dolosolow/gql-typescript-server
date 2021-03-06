import { Redis } from "ioredis";

import { removeAllUserSessions } from "./removeAllUserSessions";
import { User } from "../entity/User";

export const forgotPwdLockAcct = async (userId: string, redis: Redis) => {
  await User.update({ id: userId }, { forgotPasswordLocked: true });
  await removeAllUserSessions(userId, redis);
};
