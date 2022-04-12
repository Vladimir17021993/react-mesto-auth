const { Card } = require('../models/card');
const { ErrorBadRequest, ErrorWrongUser, ErrorNotFound } = require('../utils/ErrorBadRequest');

exports.getCards = (req, res, next) => {
  Card.find({})
    .orFail(() => {
      throw new ErrorBadRequest('Карточки не найдены.');
    })
    .then((cards) => res.send(cards))
    .catch(next);
};

exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new ErrorNotFound(`Карточка с ID ${req.params.cardId} не найдена.`);
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ErrorWrongUser('Нельзя удалять чужие карточки');
      }
      Card.findByIdAndDelete(req.params.cardId).then(() => {
        res.send({ message: `Карточка с id ${card._id} удалена` });
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const errorMessage = 'Переданы неверные данные';
        next(new ErrorBadRequest(errorMessage));
      } else {
        next(err);
      }
    });
};

exports.createCard = (req, res, next) => {
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
        next(new ErrorBadRequest(errorMessage));
        return;
      }
      if (err.name === 'CastError') {
        const errorMessage = 'Переданы неверные данные';
        next(new ErrorBadRequest(errorMessage));
      } else {
        next(err);
      }
    });
};

exports.likeCard = (req, res, next) => {
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
      if (err.name === 'CastError') {
        const errorMessage = 'Переданы неверные данные';
        next(new ErrorBadRequest(errorMessage));
      } else {
        next(err);
      }
    });
};

exports.dislikeCard = (req, res, next) => {
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
      if (err.name === 'CastError') {
        const errorMessage = 'Переданы неверные данные';
        next(new ErrorBadRequest(errorMessage));
      } else {
        next(err);
      }
    });
};
