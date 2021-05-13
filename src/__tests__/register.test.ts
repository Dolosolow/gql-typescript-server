import { request } from "graphql-request";
import { Server } from "node:http";
import { Connection } from "typeorm";

import { startServer } from "../startServer";
import { User } from "../entity/User";
import { messages } from "../lang";

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

describe("Register User", () => {
  test("check for duplicate emails", async () => {
    const newRegister = await request(host, mutation(email, password));
    expect(newRegister).toEqual({ register: null });

    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);

    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);

    const duplicateEmail = await request(host, mutation(email, password));
    expect(duplicateEmail.register).toHaveLength(1);
    expect(duplicateEmail.register[0]).toEqual({
      path: "email",
      message: messages.register.duplicateEmail,
    });
  });

  test("check for bad email", async () => {
    const badEmail = await request(host, mutation("om", password));
    expect(badEmail.register).toEqual([
      {
        path: "email",
        message: messages.register.emailNotLongEnough,
      },
      {
        path: "email",
        message: messages.register.invalidEmail,
      },
    ]);
  });

  test("check for bad password", async () => {
    const badPassword = await request(host, mutation(email, "te"));
    expect(badPassword.register).toEqual([
      {
        path: "password",
        message: messages.register.passwordNotLongEnough,
      },
    ]);
  });

  test("check for bad email+password", async () => {
    const badEmailPassword = await request(host, mutation("cm", "te"));
    expect(badEmailPassword.register).toEqual([
      {
        path: "email",
        message: messages.register.emailNotLongEnough,
      },
      {
        path: "email",
        message: messages.register.invalidEmail,
      },
      {
        path: "password",
        message: messages.register.passwordNotLongEnough,
      },
    ]);
  });
});

// import { request } from "graphql-request";
// import { Server } from "node:http";
// import { Connection } from "typeorm";

// import { startServer } from "../startServer";
// import { User } from "../entity/User";
// import { messages } from "../lang";

// const email = "jochy07c@gmail.com";
// const password = "test123!";

// const mutation = (email: string, password: string) => `
//   mutation {
//     register(email: "${email}", password: "${password}") {
//       path
//       message
//     }
//   }
// `;

// let host: string = "";
// let server: Server;
// let TOConnection: Connection;

// beforeAll(async () => {
//   const { connection, listener } = await startServer();
//   const { port } = listener.address() as any;

//   server = listener;
//   TOConnection = connection;
//   host = `http://127.0.0.1:${port}/graphql`;
// });

// afterAll(async () => {
//   server.close();
//   await TOConnection.close();
// });

// test("Register User", async () => {
//   const newRegister = await request(host, mutation(email, password));
//   expect(newRegister).toEqual({ register: null });

//   const users = await User.find({ where: { email } });
//   expect(users).toHaveLength(1);

//   const user = users[0];
//   expect(user.email).toEqual(email);
//   expect(user.password).not.toEqual(password);

//   const duplicateEmail = await request(host, mutation(email, password));
//   expect(duplicateEmail.register).toHaveLength(1);
//   expect(duplicateEmail.register[0]).toEqual({
//     path: "email",
//     message: messages.register.duplicateEmail,
//   });

//   const badEmail = await request(host, mutation("om", password));
//   expect(badEmail.register).toEqual([
//     {
//       path: "email",
//       message: messages.register.emailNotLongEnough,
//     },
//     {
//       path: "email",
//       message: messages.register.invalidEmail,
//     },
//   ]);

//   const badPassword = await request(host, mutation(email, "te"));
//   expect(badPassword.register).toEqual([
//     {
//       path: "password",
//       message: messages.register.passwordNotLongEnough,
//     },
//   ]);

//   const badEmailPassword = await request(host, mutation("cm", "te"));
//   expect(badEmailPassword.register).toEqual([
//     {
//       path: "email",
//       message: messages.register.emailNotLongEnough,
//     },
//     {
//       path: "email",
//       message: messages.register.invalidEmail,
//     },
//     {
//       path: "password",
//       message: messages.register.passwordNotLongEnough,
//     },
//   ]);
// });
