const express = require('express');
const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const auth = require('../midlleware/auth');
const validators = require('../midlleware/validations');

const cardsRoutes = express.Router();

cardsRoutes.get('/cards', auth, getCards);

cardsRoutes.post('/cards', validators.card, auth, express.json(), createCard);

cardsRoutes.delete('/cards/:cardId', validators.cardId, auth, deleteCardById);

cardsRoutes.put('/cards/:cardId/likes', validators.cardId, auth, likeCard);

cardsRoutes.delete(
  '/cards/:cardId/likes',
  validators.cardId,
  auth,
  dislikeCard,
);

exports.cardsRoutes = cardsRoutes;
