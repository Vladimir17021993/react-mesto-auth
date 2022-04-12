const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getUser,
} = require('../controllers/users');
const auth = require('../midlleware/auth');
const validators = require('../midlleware/validations');

const usersRoutes = express.Router();

usersRoutes.get('/users', auth, getUsers);

usersRoutes.get('/users/me', auth, getUser);

usersRoutes.get('/users/:userId', validators.userId, auth, getUserById);

usersRoutes.patch(
  '/users/me',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(2).max(30).messages({
        'string.min': 'Имя не может быть короче 2ух символов',
        'string.max': 'Имя не может быть длинее 30 символов',
      }),
      about: Joi.string().min(2).max(30).messages({
        'string.min': 'Описание не может быть короче 2ух символов',
        'string.max': 'Описание не может быть длинее 30 символов',
      }),
    }),
  }),
  express.json(),
  auth,
  updateProfile,
);

usersRoutes.patch('/users/me/avatar', validators.url, express.json(), auth, updateAvatar);

exports.usersRoutes = usersRoutes;
