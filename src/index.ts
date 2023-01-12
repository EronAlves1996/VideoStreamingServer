import Koa from "koa";
import router from "./router";

const PORT = parseInt(process.env.PORT!, 10) || 3000;
const app = new Koa();

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT);
console.log("Video Streaming Server is running on Port", PORT);
