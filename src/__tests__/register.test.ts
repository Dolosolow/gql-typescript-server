import { Connection } from "typeorm";
import { createTOConnection } from "../utils/createTOConnection";
import { messages } from "../lang";
import { TestClient } from "../utils/TestClient";
import { User } from "../entity/User";

const email = "jochy07c@gmail.com";
const password = "test123!";

let TOConnection: Connection;

beforeAll(async () => {
  TOConnection = await createTOConnection();
});

afterAll(async () => {
  await TOConnection.close();
});

describe("Register User", () => {
  test("check for duplicate emails", async () => {
    const testClient = new TestClient(process.env.TEST_GQL_HOST as string);

    const newRegister = await testClient.register(email, password);
    expect(newRegister.data.data).toEqual({ register: null });

    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);

    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);

    const duplicateEmail = await testClient.register(email, password);
    expect(duplicateEmail.data.data.register).toHaveLength(1);
    expect(duplicateEmail.data.data.register[0]).toEqual({
      path: "email",
      message: messages.register.duplicateEmail,
    });
  });

  test("check for bad email", async () => {
    const testClient = new TestClient(process.env.TEST_GQL_HOST as string);

    const badEmail = await testClient.register("om", password);
    expect(badEmail.data.data.register).toEqual([
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
    const testClient = new TestClient(process.env.TEST_GQL_HOST as string);

    const badPassword = await testClient.register(email, "te");
    expect(badPassword.data.data.register).toEqual([
      {
        path: "password",
        message: messages.register.passwordNotLongEnough,
      },
    ]);
  });

  test("check for bad email+password", async () => {
    const testClient = new TestClient(process.env.TEST_GQL_HOST as string);

    const badEmailPassword = await testClient.register("cm", "te");
    expect(badEmailPassword.data.data.register).toEqual([
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
