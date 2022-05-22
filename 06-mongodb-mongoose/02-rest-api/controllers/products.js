const ObjectId = require('mongoose').Types.ObjectId;
const Product = require('../models/Product');
const mapProduct = require('../mappers/product');

module.exports.createProduct = async function createProduct(ctx, next) {
  const {title, images, category, subcategory, price, description} = ctx.request.body;
  const product = await Product.create({
    title,
    images,
    category,
    subcategory,
    price,
    description,
  });
  ctx.body = mapProduct(product);
};

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  const products = await Product.find({subcategory});

  ctx.body = {
    products: products.map(mapProduct),
  };
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();

  ctx.body = {
    products: products.map(mapProduct),
  };
};

module.exports.productById = async function productById(ctx, next) {
  const {id} = ctx.params;

  if (!ObjectId.isValid(id)) {
    return ctx.throw(400, 'Invalid product id');
  }

  const product = await Product.findById(id);

  if (!product) {
    return ctx.throw(404, `Product not found by id ${id}`);
  }

  ctx.body = {
    product: mapProduct(product),
  };
};

