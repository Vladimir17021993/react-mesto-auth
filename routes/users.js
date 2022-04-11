const express = require('express');
const {
  getUsers,
  createUser,
  getUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

const usersRoutes = express.Router();

usersRoutes.get('/users', getUsers);

usersRoutes.get('/users/:userId', getUserById);

usersRoutes.post('/users', express.json(), createUser);

usersRoutes.patch('/users/me', express.json(), updateProfile);

usersRoutes.patch('/users/me/avatar', express.json(), updateAvatar);

exports.usersRoutes = usersRoutes;
