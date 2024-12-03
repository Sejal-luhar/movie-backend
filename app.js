require('dotenv').config({path:'./.env'})
var createError = require('http-errors');
var express = require('express');
var path = require('path');
const session = require('express-session');
const passport = require('passport');
var cookieParser = require('cookie-parser');
const User = require('./models/userSchema');
var logger = require('morgan');
const LocalStrategy=require('passport-local').Strategy;

const cors = require('cors');
require('./config/db')

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(cors({
  origin: true, // Frontend URL
  credentials: true, // Allow cookies for session management
}));


// Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

// Passport Configuration
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// passport.use(new LocalStrategy(
//   async (username, password, done) => {
//     try {
//       const user = await User.findOne({ username });
//       if (!user) {
//         return done(null, false, { message: 'User not found.' });
//       }
//       const isMatch = await user.validatePassword(password); // Implement this method in your User model
//       if (!isMatch) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     } catch (err) {
//       return done(err);
//     }
//   }
// ));


app.use('/', indexRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
