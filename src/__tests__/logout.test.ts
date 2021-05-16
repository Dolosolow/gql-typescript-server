import { Connection } from "typeorm";
import axios from "axios";

import { createTOConnection } from "../utils/createTOConnection";
import { User } from "../entity/User";

const email = "asiaferrer@gmail.com";
const password = "jochy123";

const loginMutation = (email: string, password: string) => `
  mutation {
    login(email: "${email}", password: "${password}") {
      path
      message
    }
  }
`;

const logoutMutation = () => `
  mutation {
    logout
  }
`;

const userQuery = () => `
  query {
    user {
      id
      email
    }
  }
`;

let userId: string;
let connection: Connection;

beforeAll(async () => {
  connection = await createTOConnection();
  const user = await User.create({ email, password, confirmed: true }).save();
  userId = user.id;
});

afterAll(async () => {
  await connection.close();
});

describe("Logout User", () => {
  test("should destory session and log a user out", async () => {
    await axios.post(
      process.env.TEST_GQL_HOST as string,
      {
        query: loginMutation(email, password),
      },
      { withCredentials: true }
    );

    const loginResponse = await axios.post(
      process.env.TEST_GQL_HOST as string,
      {
        query: userQuery(),
      },
      { withCredentials: true }
    );

    expect(loginResponse.data.data).toEqual({
      user: {
        id: userId,
        email,
      },
    });

    await axios.post(
      process.env.TEST_GQL_HOST as string,
      {
        query: logoutMutation(),
      },
      { withCredentials: true }
    );

    const logoutResponse = await axios.post(
      process.env.TEST_GQL_HOST as string,
      { query: userQuery() },
      { withCredentials: true }
    );

    expect(logoutResponse.data.data).toEqual({ user: null });
  });
});
