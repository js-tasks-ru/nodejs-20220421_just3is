const Message = require('../models/Message');
const mapMessage = require('../mappers/message');

module.exports.messageList = async function messages(ctx, next) {
  const user = ctx.user;
  const messages = await Message.find({chat: user.id}).sort({'date': 'desc'}).limit(20);
  ctx.body = {
    messages: messages.map(mapMessage),
  };
};
