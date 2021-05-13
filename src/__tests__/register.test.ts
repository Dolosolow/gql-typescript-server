import { request } from "graphql-request";

import { createTOConnection } from "../utils/createTOConnection";
import { User } from "../entity/User";
import { messages } from "../lang";
import { Connection } from "typeorm";

const email = "jochy07c@gmail.com";
const password = "test123!";

const mutation = (email: string, password: string) => `
  mutation {
    register(email: "${email}", password: "${password}") {
      path
      message
    }
  }
`;

let TOConnection: Connection;

beforeAll(async () => {
  TOConnection = await createTOConnection();
});

afterAll(async () => {
  await TOConnection.close();
});

describe("Register User", () => {
  test("check for duplicate emails", async () => {
    const newRegister = await request(process.env.TEST_HOST as string, mutation(email, password));
    expect(newRegister).toEqual({ register: null });

    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);

    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);

    const duplicateEmail = await request(
      process.env.TEST_HOST as string,
      mutation(email, password)
    );
    expect(duplicateEmail.register).toHaveLength(1);
    expect(duplicateEmail.register[0]).toEqual({
      path: "email",
      message: messages.register.duplicateEmail,
    });
  });

  test("check for bad email", async () => {
    const badEmail = await request(process.env.TEST_HOST as string, mutation("om", password));
    expect(badEmail.register).toEqual([
      {
        path: "email",
        message: messages.register.emailNotLongEnough,
      },
      {
        path: "email",
        message: messages.register.invalidEmail,
      },
    ]);
  });

  test("check for bad password", async () => {
    const badPassword = await request(process.env.TEST_HOST as string, mutation(email, "te"));
    expect(badPassword.register).toEqual([
      {
        path: "password",
        message: messages.register.passwordNotLongEnough,
      },
    ]);
  });

  test("check for bad email+password", async () => {
    const badEmailPassword = await request(process.env.TEST_HOST as string, mutation("cm", "te"));
    expect(badEmailPassword.register).toEqual([
      {
        path: "email",
        message: messages.register.emailNotLongEnough,
      },
      {
        path: "email",
        message: messages.register.invalidEmail,
      },
      {
        path: "password",
        message: messages.register.passwordNotLongEnough,
      },
    ]);
  });
});
