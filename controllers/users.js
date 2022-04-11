const { User } = require('../models/user');
const ErrorBadRequest = require('../utils/ErrorBadRequest');
const ErrorNotFound = require('../utils/ErrorNotFound');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).orFail(() => {
      throw new ErrorBadRequest('Произошла ошибка.');
    });
    res.send(users);
  } catch (err) {
    if (err.statusCode === 400) {
      res.status(400).send({ message: err.errorMessage });
    } else {
      res.status(500).send({ message: err.message });
    }
  }
};

exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new ErrorNotFound(
        `Пользователь с ID ${req.params.userId} не найден.`,
      );
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(404).send({ message: err.errorMessage });
        return;
      }
      if (err.name === 'CastError') {
        const errorMessage = 'Переданы неверные данные';
        res.status(400).send({ message: errorMessage });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

exports.createUser = (req, res) => {
  User.create({ name: req.body.name, about: req.body.about, avatar: req.body.avatar })
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
        res.status(400).send({ message: errorMessage });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

exports.updateProfile = (req, res) => {
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
      if (err.name === 'NotFound') {
        res.status(404).send({ message: err.errorMessage });
        return;
      }
      if (err.name === 'ValidationError') {
        let errorMessage = 'Переданы неверные данные: ';
        const errorValues = Object.values(err.errors);
        errorValues.forEach((errVal) => {
          if (typeof errVal === 'object') {
            errorMessage += `Ошибка в поле ${errVal.path} `;
          }
        });
        res.status(400).send({ message: errorMessage });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail(() => {
      throw new ErrorNotFound(`Пользователь с ID ${req.user._id} не найден.`);
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(404).send({ message: err.errorMessage });
        return;
      }
      if (err.name === 'ValidationError') {
        let errorMessage = 'Переданы неверные данные: ';
        const errorValues = Object.values(err.errors);
        errorValues.forEach((errVal) => {
          if (typeof errVal === 'object') {
            errorMessage += `Ошибка в поле ${errVal.path} `;
          }
        });
        res.status(400).send({ message: errorMessage });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};
