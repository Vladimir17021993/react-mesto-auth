const { celebrate, Joi, Segments } = require('celebrate');
const validator = require('validator');

const register = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().custom((value, helper) => {
      if (!validator.isEmail(value)) {
        return helper.error('string.notEmail');
      }
      return value;
    }).messages({
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

module.exports = {
  register,
};
