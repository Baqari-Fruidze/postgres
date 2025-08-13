export class appError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.errorMessage = message;
  }
}

export const handleError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (!err.isOperational) {
    return res.status(500).json({
      status: "error",
      message: "internal server error",
    });
  }
  if (process.env.NODE_ENV === "development") {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  } else if (process.env.NODE_ENV === "production") {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
};
export const handleJWTError = () => {
  return new appError("Invalid token", 401);
};