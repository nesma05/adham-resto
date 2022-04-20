const path = require('path');
const fs = require('fs');

const TeamMember = require('../models/team');
const Offer = require('../models/offer');

//Check wich page is rendered
const checkForPageTitle = (page, model, renderVars) => {
  if (page == '/add-team') return (renderVars.page_title = 'Equipe/Ajouter');
  if (page == '/edit-team') return (renderVars.page_title = 'Equipe/Modifier');
  if (page == '/add-dish') return (renderVars.page_title = 'Plats/Ajouter');
  if (page == '/edit-dish') return (renderVars.page_title = 'Plats/Modifier');
  if (page == '/add-offer') return (renderVars.page_title = 'Offres/Ajouter');
  if (page == '/edit-offer') return (renderVars.page_title = 'Offres/Modifier');
  if (page == '' && (model instanceof TeamMember || 'job' in model[0]))
    return (renderVars.page_title = 'Equipe');
  if (page == '' && (model instanceof Offer || 'article1' in model[0]))
    return (renderVars.page_title = 'Offres');
};

const checkForError = (page, renderVars, hasError) => {
  if (hasError && page.includes('-')) {
    return (renderVars.errorMessage = 'Entrez toutes les informations');
  }
  if (hasError) return (renderVars.errorMessage = 'Erreur lors de la suppression');
};

const checkForModel = (page, renderVars, model, category) => {
  if (model instanceof TeamMember) return (renderVars.teamMember = model);
  if (page == '' && 'job' in model[0]) return (renderVars.teamMembers = model);
  if (model instanceof Offer) return (renderVars.offer = model);
  if (page == '' && 'article1' in model[0]) return (renderVars.offers = model);
  if (page.includes('-dish')) {
    renderVars.dish = model;
    renderVars.dishesCategories = category;
    return renderVars;
  }
};

const removeImage = (fileName, distinationPath) => {
  fs.unlink(path.join(distinationPath, fileName), (err) => {
    if (err) console.error(err);
  });
};

const renderPage = (res, user, model, page, category = [], hasError = false) => {
  let renderVars = {
    layout: 'layouts/admin-layout',
    user,
  };

  checkForPageTitle(page, model, renderVars);
  checkForModel(page, renderVars, model, category);
  checkForError(page, renderVars, hasError);

  if (model instanceof TeamMember || model[0] instanceof TeamMember)
    return res.render(`admin/team${page}`, renderVars);
  if (model instanceof Offer || model[0] instanceof Offer)
    return res.render(`admin/offers${page}`, renderVars);

  return res.render(`admin/dishes${page}`, renderVars);
};

module.exports = {
  removeImage,
  renderPage,
};
