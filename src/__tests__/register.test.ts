import { Connection } from "typeorm";
import { request } from "graphql-request";
import { Server } from "node:http";

import { startServer } from "../startServer";
import { User } from "../entity/User";

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

let host: string = "";
let server: Server;
let TOConnection: Connection;

beforeAll(async () => {
  const { connection, listener } = await startServer();
  const { port } = listener.address() as any;

  server = listener;
  TOConnection = connection;
  host = `http://127.0.0.1:${port}/graphql`;
});

afterAll(async () => {
  server.close();
  await TOConnection.close();
});

test("Register User", async () => {
  const gqlResponse = await request(host, mutation(email, password));
  expect(gqlResponse).toEqual({ register: null });

  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);

  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);

  const duplicateResponse = await request(host, mutation(email, password));
  expect(duplicateResponse.register).toHaveLength(1);
  expect(duplicateResponse.register[0].path).toEqual("email");
});
