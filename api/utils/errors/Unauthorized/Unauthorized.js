class Unauthorized {
  constructor(message) {
    this.status = 401;
    this.error = "Unauthorized";
    this.message = message;
  }
}

module.exports = Unauthorized;
