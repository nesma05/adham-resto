const express = require('express');

const Offer = require('../models/offer');

const { ensureAuthenticated } = require('../config/auth');
const { renderPage } = require('../helpers/renderPages');

const router = express.Router();

//Show offers route
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const offers = await Offer.find({});
    renderPage(res, req.user, offers, '');
  } catch (err) {
    console.log(err);
    res.redirect('/admin');
  }
});

//Show add offer page route
router.get('/add', ensureAuthenticated, (req, res) => {
  renderPage(res, req.user, new Offer(), '/add-offer');
});

//Create new offer route
router.post('/', async (req, res) => {
  const offer = new Offer({
    name: req.body.name,
    article1: req.body.article1,
    article2: req.body.article2,
    article3: req.body.article3,
    article4: req.body.article4,
    price: req.body.price,
  });
  try {
    await offer.save();
    res.redirect('/admin/offers');
  } catch (err) {
    console.log('error', err);
    renderPage(res, req.user, offer, '/add-offer', [], true);
  }
});

//Show edit offer route
router.get('/edit:id', ensureAuthenticated, async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    renderPage(res, req.user, offer, '/edit-offer');
  } catch (err) {
    console.log(err);
    res.redirect('/admin/team');
  }
});

//Update offer route
router.put('/:id', async (req, res) => {
  let offer;
  try {
    offer = await Offer.findById(req.params.id);
    offer.name = req.body.name;
    offer.article1 = req.body.article1;
    offer.article2 = req.body.article2;
    offer.article3 = req.body.article3;
    offer.article4 = req.body.article4;
    offer.price = req.body.price;

    await offer.save();
    res.redirect('/admin/offers');
  } catch (err) {
    console.log(err);
    if (!offer) return res.redirect('/admin/offers');
    renderPage(res, req.user, offer, '/edit-offer', [], true);
  }
});

//Delete team member route
router.delete('/:id', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    await offer.remove();
    res.redirect('/admin/offers');
  } catch (err) {
    console.log(err);
    const offers = await Offer.find({});
    renderPage(res, req.user, offers, '', [], true);
  }
});

module.exports = router;
