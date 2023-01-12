import { Context } from "koa";

export function getContext(ctx: Context) {
  const { name } = ctx.params;
  const { response, request } = ctx;
  const { headers } = request;
  return { name, response, headers };
}
