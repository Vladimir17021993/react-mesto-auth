class ErrorConflict extends Error {
  constructor(message) {
    super(message);
    this.errorMessage = message;
    this.statusCode = 409;
    this.name = 'Conflict';
  }
}

module.exports = ErrorConflict;
