const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const mapOrderConfirmation = require('../mappers/orderConfirmation');
const mapOrder = require('../mappers/order');

module.exports.checkout = async function checkout(ctx, next) {
  try {
    const {product, phone, address} = ctx.request.body;
    const user = ctx.user;
    const order = await Order.create({
      user: user.id,
      product,
      phone,
      address,
    });
    console.log('order', order);

    await sendMail({
      to: user.email,
      subject: 'Подтвердите почту',
      locals: mapOrderConfirmation(product),
      template: 'order-confirmation',
    });

    ctx.body = {order: mapOrder(order)};
  } catch (e) {
    return ctx.throw(400, e);
  }
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const user = ctx.user;

  const orders = await Order.find({user: user.id});
  return mapOrder(orders);
};
