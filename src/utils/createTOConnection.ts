import { createConnection, getConnectionOptions } from "typeorm";

export const createTOConnection = async () => {
  let connectionOptions = await getConnectionOptions(process.env.NODE_ENV);

  if (process.env.NODE_ENV === "production") {
    connectionOptions = Object.assign(connectionOptions, { url: process.env.DATABASE_URL });
  }

  return createConnection({ ...connectionOptions, name: "default" });
};
