import Koa from "koa";

const PORT = parseInt(process.env.PORT!, 10) || 3000;
const app = new Koa();

app.listen(PORT);
console.log("Video Streaming Server is running on Port", PORT);
