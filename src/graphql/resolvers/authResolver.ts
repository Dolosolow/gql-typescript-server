import bcrypt from "bcryptjs";

import { Resolvers } from "src/types/schema";
import { User } from "../../entity/User";

export const authResolver: Resolvers = {
  Mutation: {
    register: async (_, { email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = User.create({ email, password: hashedPassword });
      await user.save();

      return true;
    },
  },
};
