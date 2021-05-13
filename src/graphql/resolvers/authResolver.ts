import bcrypt from "bcryptjs";

import { formatYupError } from "../../utils/formatYupError";
import { registrationSchema } from "../../validations";
import { Resolvers } from "src/types/schema";
import { User } from "../../entity/User";

import { messages } from "../../lang";

export const authResolver: Resolvers = {
  Mutation: {
    register: async (_, args) => {
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
      return null;
    },
  },
};
