import { Client } from "pg";

export const client: Client = new Client({
  user: "tilap",
  password: "1511",
  host: "localhost",
  database: "moviesdatabase",
  port: 5432,
});

export const startDatabase = async (): Promise<void> => {
  await client.connect();
  console.log("Database connected");
};
