import { RouterMiddleware } from "@oak/oak";

export const get: RouterMiddleware<"/up"> = async (ctx) => {
  ctx.response.status = 200;
  ctx.response.body = "healthy";
};
