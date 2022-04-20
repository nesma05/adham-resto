const express = require('express');
const path = require('path');
const fs = require('fs');

const { uploadFile } = require('../middleware/team-upload');
const { ensureAuthenticated } = require('../config/auth');
const { removeImage, renderPage } = require('../helpers/renderPages');

const TeamMember = require('../models/team');

const distinationPath = path.join('public', TeamMember.avatarImagePath);

const router = express.Router();

//Show team route
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const teamMembers = await TeamMember.find({});
    renderPage(res, req.user, teamMembers, '');
  } catch (err) {
    console.log(err);
    res.redirect('/admin');
  }
});

//Show add team member page route
router.get('/add', ensureAuthenticated, (req, res) => {
  renderPage(res, req.user, new TeamMember(), '/add-team');
});

//Create new team member route
router.post('/', uploadFile('avatar', distinationPath), async (req, res) => {
  const teamMember = new TeamMember({
    name: req.body.name,
    job: req.body.job,
    avatarImageName: req.fileName,
  });
  try {
    await teamMember.save();
    res.redirect('/admin/team');
  } catch (err) {
    if (teamMember.avatarImageName)
      removeImage(teamMember.avatarImageName, distinationPath);
    console.log('error', err);
    renderPage(res, req.user, teamMember, '/add-team', [], true);
  }
});

//Show edit team member route
router.get('/edit:id', ensureAuthenticated, async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    renderPage(res, req.user, teamMember, '/edit-team');
  } catch (err) {
    console.log(err);
    res.redirect('/admin/team');
  }
});

//Update team member route
router.put('/:id', uploadFile('avatar', distinationPath), async (req, res) => {
  let teamMember;
  const fileName = req.fileName ? req.fileName : null;
  try {
    teamMember = await TeamMember.findById(req.params.id);
    teamMember.name = req.body.name;
    teamMember.job = req.body.job;
    if (fileName) {
      if (teamMember.avatarImageName)
        removeImage(teamMember.avatarImageName, distinationPath);
      teamMember.avatarImageName = fileName;
    }
    await teamMember.save();
    res.redirect('/admin/team');
  } catch (err) {
    console.log(err);
    if (!teamMember) return res.redirect('/admin/team');
    renderPage(res, req.user, teamMember, '/edit-team', [], true);
  }
});

//Delete team member route
router.delete('/:id', async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    removeImage(teamMember.avatarImageName, distinationPath);
    await teamMember.remove();
    res.redirect('/admin/team');
  } catch (err) {
    console.log(err);
    const teamMembers = await TeamMember.find({});
    renderPage(res, req.user, teamMembers, '', [], true);
  }
});

module.exports = router;
