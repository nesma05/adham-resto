const Dish = require('../models/dish');

const showDishes = async (res, user, page, queryName, hasError = false) => {
  let renderVars = {
    layout: 'layouts/admin-layout',
    page_title: 'Plats',
    user,
  };
  renderVars.queryValue = {};
  if (queryName.name) {
    renderVars.queryValue.name = new RegExp(queryName.name, 'i');
  }
  const perPage = 5;
  renderVars.current = page || 1;
  res.app.set('pageNumber', page);
  renderVars.itemSkiped = perPage * renderVars.current - perPage;
  try {
    renderVars.dishes = await Dish.find(renderVars.queryValue)
      .skip(renderVars.itemSkiped)
      .limit(perPage);
    renderVars.count = await Dish.countDocuments();
    renderVars.pages = Math.ceil(renderVars.count / perPage);
    renderVars.queryValue = queryName;
    if (hasError) renderVars.errorMessage = 'Erreur lors de la suppression';
    res.app.set('lastPage', renderVars.pages);
    res.render('admin/dishes', renderVars);
  } catch (err) {
    console.log(err);
    res.redirect('/admin');
  }
};

module.exports = { showDishes };
