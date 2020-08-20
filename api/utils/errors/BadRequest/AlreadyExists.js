class AlreadyExists {
  constructor() {
    this.status = 400;
    this.error = "Bad request";
    this.message = "User already exists";
  }
}

module.exports = AlreadyExists;
