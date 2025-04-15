import { DatabaseSync } from "node:sqlite";
import { env } from "../../config/env.ts";

export const database = new DatabaseSync(env("DATABASE_URL"));
