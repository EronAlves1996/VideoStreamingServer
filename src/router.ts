import { access } from "fs";
import { Context, Middleware } from "koa";
import Router from "koa-router";
import send from "koa-send";
import path from "path";
import { promisify } from "util";

const router = new Router();

router.get("/", async (ctx: Context) => {
  await send(ctx, "public/index.html");

  if (!ctx.status) {
    ctx.throw(404);
  }
});

router.get("/api/video/:name", async (ctx: Context, next: Middleware) => {
  const { name } = ctx.params;
  const { request, response } = ctx;
  const { range } = request.headers;

  if (!/^[a-z0-9-_ ]+\.mp4$/i.test(name)) return next();
  if (!range) ctx.throw(400, "Range not provided");

  const videoPath = path.resolve(__dirname, "videos", name);
  try {
    await promisify(access)(videoPath);
  } catch (err) {
    const error = err as any;
    if (error.code === "ENOENT") {
      ctx.throw(404);
    } else {
      ctx.throw(error.toString());
    }
  }

  const parts = range.replace("bytes=", "").split("-");
  const rangeStart = parts[0] && parts[0].trim();
});

export default router;
