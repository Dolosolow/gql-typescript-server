import { Connection } from "typeorm";
import { createTOConnection } from "../utils/createTOConnection";
import { messages } from "../lang";
import { TestClient } from "../utils/TestClient";
import { User } from "../entity/User";

let connection: Connection;

const email = "jochy07c@gmail.com";
const password = "test123!";

beforeAll(async () => {
  connection = await createTOConnection();
});

afterAll(async () => {
  await connection.close();
});

describe("Register User", () => {
  let testClient: TestClient;

  beforeEach(() => {
    testClient = new TestClient(process.env.TEST_GQL_HOST as string);
  });

  test("check for duplicate emails", async () => {
    const newRegister = await testClient.register(email, password);
    expect(newRegister).toEqual({ register: null });

    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);

    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);

    const duplicateEmail = await testClient.register(email, password);
    expect(duplicateEmail.register).toHaveLength(1);
    expect(duplicateEmail.register[0]).toEqual({
      path: "email",
      message: messages.register.duplicateEmail,
    });
  });

  test("check for bad email", async () => {
    const badEmail = await testClient.register("om", password);
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
    const badPassword = await testClient.register(email, "te");
    expect(badPassword.register).toEqual([
      {
        path: "password",
        message: messages.register.passwordNotLongEnough,
      },
    ]);
  });

  test("check for bad email+password", async () => {
    const badEmailPassword = await testClient.register("cm", "te");
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
