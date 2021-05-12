import { request } from "graphql-request";
import { Connection } from "typeorm";

import { createTOConnection } from "../utils/createTOConnection";
import { User } from "../entity/User";

const host = "http://localhost:4000";
const email = "jochy07c@gmail.com";
const password = "test123.";

const mutation = `
  mutation {
    register(email: "${email}", password: "${password}")
  }
`;

let connection: Connection;

beforeAll(async () => {
  connection = await createTOConnection();
});

afterAll(async () => {
  await connection.close();
});

test("Register user", async () => {
  const response = await request(host, mutation);
  expect(response).toEqual({ register: true });

  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);

  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);
});
