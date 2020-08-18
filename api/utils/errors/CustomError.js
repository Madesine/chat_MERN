class CustomError {
  constructor(status, httpStatusName, message, data) {
    this.status = status;
    this.error = httpStatusName;
    this.message = message;
    this.data = data;
  }
}

module.exports = CustomError;
