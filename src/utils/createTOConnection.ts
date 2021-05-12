import { createConnection, getConnectionOptions } from "typeorm";

export const createTOConnection = async () => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  return createConnection({ ...connectionOptions, name: "default" });
};
