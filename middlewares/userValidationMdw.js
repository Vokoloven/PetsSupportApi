const Joi = require('joi');
const createError = require('../helpers/createError');
const {
  emailRegExp,
  passwordRegExp,
  userNameRegExp,
  phoneRegExp,
  dataRegExp,
} = require('../helpers/regExpressions');

const userRegValidationMdw = async (req, res, next) => {
  try {
    const userRequest = await req.body;
    await schemaCreate.validateAsync(userRequest);
    next();
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(createError(400, error.message));
    }
    next(error);
  }
};

const userUpdateValidationMdw = async (req, res, next) => {
  try {
    const userRequest = await req.body;
    await schemaUpdate.validateAsync(userRequest);
    next();
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(createError(400, error.message));
    }
    next(error);
  }
};

const schemaCreate = Joi.object({
  email: Joi.string().pattern(emailRegExp).min(10).max(63).required(),
  password: Joi.string().pattern(passwordRegExp).min(7).max(32).required(),
  name: Joi.string().pattern(userNameRegExp).max(100).required(),
  phone: Joi.string().pattern(phoneRegExp).min(13).max(13).required(),
  location: Joi.string().max(100).required(),
});

const schemaUpdate = Joi.object({
  email: Joi.string().pattern(emailRegExp).min(10).max(63),
  name: Joi.string().pattern(userNameRegExp).max(100),
  phone: Joi.string().pattern(phoneRegExp).min(13).max(13),
  location: Joi.string().max(100),
  birthday: Joi.string().pattern(dataRegExp).messages({
    'string.pattern.base': `Date shouldt be dd.mm.yyyy format only`,
  }),
});

module.exports = { userRegValidationMdw, userUpdateValidationMdw };
