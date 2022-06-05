const {v4: uuid} = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const token = uuid();
  const {email, displayName, password} = ctx.request.body;

  const user = await User.create({
    email,
    displayName,
    verificationToken: token,
  });
  await user.setPassword(password);
  await user.save();

  await sendMail({
    template: 'confirmation',
    locals: {token},
    to: email,
    subject: 'Подтвердите почту',
  });

  ctx.status = 200;
  ctx.body = {status: 'ok'};
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;

  const user = await User.findOne({verificationToken});
  if (!user) {
    return ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
  }
  user.verificationToken = undefined;
  await user.save();

  const token = ctx.login(user);

  ctx.status = 200;
  ctx.body = {token};
};
