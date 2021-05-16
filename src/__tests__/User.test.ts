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
  const user = User.create({ email, password, confirmed: true });
  await user.save();
  userId = user.id;
});

afterAll(async () => {
  await connection.close();
});

describe("User Query", () => {
  test("should return null when no cookie is preset", async () => {
    const response = await axios.post(process.env.TEST_GQL_HOST as string, {
      query: userQuery(),
    });
    expect(response.data.data).toEqual({ user: null });
  });

  test("should get current user", async () => {
    await axios.post(
      process.env.TEST_GQL_HOST as string,
      {
        query: loginMutation(email, password),
      },
      { withCredentials: true }
    );

    const response = await axios.post(
      process.env.TEST_GQL_HOST as string,
      {
        query: userQuery(),
      },
      { withCredentials: true }
    );
    expect(response.data.data).toEqual({
      user: {
        id: userId,
        email,
      },
    });
  });
});
