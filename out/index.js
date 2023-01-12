"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const PORT = parseInt(process.env.PORT, 10) || 3000;
const app = new koa_1.default();
app.listen(PORT);
console.log("Video Streaming Server is running on Port", PORT);
