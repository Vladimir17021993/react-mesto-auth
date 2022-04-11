class ErrorBadRequest extends Error {
  constructor(message) {
    super(message);
    this.errorMessage = message;
    this.statusCode = 400;
    this.name = 'BadRequest';
  }
}

module.exports = ErrorBadRequest;
