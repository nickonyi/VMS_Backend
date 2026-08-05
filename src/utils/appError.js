class AppError extends Error {
  constructor(message, statusCode = 500, url = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.url = url;

    this.operational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
