import { access, createReadStream, stat } from "fs";
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
  const start = rangeStart ? parseInt(rangeStart, 10) : 0;

  const videoStat = await promisify(stat)(videoPath);
  const videoSize = videoStat.size;
  const chunkSize = 10 ** 6;

  const rangeEnd = parts[1] && parts[1].trim();
  const __rangeEnd = rangeEnd ? parseInt(rangeEnd, 10) : undefined;
  const end =
    __rangeEnd === 1 ? __rangeEnd : Math.min(start + chunkSize, videoSize) - 1;
  const contentLength = end - start + 1;

  response.set("Content-Range", `bytes ${start}-${end}/${videoSize}`);
  response.set("Accept-Ranges", "bytes");
  response.set("Content-Length", contentLength.toString());

  const stream = createReadStream(videoPath, { start, end });
  stream.on("error", (err) => console.log(err.toString()));

  response.status = 206;
  response.type = path.extname(name);
  response.body = stream;
});

export default router;
