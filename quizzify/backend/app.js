var express = require('express');
var config = require('./config');
var cors = require('cors');
const mongoose = require('mongoose');
const { auth, requiresAuth } = require('express-openid-connect');

var path = require('path');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const corsOptions = {
  origin: config.frontendBaseUrl,
  credentials: true
}
app.use(cors(corsOptions))

// Auth
const authConfig = {
  authRequired: false,
  auth0Logout: true,
  baseURL: config.backend_base_url,
  clientID: config.auth0.client_id,
  issuerBaseURL: config.auth0.issuer_base_url,
  secret: config.auth0.secret
};
app.use(auth(authConfig));
// Middleware to make the `user` object available for all views
app.use(function (req, res, next) {
  res.locals.user = req.oidc.user;
  next();
});


// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/quizzes', require('./routes/quizzes'));

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

connectToMongoDB().catch(err => console.log(err));

async function connectToMongoDB() {
  await mongoose.connect(config.mongodb_uri);
  console.log("Connected to MongoDB")
}

module.exports = app;
