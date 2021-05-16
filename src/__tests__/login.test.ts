import { Connection } from "typeorm";

import { createTOConnection } from "../utils/createTOConnection";
import { messages } from "../lang";
import { TestClient } from "../utils/TestClient";
import { User } from "../entity/User";

const email = "jochy07c@gmail.com";
const password = "test123!";

const loginError = async (
  testClient: TestClient,
  email: string,
  password: string,
  errorMsg: string
) => {
  const loginUser = await testClient.login(email, password);

  expect(loginUser.data.data).toEqual({
    login: [{ path: "email", message: errorMsg }],
  });
};

let connection: Connection;

beforeAll(async () => {
  connection = await createTOConnection();
});

afterAll(async () => {
  await connection.close();
});

describe("Login User", () => {
  test("should return invalid credentials, no user", async () => {
    const testClient = new TestClient(process.env.TEST_GQL_HOST as string);
    await loginError(testClient, email, password, messages.login.invalidCridentials);
  });

  test("should fail login user, email not confirmed + update user + login successful", async () => {
    const testClient = new TestClient(process.env.TEST_GQL_HOST as string);

    await testClient.register(email, password);
    await loginError(testClient, email, password, messages.login.confirmBtn);

    await User.update({ email }, { confirmed: true });
    await loginError(testClient, email, "asdasdasd", messages.login.invalidCridentials);

    const loginSuccess = await testClient.login(email, password);
    expect(loginSuccess.data.data).toEqual({ login: null });
  });
});
