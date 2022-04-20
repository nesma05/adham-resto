const express = require('express');
const router = express.Router();

const TeamMember = require('../models/team');
const Dish = require('../models/dish');
const Offer = require('../models/offer');
const { getCategories } = require('../middleware/get-dishes-cat');

//Index page route
router.get('/', async (req, res) => {
  try {
    const teamMembers = await TeamMember.find({});
    const featuredDishes = await Dish.find({ featured: 'yes' });
    res.render('index', {
      page_title: 'Accueil',
      teamMembers,
      featuredDishes,
      user: req.user,
    });
  } catch (err) {
    console.log(err);
    res.render('index', {
      page_title: 'Accueil',
    });
  }
});

//Menu page route
router.get('/menu', getCategories, async (req, res) => {
  const categories = req.categories;
  const offers = await Offer.find({});
  try {
    res.render('menu', {
      page_title: 'Menu',
      categories,
      offers,
    });
  } catch (err) {
    console.log(err);
    res.render('index', {
      page_title: 'Menu',
    });
  }
});

//SErvices route
router.get('/services', (req, res) => {
  res.render('services', { page_title: 'Services' });
});

module.exports = router;
