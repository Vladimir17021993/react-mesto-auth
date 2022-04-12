const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const ErrorBadRequest = require('../utils/ErrorBadRequest');
const ErrorNotFound = require('../utils/ErrorNotFound');
const ErrorConflict = require('../utils/ErrorConflict');
const ErrorUnauthorized = require('../utils/ErrorUnauthorized');
const { JWT_SECRET, SALT_ROUNDS } = require('../config/index');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).orFail(() => {
      throw new ErrorBadRequest('Произошла ошибка.');
    });
    res.send(users);
  } catch (err) {
    next(err);
  }
};

exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new ErrorNotFound(
        `Пользователь с ID ${req.params.userId} не найден.`,
      );
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        const errorMessage = 'Переданы неверные данные';
        next(new ErrorBadRequest(errorMessage));
      } else {
        next(err);
      }
    });
};

exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ErrorConflict(`Пользователь ${email} уже зарегестрирован.`);
      }
      return bcrypt.hash(password, SALT_ROUNDS);
    })
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => User.findOne({ _id: user._id }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        let errorMessage = 'Переданы неверные данные: ';
        const errorValues = Object.values(err.errors);
        errorValues.forEach((errVal) => {
          if (typeof errVal === 'object') {
            errorMessage += `Ошибка в поле ${errVal.path} `;
          }
        });
        next(new ErrorBadRequest(errorMessage));
      } else {
        next(err);
      }
    });
};

exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true, upsert: true },
  )
    .orFail(() => {
      throw new ErrorNotFound(`Пользователь с ID ${req.user._id} не найден.`);
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        let errorMessage = 'Переданы неверные данные: ';
        const errorValues = Object.values(err.errors);
        errorValues.forEach((errVal) => {
          if (typeof errVal === 'object') {
            errorMessage += `Ошибка в поле ${errVal.path} `;
          }
        });
        next(new ErrorBadRequest(errorMessage));
      } else {
        next(err);
      }
    });
};

exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail(() => {
      throw new ErrorNotFound(`Пользователь с ID ${req.user._id} не найден.`);
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        let errorMessage = 'Переданы неверные данные: ';
        const errorValues = Object.values(err.errors);
        errorValues.forEach((errVal) => {
          if (typeof errVal === 'object') {
            errorMessage += `Ошибка в поле ${errVal.path} `;
          }
        });
        next(new ErrorBadRequest(errorMessage));
      } else {
        next(err);
      }
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }, '+password')
    .then((user) => {
      if (!user) {
        throw new ErrorUnauthorized('Не правильный логин или пароль.');
      }
      return bcrypt.compare(password, user.password)
        .then((isValid) => {
          if (!isValid) {
            throw new ErrorUnauthorized('Не правильный логин или пароль.');
          }
          const token = jwt.sign({ _id: user._id }, JWT_SECRET);
          res
            .cookie('jwt', token, {
              maxAge: 3600000 * 24 * 7,
              httpOnly: true,
            });

          res.send({ jwt: req.cookies.jwt });
        });
    })
    .catch(next);
};

exports.getUser = (req, res, next) => {
  User.findOne(req.user.id)
    .orFail(() => {
      throw new ErrorNotFound(`Пользователь с Id ${req.user.id} не найден.`);
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};
