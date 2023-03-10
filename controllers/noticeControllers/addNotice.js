const Joi = require('joi');
const Notice = require('../../models/noticeModel');
const cloudinary = require('../../services/cloudinary/cloudinary');

const createError = require('../../helpers/createError');
const {
  userNameRegExp,
  commentRegExp,
  dataRegExp,
} = require('../../helpers/regExpressions');
const User = require('../../models/userModel');
const { date } = require('joi');
const dateFormating = require('../../helpers/dateFormating');

const schemaNotice = Joi.object({
  title: Joi.string().required().pattern(commentRegExp).min(2).max(48),
  name: Joi.string().pattern(userNameRegExp).min(2).max(16),
  birthday: Joi.string().pattern(dataRegExp).messages({
    'string.pattern.base': `Date shouldt be dd.mm.yyyy format only`,
  }),
  breed: Joi.string().pattern(userNameRegExp).min(2).max(24),
  sex: Joi.string().valid('male', 'female'),
  location: Joi.string().required(),
  price: Joi.string().required().min(1),
  avatarURL: Joi.string(),
  category: Joi.string()
    .required()
    .valid('lostFound', 'inGoodHands', 'sell')
    .default('sell'),
  comments: Joi.string().required().pattern(commentRegExp).min(8).max(120),
});

const addNotice = async (req, res, next) => {
  let avatarURL = '';
  if (!req.body?.notice) {
    throw createError(400, 'Not found request param notice');
  }
  if (req?.file) {
    const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
      folder: '/userNotices',
      transformation: [{ height: 400, crop: 'scale' }],
    });
    avatarURL = secure_url;
  }
  const { _id: owner } = req.user;
  const data = JSON.parse(req.body.notice);
  try {
    await schemaNotice.validateAsync(data);
  } catch (error) {
    throw createError(400, error);
  }
  const notice = await Notice.create({
    ...data,
    avatarURL,
    owner,
    birthday: dateFormating(data.birthday),
  });
  await User.findByIdAndUpdate(owner, { $push: { notice: notice.id } });

  return res.status(201).json(notice);
};

module.exports = addNotice;
