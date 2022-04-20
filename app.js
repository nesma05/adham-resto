const path = require('path');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const colors = require('colors');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo');

const connectDB = require('./config/db');

//Load evirement variables
dotenv.config({ path: path.join(__dirname, '/config/.env') });

const app = express();

//Routes
const indexRoute = require('./routes/index');
const dashboardRoute = require('./routes/dashboard');
const teamRoute = require('./routes/team');
const dishesRoute = require('./routes/dishes');
const offersRoute = require('./routes/offers');

//Passport config
require('./config/passport')(passport);

//Database connection
connectDB();

//Static pages
app.use(express.static('public'));
app.set('layout', 'layouts/main-layout');

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Method override
app.use(methodOverride('_method'));

//bodyparsers
app.use(express.urlencoded({ extended: false }));

//Session
app.use(
  session({
    secret: process.env.SESSION_SEC,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI, autoRemove: 'native' }),
  }),
);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Flash
app.use(flash());

//local variables
app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  next();
});

//Routes
app.use('/', indexRoute);
app.use('/admin', dashboardRoute);
app.use('/admin/team', teamRoute);
app.use('/admin/dishes', dishesRoute);
app.use('/admin/offers', offersRoute);

app.get('*', (req, res) => {
  res.render('404', { page_title: 'Page 404' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server Started at PORT ${PORT}`.blue.bold));
