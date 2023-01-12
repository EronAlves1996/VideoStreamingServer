import Koa, { ParameterizedContext } from "koa";
import Router from "koa-router";
import send from "koa-send";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT!, 10) || 3000;
const app = new Koa();
const router = new Router();

router.get("/", async (ctx: Koa.Context) => {
  await send(ctx, path.resolve(__dirname, "public", "index.html"));

  if (!ctx.status) {
    ctx.throw(404);
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT);
console.log("Video Streaming Server is running on Port", PORT);
