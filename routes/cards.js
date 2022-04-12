const express = require('express');
const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const auth = require('../midlleware/auth');

const cardsRoutes = express.Router();

cardsRoutes.get('/cards', auth, getCards);

cardsRoutes.post('/cards', auth, express.json(), createCard);

cardsRoutes.delete('/cards/:cardId', auth, deleteCardById);

cardsRoutes.put('/cards/:cardId/likes', auth, likeCard);

cardsRoutes.delete('/cards/:cardId/likes', auth, dislikeCard);

exports.cardsRoutes = cardsRoutes;
