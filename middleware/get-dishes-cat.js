const Dish = require('../models/dish');

module.exports = {
  getCategories: async (req, res, next) => {
    let categories = {};
    categories.starters = await Dish.find({ category: 'entrées' });
    categories.seaFood = await Dish.find({ category: 'poissons' });
    categories.specials = await Dish.find({ category: 'plats spécials' });
    categories.traditionals = await Dish.find({ category: 'plats traditionnels' });
    categories.sandwiches = await Dish.find({ category: 'sandwich' });
    categories.fastFood = await Dish.find({ category: 'fast food' });
    categories.desserts = await Dish.find({ category: 'dessert' });
    categories.drinks = await Dish.find({ category: 'boissons' });
    req.categories = categories;
    next();
  },
};
