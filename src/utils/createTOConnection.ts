import { createConnection, getConnectionOptions } from "typeorm";

export const createTOConnection = async () => {
  let connectionOptions = await getConnectionOptions(process.env.NODE_ENV);

  // if (process.env.NODE_ENV === "production") {
  //   connectionOptions = Object.assign(connectionOptions, { url: process.env.DATABASE_URL });
  // }

  console.log("***************");
  console.log(`typeorm-connection-options`, connectionOptions);
  console.log("***************");

  return createConnection({ ...connectionOptions, name: "default" });
};
