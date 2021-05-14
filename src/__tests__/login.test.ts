import { request } from "graphql-request";
import { Connection } from "typeorm";

import { createTOConnection } from "../utils/createTOConnection";
import { User } from "../entity/User";
import { messages } from "../lang";

const email = "jochy07c@gmail.com";
const password = "test123!";

const registerMutation = (email: string, password: string) => `
  mutation {
    register(email: "${email}", password: "${password}") {
      path
      message
    }
  }
`;

const loginMutation = (email: string, password: string) => `
  mutation {
    login(email: "${email}", password: "${password}") {
      path
      message
    }
  }
`;

const loginError = async (email: string, password: string, errorMsg: string) => {
  const loginUser = await request(
    process.env.TEST_GQL_HOST as string,
    loginMutation(email, password)
  );

  expect(loginUser).toEqual({ login: [{ path: "email", message: errorMsg }] });
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
    await loginError(email, "asdalsdknasd", messages.login.invalidCridentials);
  });

  test("should fail login user, email not confirmed + update user + login successful", async () => {
    await request(process.env.TEST_GQL_HOST as string, registerMutation(email, password));
    await loginError(email, password, messages.login.confirmBtn);

    await User.update({ email }, { confirmed: true });

    await loginError(email, "asdasdasd", messages.login.invalidCridentials);

    const loginSuccess = await request(
      process.env.TEST_GQL_HOST as string,
      loginMutation(email, password)
    );
    expect(loginSuccess).toEqual({ login: null });
  });
});
