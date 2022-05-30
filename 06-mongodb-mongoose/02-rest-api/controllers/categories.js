const Category = require('../models/Category');
const mapCategory = require('../mappers/category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find();
  ctx.body = {categories: categories.map(mapCategory)};
};

module.exports.createCategory = async function createCategory(ctx, next) {
  const {title, subcategories} = ctx.request.body;
  const category = await Category.create({
    title,
    subcategories,
  });
  ctx.body = mapCategory(category);
};
