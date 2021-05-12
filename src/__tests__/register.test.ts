import { request } from "graphql-request";
import { Server } from "node:http";
import { Connection } from "typeorm";

import { startServer } from "../startServer";
import { User } from "../entity/User";

const email = "jochy07c@gmail.com";
const password = "test123!";

const mutation = `
mutation {
  register(email: "${email}", password: "${password}") 
}
`;

let app: Server;
let host: string = "";
let TOConnection: Connection;

beforeAll(async () => {
  const { connection, listener } = await startServer();
  const { port } = listener.address() as any;

  app = listener;
  TOConnection = connection;
  host = `http://127.0.0.1:${port}/graphql`;
});

afterAll(async () => {
  app.close();
  await TOConnection.close();
});

test("Register User", async () => {
  const response = await request(host, mutation);
  expect(response).toEqual({ register: true });

  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);

  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);
});
