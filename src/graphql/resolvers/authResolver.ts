import bcrypt from "bcryptjs";

import { Resolvers } from "src/types/schema";
import { User } from "../../entity/User";

export const authResolver: Resolvers = {
  Mutation: {
    register: async (_, { email, password }) => {
      const userAlreadyExists = await User.findOne({ where: { email }, select: ["id"] });

      if (userAlreadyExists) {
        return [{ path: "email", message: "An account with this email already exists." }];
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = User.create({ email, password: hashedPassword });
      await user.save();

      return null;
    },
  },
};
