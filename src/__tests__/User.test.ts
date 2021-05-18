import { Connection } from "typeorm";

import { createTOConnection } from "../utils/createTOConnection";
import { TestClient } from "../utils/TestClient";
import { User } from "../entity/User";

let userId: string;
let connection: Connection;

const email = "asiaferrer@gmail.com";
const password = "jochy123";

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
  let testClient: TestClient;

  beforeEach(() => {
    testClient = new TestClient(process.env.TEST_GQL_HOST as string);
  });

  test("should return null when no cookie is preset", async () => {
    const response = await testClient.user();
    expect(response).toEqual({ user: null });
  });

  test("should get current user", async () => {
    await testClient.login(email, password);

    const response = await testClient.user();
    expect(response).toEqual({
      user: {
        id: userId,
        email,
      },
    });
  });
});
