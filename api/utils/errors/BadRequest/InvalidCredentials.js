class InvalidCredentials {
  constructor() {
    this.status = 400;
    this.error = "Bad request";
    this.message = "InvalidCredentials";
  }
}

module.exports = InvalidCredentials;
