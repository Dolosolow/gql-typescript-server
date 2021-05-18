import { Connection } from "typeorm";

import { createForgotPasswordLink } from "../utils/createForgotPwdLink";
import { createTOConnection } from "../utils/createTOConnection";
import { forgotPwdLockAcct } from "../utils/forgotPwdLockAcct";
import { messages } from "../lang";
import { redis } from "../utils/redisConfig";
import { TestClient } from "../utils/TestClient";
import { User } from "../entity/User";

const email = "asiaferrer@gmail.com";
const password = "jochy123";
const newPassword = "newJochy123";

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

describe("Forgot Password", () => {
  test("should update user account w/ new password", async () => {
    const testClient = new TestClient(process.env.TEST_GQL_HOST as string);

    await forgotPwdLockAcct(userId, redis);

    const lockAcctLoginAttempt = await testClient.login(email, password);
    expect(lockAcctLoginAttempt.data.data).toEqual({
      login: [{ path: "email", message: messages.login.AcctLock }],
    });

    const url = await createForgotPasswordLink(process.env.TEST_HOST as string, userId, redis);
    const chunks = url.split("/");
    const key = chunks[chunks.length - 1];

    const changePwdShortFail = await testClient.changeForgottenPassword("p", key);
    expect(changePwdShortFail.data.data).toEqual({
      changeForgottenPassword: [
        { path: "newPassword", message: messages.register.passwordNotLongEnough },
      ],
    });

    const changePwdResponse = await testClient.changeForgottenPassword(newPassword, key);
    expect(changePwdResponse.data.data).toEqual({ changeForgottenPassword: null });

    const sameKeyChangePwd = await testClient.changeForgottenPassword("againagainagain", key);
    expect(sameKeyChangePwd.data.data).toEqual({
      changeForgottenPassword: [{ path: "key", message: messages.forgotPassword.expiredKey }],
    });

    const loginResponse = await testClient.login(email, newPassword);
    expect(loginResponse.data.data).toEqual({ login: null });

    const userResponse = await testClient.user();
    expect(userResponse.data.data).toEqual({ user: { id: userId, email } });
  });
});
