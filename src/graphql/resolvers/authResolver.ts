import bcrypt from "bcryptjs";

import { createVerifyEmailLink } from "../../utils/createVerifyEmailLink";
import { formatYupError } from "../../utils/formatYupError";
import { messages } from "../../lang";
import { passwordSchema, registrationSchema } from "../../validations";
import { Resolvers } from "../../types/schema";
import { User } from "../../entity/User";
import { sendConfirmationEmail, sendForgotPwdEmail } from "../../utils/sendEmail";
import { removeAllUserSessions } from "../../utils/removeAllUserSessions";
import { forgotPwdLockAcct } from "../../utils/forgotPwdLockAcct";
import { createForgotPasswordLink } from "../../utils/createForgotPwdLink";

import { forgotPwdPrefix, redisPrefix, userSidsPrefix } from "../../constants";

export const authResolver: Resolvers = {
  Query: {
    user: async (_, __, { req: { session } }) => {
      const user = await User.findOne({ where: { id: session.userId } });
      return user!;
    },
  },
  Mutation: {
    changeForgottenPassword: async (_, { key, newPassword }, { redis }) => {
      const redisKey = `${forgotPwdPrefix}${key}`;
      const userId = await redis.get(redisKey);

      if (!userId) {
        return [{ path: "key", message: messages.forgotPassword.expiredKey }];
      }

      try {
        await passwordSchema.validate({ newPassword }, { abortEarly: false });
      } catch (err) {
        return formatYupError(err);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updatePromise = await User.update(
        { id: userId },
        { forgotPasswordLocked: false, password: hashedPassword }
      );
      const deleteKeyPromise = await redis.del(redisKey);

      await Promise.all([updatePromise, deleteKeyPromise]);

      return null;
    },
    sendForgotPasswordEmail: async (_, { email }, { redis }) => {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return false;
      }

      /**
       * @method forgotPwdLockAcct
       * @todo add client-side url
       */
      await forgotPwdLockAcct(user.id!, redis);

      const emailUrl = await createForgotPasswordLink("", user.id!, redis);

      await sendForgotPwdEmail(user.email, emailUrl);

      return true;
    },
    logout: async (_, __, { req: { session }, redis }) => {
      const { userId } = session;
      if (userId) {
        await removeAllUserSessions(userId, redis);
        return true;
      }
      return false;
    },
    login: async (_, { email, password }, { req, redis }) => {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return [{ path: "email", message: messages.login.invalidCridentials }];
      }

      if (!user.confirmed) {
        return [{ path: "email", message: messages.login.confirmBtn }];
      }

      if (user.forgotPasswordLocked) {
        return [{ path: "email", message: messages.login.AcctLock }];
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return [{ path: "email", message: messages.login.invalidCridentials }];
      }

      req.session.userId = user.id;
      await redis.lpush(`${userSidsPrefix}${user.id}`, `${redisPrefix}${req.sessionID}`);

      return null;
    },
    register: async (_, args, { redis, url }) => {
      try {
        await registrationSchema.validate(args, { abortEarly: false });
      } catch (err) {
        return formatYupError(err);
      }

      const { email, password } = args;
      const userAlreadyExists = await User.findOne({ where: { email }, select: ["id"] });

      if (userAlreadyExists) {
        return [{ path: "email", message: messages.register.duplicateEmail }];
      }

      const user = User.create({ email, password });
      await user.save();

      if (process.env.NODE_ENV !== "test") {
        await sendConfirmationEmail(user.email, await createVerifyEmailLink(url, user.id, redis));
      }

      return null;
    },
  },
};
