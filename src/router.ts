import { Context } from "koa";
import Router from "koa-router";
import send from "koa-send";
import path from "path";
import dirname from "./__dirname";

const router = new Router();

router.get("/", async (ctx: Context) => {
  await send(ctx, path.resolve(dirname, "public", "index.html"));

  if (!ctx.status) {
    ctx.throw(404);
  }
});

export default router;
