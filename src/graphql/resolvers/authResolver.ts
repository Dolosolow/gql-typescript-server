import bcrypt from "bcryptjs";

import { createVerifyEmailLink } from "../../utils/createVerifyEmailLink";
import { formatYupError } from "../../utils/formatYupError";
import { messages } from "../../lang";
import { registrationSchema } from "../../validations";
import { Resolvers } from "../../types/schema";
import { User } from "../../entity/User";

export const authResolver: Resolvers = {
  Mutation: {
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

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = User.create({ email, password: hashedPassword });

      await user.save();

      await createVerifyEmailLink(url, user.id, redis);

      return null;
    },
  },
};
