import { access, createReadStream, ReadStream, stat } from "fs";
import path from "path";
import { promisify } from "util";
import { WebVideoError } from "./VideoError.js";

function throwError(error: any) {
  if (error.code === "ENOENT") {
    throw new WebVideoError("404 - Not Found");
  }

  throw new Error(error.toString);
}

export async function processVideoService(name: string, range: string) {
  const videoPath = await preProcessVideo(name, range as string);
  return await processVideo(range as string, videoPath);
}

export async function preProcessVideo(name: string, range: string) {
  if (!range) throw new WebVideoError("400 - Range not provided");
  const videoPath = path.resolve("./videos", name);
  try {
    await promisify(access)(videoPath);
  } catch (err) {
    const error = err as any;
    throwError(error);
  }
  return videoPath;
}

export async function processVideo(range: string, videoPath: string) {
  const { chunkSize, videoSize } = await getStaticVideo(videoPath);

  const { start, end, contentLength } = getVideoPart(
    range,
    chunkSize,
    videoSize
  );

  const stream = createReadStream(videoPath, { start, end });
  stream.on("error", (err) => console.log(err.toString()));

  return {
    snippet: { start, end },
    length: { videoSize, contentLength },
    stream,
  };
}

function getVideoPart(range: string, chunkSize: number, videoSize: number) {
  const parts = range.replace("bytes=", "").split("-");
  const rangeStart = parts[0] && parts[0].trim();
  const start = rangeStart ? parseInt(rangeStart, 10) : 0;
  const rangeEnd = parts[1] && parts[1].trim();
  const __rangeEnd = rangeEnd ? parseInt(rangeEnd, 10) : undefined;
  const end =
    __rangeEnd === 1 ? __rangeEnd : Math.min(start + chunkSize, videoSize) - 1;
  const contentLength = end - start + 1;
  return { start, end, contentLength };
}

async function getStaticVideo(videoPath: string) {
  const videoStat = await promisify(stat)(videoPath);
  const videoSize = videoStat.size;
  const chunkSize = 10 ** 6;
  return { chunkSize, videoSize };
}
