export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal server error";
  console.error("[Error]", req.method, req.path, "|", status, "|", message);
  if (status >= 500) console.error("[Error] Stack:", err.stack);
  res.status(status).json({ message, ...(process.env.NODE_ENV === "development" && { stack: err.stack }) });
};

export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}
