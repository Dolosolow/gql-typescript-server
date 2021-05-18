import { Connection } from "typeorm";

import { createTOConnection } from "../utils/createTOConnection";
import { messages } from "../lang";
import { TestClient } from "../utils/TestClient";
import { User } from "../entity/User";

let connection: Connection;

const email = "jochy07c@gmail.com";
const password = "test123!";

const loginError = async (
  testClient: TestClient,
  email: string,
  password: string,
  errorMsg: string
) => {
  const loginUser = await testClient.login(email, password);

  expect(loginUser).toEqual({
    login: [{ path: "email", message: errorMsg }],
  });
};

beforeAll(async () => {
  connection = await createTOConnection();
});

afterAll(async () => {
  await connection.close();
});

describe("Login User", () => {
  let testClient: TestClient;

  beforeEach(() => {
    testClient = new TestClient(process.env.TEST_GQL_HOST as string);
  });

  test("should return invalid credentials, no user", async () => {
    await loginError(testClient, email, password, messages.login.invalidCridentials);
  });

  test("should fail login user, email not confirmed + update user + login successful", async () => {
    await testClient.register(email, password);
    await loginError(testClient, email, password, messages.login.confirmBtn);

    await User.update({ email }, { confirmed: true });
    await loginError(testClient, email, "asdasdasd", messages.login.invalidCridentials);

    const loginSuccess = await testClient.login(email, password);
    expect(loginSuccess).toEqual({ login: null });
  });
});
