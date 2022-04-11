const { Card } = require('../models/card');
const ErrorBadRequest = require('../utils/ErrorBadRequest');
const ErrorNotFound = require('../utils/ErrorNotFound');

exports.getCards = (req, res) => {
  Card.find({})
    .orFail(() => {
      throw new ErrorBadRequest('Карточки не найдены.');
    })
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.statusCode === 400) {
        res.status(400).send({ message: err.errorMessage });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId, { new: true })
    .orFail(() => {
      throw new ErrorNotFound(`Карточка с ID ${req.params.cardId} не найдена.`);
    })
    .then((card) => res.send({ message: `Карточка с id ${card._id} удалена` }))
    .catch((err) => {
      if (err.statusCode === 404) {
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

exports.createCard = (req, res) => {
  const ownerId = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner: ownerId })
    .then((card) => res.send(card))
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

exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new ErrorNotFound(`Карточка с ID ${req.params.cardId} не найдена.`);
    })
    .then((card) => res.send(card))
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

exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new ErrorNotFound(`Карточка с ID ${req.params.cardId} не найдена.`);
    })
    .then((card) => res.send(card))
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
