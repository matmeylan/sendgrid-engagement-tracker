import { listEngagementEvents } from "../models/engagement-event.ts";
import { Context, RouterMiddleware } from "@oak/oak";
import { stringify } from "@std/csv";

export const get: RouterMiddleware<"/events"> = async (ctx: Context) => {
  const automationId = ctx.request.url.searchParams.get("automationId") ||
    undefined;
  const singleSendId = ctx.request.url.searchParams.get("singleSendId") ||
    undefined;
  const events = listEngagementEvents({
    mc_auto_id: automationId,
    singlesend_id: singleSendId,
  });
  const formatted = events.map((e) => ({
    ...e,
    timestamp: new Date(e.timestamp * 1000).toISOString(),
  }));
  const csv = stringify(formatted, {
    columns: [
      "timestamp",
      "email",
      "mc_auto_name",
      "singlesend_name",
      "event",
      "url",
    ],
  });

  const filename = `events${automationId ? `-${automationId}` : ""}.csv`;
  ctx.response.headers.set(
    "Content-Disposition",
    `attachment; filename="${filename}"`,
  );
  ctx.response.headers.set("Content-Type", "application/csv");
  ctx.response.body = csv;
};
