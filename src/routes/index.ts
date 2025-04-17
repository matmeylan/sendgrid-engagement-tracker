import { Context, RouterMiddleware } from "@oak/oak";
import {
  countEvents,
  listDistinctAutomations,
  listDistinctSingleSend,
} from "../models/engagement-event.ts";

export const get: RouterMiddleware<"/"> = async (ctx: Context) => {
  const automations = listDistinctAutomations();
  const singleSend = listDistinctSingleSend();
  const numEvents = countEvents();
  const automationOptions = automations.map((automation) =>
    `<option value="${automation.mc_auto_id}">${automation.mc_auto_name}</option>`
  );
  const singleSendOptions = singleSend.map((c) =>
    `<option value="${c.singlesend_id}">${c.singlesend_name}</option>`
  );
  ctx.response.body = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Welcome !</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 2em;
          max-width: 500px;
          margin: auto;
          background-color: #f9f9f9;
          color: #333;
        }
        h1 {
          font-size: 1.8em;
          margin-bottom: 0.5em;
        }
        p {
          margin-bottom: 1.5em;
          line-height: 1.5;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 1em;
        }
        select, button {
          padding: 0.5em;
          font-size: 1em;
          border-radius: 4px;
        }
        button {
          background-color: #17304e;
          color: white;
          border: none;
          cursor: pointer;
        }
        button:hover {
          background-color: #3f5774;
        }
      </style>
    </head>
    <body>
      <h1>Sendgrid Engagement Tracker Hub (SETH)</h1>
      <p>This page lets you choose a marketing automation and extract all engagement events that were captured for that automation. You'll be redirected to a page downloading a filtered list based on your selection.</p>
      <div style="margin-bottom: 1rem;"><strong>Current number of events: ${numEvents}</strong></div>
      <form method="GET" action="/events">
        <label for="automationId">Automation (optional):</label>
        <select name="automationId" id="automationId">
          <option value="">-- Any --</option>
          ${automationOptions}
        </select>
        <label for="singleSendId">Single send (optional):</label>
        <select name="singleSendId" id="singleSendId">
          <option value="">-- Any --</option>
          ${singleSendOptions}
        </select>
        <button type="submit">Download Events</button>
      </form>
    </body>
    </html>
  `;
};
