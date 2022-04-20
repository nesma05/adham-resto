const express = require('express');
const path = require('path');
const fs = require('fs');

const { uploadFile } = require('../middleware/team-upload');
const { ensureAuthenticated } = require('../config/auth');
const { removeImage, renderPage } = require('../helpers/renderPages');
const { showDishes } = require('../helpers/renderDishesPage');

const Dish = require('../models/dish');

const distinationPath = path.join('public', Dish.dishImagePath);

const dishesCategories = [
  'Entrées',
  'Poissons',
  'Plats spécials',
  'Plats traditionnels',
  'Sandwich',
  'Fast food',
  'Dessert',
  'Boissons',
];

const router = express.Router();

//add dishes page route
router.get('/add', ensureAuthenticated, (req, res) => {
  renderPage(res, req.user, new Dish(), '/add-dish', dishesCategories);
});

//Create new plate route
router.post('/', uploadFile('dish', distinationPath), async (req, res) => {
  const dish = new Dish({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category.toLowerCase(),
    featured: req.body.featured ? 'yes' : 'no',
    dishImageName: req.fileName,
  });
  const lastPage = res.app.get('lastPage');
  try {
    await dish.save();
    res.redirect(`/admin/dishes/${lastPage}`);
  } catch (err) {
    if (dish.dishImageName) removeImage(dish.dishImageName, distinationPath);
    console.log('error', err);
    renderPage(res, req.user, dish, '/add-dish', dishesCategories, true);
  }
});

//Dashbord edit dishes member route
router.get('/edit:id', ensureAuthenticated, async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    renderPage(res, req.user, dish, '/edit-dish', dishesCategories);
  } catch (err) {
    console.log(err);
    res.redirect('/admin/dishes/1');
  }
});

//Update dish route
router.put('/:id', uploadFile('dish', distinationPath), async (req, res) => {
  let dish;
  const fileName = req.fileName ? req.fileName : null;
  const pageNumber = res.app.get('pageNumber');
  try {
    dish = await Dish.findById(req.params.id);
    dish.name = req.body.name;
    dish.price = req.body.price;
    dish.category = req.body.category.toLowerCase();
    dish.featured = req.body.featured ? 'yes' : 'no';
    if (fileName) {
      if (dish.dishImageName) removeImage(dish.dishImageName, distinationPath);
      dish.dishImageName = fileName;
    }
    await dish.save();
    res.redirect(`/admin/dishes/${pageNumber}`);
  } catch (err) {
    console.log(err);
    if (!dish) return res.redirect('/admin/dishes/1');
    renderPage(res, req.user, dish, '/edit-dish', dishesCategories, true);
  }
});

//Delete team member route
router.delete('/:id', async (req, res) => {
  const pageNumber = res.app.get('pageNumber');
  try {
    const dish = await Dish.findById(req.params.id);
    if (dish.dishImageName) removeImage(dish.dishImageName, distinationPath);
    await dish.remove();
    res.redirect(`/admin/dishes/${pageNumber}`);
  } catch (err) {
    console.log(err);
    showDishes(res, req.user, 1, {}, true);
  }
});

//Sow dishes route
router.get('/:page', ensureAuthenticated, async (req, res) => {
  showDishes(res, req.user, req.params.page, req.query);
});

module.exports = router;
