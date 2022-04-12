class ErrorForbidden extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.name = 'Forbidden';
  }
}

module.exports = ErrorForbidden;
