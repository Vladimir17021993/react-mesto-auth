const express = require('express');
const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');
const auth = require('../midlleware/auth');
const validators = require('../midlleware/validations');

const usersRoutes = express.Router();

usersRoutes.get('/users', auth, getUsers);

usersRoutes.get('/users/:userId', auth, getUserById);

usersRoutes.patch('/users/me', express.json(), auth, updateProfile);

usersRoutes.patch('/users/me/avatar', express.json(), auth, updateAvatar);

exports.usersRoutes = usersRoutes;
