import { Context } from "koa";
import Router from "koa-router";
import send from "koa-send";

const router = new Router();

router.get("/", async (ctx: Context) => {
  await send(ctx, "public/index.html");

  if (!ctx.status) {
    ctx.throw(404);
  }
});

export default router;
