const { celebrate, Joi, Segments } = require('celebrate');
// eslint-disable-next-line no-unused-vars
const { required } = require('joi');
const validator = require('validator');

const register = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'Имя не может быть короче 2ух символов',
      'string.max': 'Имя не может быть длинее 30 символов',
    }),
    about: Joi.string().min(2).max(30).messages({
      'string.min': 'Описание не может быть короче 2ух символов',
      'string.max': 'Описание не может быть длинее 30 символов',
    }),
    avatar: Joi.string()
      .custom((value, helper) => {
        if (!validator.isURL(value, { require_protocol: true })) {
          return helper.error('string.notUrl');
        }
        return value;
      })
      .messages({
        'any.required': 'Url не указан.',
        'string.notUrl': 'Url некорректный.',
      }),
    email: Joi.string()
      .required()
      .custom((value, helper) => {
        if (!validator.isEmail(value)) {
          return helper.error('string.notEmail');
        }
        return value;
      })
      .messages({
        'any.required': 'Email не указан',
        'string.notEmail': 'Email некорректный',
      }),
    password: Joi.string().required().min(6).max(30)
      .messages({
        'any.required': 'Пароль не указан',
        'string.min': 'Пароль должен быть больше 5 символов',
        'string.max': 'Пароль не должен быть больше 30 символов',
      }),
  }),
});

const url = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string()
      .custom((value, helper) => {
        if (!validator.isURL(value, { require_protocol: true })) {
          return helper.error('string.notUrl');
        }
        return value;
      })
      .messages({
        'any.required': 'Url не указан.',
        'string.notUrl': 'Url некорректный.',
      }),
  }),
});

const cardId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex()
      .messages({
        'any.required': 'Id не указан.',
        'string.lenght': 'Id должен быть 24 символа',
      }),
  }),
});

const userId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().required().length(24).hex()
      .messages({
        'any.required': 'Id не указан.',
        'string.lenght': 'Id должен быть 24 символа',
      }),
  }),
});

const card = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Имя не может быть короче 2ух символов',
        'string.max': 'Имя не может быть длинее 30 символов',
      }),
    link: Joi.string()
      .required()
      .custom((value, helper) => {
        if (!validator.isURL(value, { require_protocol: true })) {
          return helper.error('string.notUrl');
        }
        return value;
      })
      .messages({
        'any.required': 'Url не указан.',
        'string.notUrl': 'Url некорректный.',
      }),
  }),
});

module.exports = {
  register,
  url,
  cardId,
  userId,
  card,
};
