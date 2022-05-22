const Koa = require('koa');
const Router = require('koa-router');
const {createProduct, productsBySubcategory, productList, productById} = require('./controllers/products');
const {createCategory, categoryList} = require('./controllers/categories');

const app = new Koa();

app.use(require('koa-bodyparser')());
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = {error: err.message};
    } else {
      console.error(err);
      ctx.status = 500;
      ctx.body = {error: 'Internal server error'};
    }
  }
});

const router = new Router({prefix: '/api'});

router.post('/categories', createCategory);
router.get('/categories', categoryList);
router.post('/products', createProduct);
router.get('/products', productsBySubcategory, productList);
router.get('/products/:id', productById);

app.use(router.routes());

module.exports = app;
