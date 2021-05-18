import { Connection } from "typeorm";

import { createTOConnection } from "../utils/createTOConnection";
import { TestClient } from "../utils/TestClient";
import { User } from "../entity/User";

const email = "asiaferrer@gmail.com";
const password = "jochy123";

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
    const testClient = new TestClient(process.env.TEST_GQL_HOST as string);

    const response = await testClient.user();
    expect(response.data.data).toEqual({ user: null });
  });

  test("should get current user", async () => {
    const testClient = new TestClient(process.env.TEST_GQL_HOST as string);

    await testClient.login(email, password);

    const response = await testClient.user();
    expect(response.data.data).toEqual({
      user: {
        id: userId,
        email,
      },
    });
  });
});
