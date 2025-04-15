import { Context, RouterMiddleware } from "@oak/oak";
import { SendgridEvent, SendgridEventsSchema } from "./webhook.types.ts";
import {
  createEngagementEvents,
  EngagementEvent,
} from "../models/engagement-event.ts";

export const post: RouterMiddleware<"/webhook"> = async (ctx: Context) => {
  const body = await ctx.request.body.json();
  const events = SendgridEventsSchema.parse(body);

  createEngagementEvents(events.map(toEngagementEvent));
  ctx.response.status = 201;
};

function toEngagementEvent(e: SendgridEvent): EngagementEvent {
  return {
    ...e,
    id: crypto.randomUUID(),
    url: "url" in e ? e.url ?? null : null,
    sg_machine_open: "sg_machine_open" in e ? e.sg_machine_open ?? null : null,
    marketing_campaign_id: e.marketing_campaign_id ?? null,
    marketing_campaign_name: e.marketing_campaign_name ?? null,
    mc_auto_id: e.mc_auto_id ?? null,
    mc_auto_name: e.mc_auto_name ?? null,
  };
}
