export class WebVideoError extends Error {
  statusCode: number;
  message: string;

  constructor(message: string) {
    super(message);
    const parsedMess = message.split("-");
    this.statusCode = parseInt(parsedMess[0].trim());
    this.message = parsedMess[1].trim();
  }
}
