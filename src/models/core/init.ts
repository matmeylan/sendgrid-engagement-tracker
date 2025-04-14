import { createEngagementEventsTable } from "../engagement-event.ts";
import { database } from "./database.ts";

export function initDatabase() {
  createEngagementEventsTable(database);
}
