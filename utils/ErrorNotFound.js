class ErrorNotFound extends Error {
  constructor(message) {
    super(message);
    this.errorMessage = message;
    this.statusCode = 404;
    this.name = 'NotFound';
  }
}

module.exports = ErrorNotFound;
