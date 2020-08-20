class BadRequest {
  constructor(message) {
    this.status = 400;
    this.error = "Bad request";
    this.message = message;
  }
}

module.exports = BadRequest;
