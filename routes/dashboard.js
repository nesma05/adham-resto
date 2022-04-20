const express = require('express');
const passport = require('passport');

const TeamMember = require('../models/team');
const Dish = require('../models/dish');
const User = require('../models/user');
const { getCategories } = require('../middleware/get-dishes-cat');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const router = express.Router();

//Dashbord general route
router.get('/', ensureAuthenticated, getCategories, async (req, res) => {
  try {
    const teamCount = await TeamMember.countDocuments();
    const dishesCount = await Dish.countDocuments();
    const categories = req.categories;
    const user = req.user;
    res.render('admin/dashboard', {
      layout: 'layouts/admin-layout',
      page_title: 'Géneral',
      user,
      teamCount,
      dishesCount,
      categories,
    });
  } catch (err) {
    console.log(err);
  }
});

//Dashbord user route
router.get('/user', ensureAuthenticated, (req, res) => {
  const user = req.user;
  res.render('admin/user', {
    layout: 'layouts/admin-layout',
    page_title: 'Administrateur',
    user,
  });
});

//update user route
router.put('/:id', async (req, res) => {
  let user;
  try {
    user = await User.findById(req.params.id);
    user.name = req.body.name;
    user.password = req.body.password;

    await user.save();
    res.redirect('/admin');
  } catch (err) {
    console.log(err);
    res.render('admin/user', {
      layout: 'layouts/admin-layout',
      page_title: 'Administrateur',
      user,
      errorMessage: 'Entrez toutes les informations',
    });
  }
});

//Get login page
router.get('/login', forwardAuthenticated, (req, res) => {
  res.render('login', {
    page_title: 'Connexion',
  });
});

//login handle
router.post('/login', async (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login',
    badRequestMessage: 'Entrez tes informations',
    failureFlash: true,
  })(req, res, next);
});

//logout handle
router.get('/logout', ensureAuthenticated, (req, res) => {
  req.logout();
  res.redirect('/admin/login');
});

module.exports = router;
