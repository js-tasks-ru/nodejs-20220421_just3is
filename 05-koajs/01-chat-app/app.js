const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const subscribers = new Set();

router.get('/subscribe', async (ctx, next) => {
  const message = await new Promise((resolve, reject) => {
    subscribers.add(resolve);

    ctx.res.on('close', () => {
      subscribers.delete(resolve);
      resolve();
    });
  });

  ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
  const {message} = ctx.request.body;

  if (!message) return ctx.throw(400, 'Missed or empty required field "message"');

  subscribers.forEach((resolve) => resolve(message));

  subscribers.clear();

  ctx.body = 'Message have been published';
});

app.use(router.routes());

module.exports = app;
