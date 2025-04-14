import { DatabaseSync } from "node:sqlite";

const url = Deno.env.get("DATABASE_URL");
if (!url) throw new Error("Could not open database, missing `DATABASE_URL`");
export const database = new DatabaseSync(url);
