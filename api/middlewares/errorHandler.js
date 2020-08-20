const errorHandlerMiddleware = (error, req, res, _next) => {
  const errorResponse = {};

  if (error.data) {
    errorResponse.data = error.data;
  }

  errorResponse.status = error.status || 500;
  errorResponse.error = error.error || "Internal server error";
  errorResponse.message = error.message || "Unexpected server error";

  res.status(errorResponse.status).json(errorResponse);
};

module.exports = errorHandlerMiddleware;
