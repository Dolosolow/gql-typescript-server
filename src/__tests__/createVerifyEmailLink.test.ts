import fetch from "node-fetch";

import { createTOConnection } from "../utils/createTOConnection";
import { createVerifyEmailLink } from "../utils/createVerifyEmailLink";
import { User } from "../entity/User";
import { redis } from "../utils/redisConfig";

let userId: string;

beforeAll(async () => {
  await createTOConnection();
  const user = User.create({ email: "asiaferrer@gmail.com", password: "jochy123" });
  await user.save();
  userId = user.id;
});

describe("ƒ: createVerifyEmailLink", () => {
  test("should create link, confirm user & delete key from redis", async () => {
    const url = await createVerifyEmailLink(process.env.TEST_HOST as string, userId, redis);
    const response = await fetch(url);
    const text = await response.text();
    expect(text).toEqual("ok");

    const user = await User.findOne({ where: { id: userId } });
    expect((user as User).confirmed).toBeTruthy();

    const chunks = url.split("/");
    const key = chunks[chunks.length - 1];
    const value = await redis.get(key);
    expect(value).toBeNull();
  });
});
