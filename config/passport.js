const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Load User Model
const User = require('../models/user');

module.exports = (passport) => {
  passport.use(
    new localStrategy({ usernameField: 'name' }, async (name, password, done) => {
      try {
        const user = await User.findOne({ name });
        if (!user) return done(null, false, { message: 'Nom incorrect' });
        if (await user.checkPassword(password)) return done(null, user);
        done(null, false, { message: 'Mot de passe incorrect' });
      } catch (err) {
        done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
