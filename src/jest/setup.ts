import { Server } from "node:http";
import { Connection } from "typeorm";

import { startServer } from "../startServer";

let server: Server;
let TOConnection: Connection;

export const initializeSetup = async () => {
  const { connection, listener } = await startServer();
  const { port } = listener.address() as any;

  server = listener;
  TOConnection = connection;
  process.env.TEST_HOST = `http://127.0.0.1:${port}/graphql`;
};

export const closeSetup = async () => {
  server.close();
  await TOConnection.close();
};
