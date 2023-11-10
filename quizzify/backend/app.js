var express = require('express');
var cors = require('cors');
const mongoose = require('mongoose');

var path = require('path');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const dotenv = require("dotenv");
dotenv.config();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const corsOptions = {
  origin: process.env.FRONTEND_BASE_URL,
  credentials: true
}
app.use(cors(corsOptions))

// Routes
app.use('/', require('./routes/index'));
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
  res.status(err.status || 500).json(err);
  // res.render('error');
});

connectToMongoDB().catch(err => console.log(err));

async function connectToMongoDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB")
}

module.exports = app;
