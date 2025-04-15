import { DatabaseSync, SupportedValueType } from "node:sqlite";
import { database } from "./core/database.ts";

export type EngagementEvent = {
  id: string;
  email: string;
  timestamp: number;
  event: string;
  url: string | null;
  category: string[];
  sg_machine_open: boolean | null;
  sg_event_id: string;
  sg_message_id: string;
  marketing_campaign_id: string | null;
  marketing_campaign_name: string | null;
  mc_auto_id: string | null;
  mc_auto_name: string | null;
  useragent: string;
  ip: string;
};

export function createEngagementEventsTable(db: DatabaseSync) {
  db.exec(
    `
        CREATE TABLE IF NOT EXISTS engagement_events
        (
            id                      TEXT PRIMARY KEY,
            email                   TEXT    NOT NULL,
            timestamp               INTEGER NOT NULL,
            event                   TEXT    NOT NULL,
            url                     TEXT,
            category                TEXT    NOT NULL,
            sg_machine_open         INTEGER,
            sg_event_id             TEXT    NOT NULL,
            sg_message_id           TEXT    NOT NULL,
            marketing_campaign_id   TEXT,
            marketing_campaign_name TEXT,
            mc_auto_id              TEXT,
            mc_auto_name            TEXT,
            useragent               TEXT,
            ip                      TEXT
        );
  `,
  );
}

export function createEngagementEvents(events: EngagementEvent[]) {
  const insert = database.prepare(
    `
	  INSERT INTO engagement_events (id, email, timestamp, event, url, category, sg_machine_open, sg_event_id, sg_message_id, marketing_campaign_id, marketing_campaign_name, mc_auto_id, mc_auto_name, useragent, ip) 
	  VALUES (:id, :email, :timestamp, :event, :url, :category, :sg_machine_open, :sg_event_id, :sg_message_id, :marketing_campaign_id, :marketing_campaign_name, :mc_auto_id, :mc_auto_name, :useragent, :ip);
  `,
  );
  for (const event of events) {
    insert.run(serialise(event));
  }
}

export function getEngagementEvents(
  filterBy?: { mc_auto_id?: string },
): EngagementEvent[] {
  let statement = "SELECT * FROM engagement_events";
  let parameters: Record<string, SupportedValueType> = {};
  if (filterBy?.mc_auto_id) {
    statement = `${statement} WHERE mc_auto_id = :mc_auto_id`;
    parameters.mc_auto_id = filterBy.mc_auto_id;
  }

  return database.prepare(statement).all(parameters).map(deserialise);
}

function serialise(event: EngagementEvent): any {
  return {
    id: event.id,
    email: event.email,
    timestamp: event.timestamp,
    event: event.event,
    url: event.url,
    category: JSON.stringify(event.category),
    sg_machine_open: boolToInt(event.sg_machine_open),
    sg_event_id: event.sg_event_id,
    sg_message_id: event.sg_message_id,
    marketing_campaign_id: event.marketing_campaign_id,
    marketing_campaign_name: event.marketing_campaign_name,
    mc_auto_id: event.mc_auto_id,
    mc_auto_name: event.mc_auto_name,
    useragent: event.useragent,
    ip: event.ip,
  };
}

function deserialise(row: any): EngagementEvent {
  return {
    ...row,
    category: JSON.parse(row.category),
    sg_machine_open: intToBool(row.sg_machine_open),
  };
}

function boolToInt(b: boolean | null): number | null {
  return b === true ? 1 : b === false ? 0 : null;
}

function intToBool(b: number | null): boolean | null {
  return b === 1 ? true : b === 0 ? false : null;
}
