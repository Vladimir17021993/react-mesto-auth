class ErrorWrongUser extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.name = 'WrongUser';
  }
}

module.exports = ErrorWrongUser;
