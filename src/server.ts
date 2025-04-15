import { Application, Context, Next, Router } from "@oak/oak";
import * as webhook from "./routes/webhook.ts";
import * as events from "./routes/events.ts";
import * as index from "./routes/index.ts";
import * as z from "zod";
import { env } from "./config/env.ts";

export function setupApplication() {
  const app = new Application();
  const router = new Router();
  router.get("/", index.get);
  router.get("/health", (ctx) => ctx.response.body = "healthy");
  router.get("/events", events.get);
  router.post("/webhook", webhook.post);

  app.use(log);
  app.use(timing);
  app.use(
    basicAuthentication(
      env("BASIC_AUTH_USERNAME"),
      env("BASIC_AUTH_PASSWORD"),
    ),
  );
  app.use(error);
  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
}

async function error(ctx: Context, next: Next) {
  try {
    await next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error(`Zod validation error\n`, z.prettifyError(err));
      ctx.response.status = 400;
      ctx.response.body = err;
    } else {
      throw err;
    }
  }
}

async function log(ctx: Context, next: Next) {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(
    `${ctx.request.method} ${ctx.request.url} - ${ctx.response.status} ${rt}`,
  );
}

async function timing(ctx: Context, next: Next) {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
}

/**
 * HTTP basic auth middleware
 */
function basicAuthentication(username?: string, password?: string) {
  return async (ctx: Context, next: () => Promise<unknown>) => {
    const authHeader = ctx.request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Basic ")) {
      ctx.response.status = 401;
      ctx.response.headers.set("WWW-Authenticate", 'Basic realm="Secure Area"');
      ctx.response.body = "Authentication required";
      return;
    }

    const encoded = authHeader.replace("Basic ", "");
    const decoded = atob(encoded); // e.g. "user:pass"
    const [user, pass] = decoded.split(":");

    if (user === username && pass === password) {
      await next();
    } else {
      ctx.response.status = 401;
      ctx.response.body = "Invalid credentials";
    }
  };
}
