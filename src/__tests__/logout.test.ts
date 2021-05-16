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
  const user = await User.create({ email, password, confirmed: true }).save();
  userId = user.id;
});

afterAll(async () => {
  await connection.close();
});

describe("Logout User", () => {
  test("should destory session and log a user out", async () => {
    const testClient = new TestClient(process.env.TEST_GQL_HOST as string);

    await testClient.login(email, password);
    const loginResponse = await testClient.user();

    expect(loginResponse.data.data).toEqual({
      user: {
        id: userId,
        email,
      },
    });

    await testClient.logout();
    const logoutResponse = await testClient.user();

    expect(logoutResponse.data.data).toEqual({ user: null });
  });
});
