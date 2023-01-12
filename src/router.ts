import { ReadStream } from "fs";
import { Context, Middleware } from "koa";
import Router from "koa-router";
import send from "koa-send";
import path from "path";
import { getContext } from "./getContext.js";
import { Length, Snippet } from "./types";
import { processVideoService } from "./video.js";
import { WebVideoError } from "./VideoError.js";

const router = new Router();

router.get("/", async (ctx: Context) => {
  await send(ctx, "public/index.html");

  if (!ctx.status) {
    ctx.throw(404);
  }
});

router.get("/api/video/:name", async (ctx: Context, next: Middleware) => {
  const { name, response, headers } = getContext(ctx);
  const { range } = headers;

  if (!/^[a-z0-9-_ ]+\.mp4$/i.test(name)) return next();

  try {
    const { length, snippet, stream } = await processVideoService(
      name,
      range as string
    );
    setVideoHeaders(response, snippet, length);
    sendVideo(response, name, stream);
  } catch (err) {
    if (err instanceof WebVideoError) {
      const error = err as WebVideoError;
      ctx.throw(error.statusCode, error.message);
    }
    if (err instanceof Error) {
      const error = err as Error;
      console.log(error);
      ctx.throw(error.message);
    }
  }
});

export function sendVideo(
  response: import("/home/eronads/repos/streamingDenoJs/node_modules/@types/koa/index").Response & {
    body: unknown;
  },
  name: string,
  stream: ReadStream
) {
  response.status = 206;
  response.type = path.extname(name);
  response.body = stream;
}

export default router;
function setVideoHeaders(
  response: import("/home/eronads/repos/streamingDenoJs/node_modules/@types/koa/index").Response & {
    body: unknown;
  },
  { start, end }: Snippet,
  { videoSize, contentLength }: Length
) {
  response.set("Content-Range", `bytes ${start}-${end}/${videoSize}`);
  response.set("Accept-Ranges", "bytes");
  response.set("Content-Length", contentLength.toString());
}
