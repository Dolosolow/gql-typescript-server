import bcrypt from "bcryptjs";

import { createVerifyEmailLink } from "../../utils/createVerifyEmailLink";
import { formatYupError } from "../../utils/formatYupError";
import { messages } from "../../lang";
import { registrationSchema } from "../../validations";
import { Resolvers } from "../../types/schema";
import { User } from "../../entity/User";
import { redisPrefix, userSids } from "../../constants";
import { sendConfirmationEmail } from "../../utils/sendEmail";

export const authResolver: Resolvers = {
  Query: {
    user: async (_, __, { req: { session } }) => {
      const user = await User.findOne({ where: { id: session.userId } });
      return user!;
    },
  },
  Mutation: {
    logout: async (_, __, { req: { session }, redis }) => {
      const { userId } = session;

      if (userId) {
        const sessionIds = await redis.lrange(`${userSids}${userId}`, 0, -1);

        for (let i = 0; i < sessionIds.length; i++) {
          await redis.del(`${sessionIds[i]}`);
        }

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

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return [{ path: "email", message: messages.login.invalidCridentials }];
      }

      req.session.userId = user.id;
      await redis.lpush(`${userSids}${user.id}`, `${redisPrefix}${req.sessionID}`);

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
