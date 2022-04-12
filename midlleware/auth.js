const jwt = require('jsonwebtoken');
const ErrorForbidden = require('../utils/ErrorForbidden');
const { JWT_SECRET } = require('../config/index');

const auth = (req, res, next) => {
  const token = String(req.headers.authorization).replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new ErrorForbidden('Нет прав'));
  }

  req.user = payload;

  return next();
};

module.exports = auth;
