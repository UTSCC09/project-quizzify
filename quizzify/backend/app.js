var http = require('http');
var fs = require('fs');

var express = require('express');
var cors = require('cors');
const mongoose = require('mongoose');
const socketIO = require('socket.io')

var path = require('path');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const dotenv = require("dotenv");
if (process.env.NODE_ENV === "production")
  dotenv.config();
else
  dotenv.config({path: '.env.development.local'});

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

const port = process.env.PORT ?? '5000'

// Sockets
const server = http.createServer(app)
const io = socketIO(server, {
  cors: corsOptions
})
const { 
  socketLog, 
  eventNames, 
  utils, host, player 
} = require('./sockets/game')(io)

io.on("connection", (socket) => {
  socketLog(socket, "Connected")

  // Utils
  socket.on(eventNames.UTILS.disconnecting, utils.disconnecting)
  socket.on(eventNames.UTILS.disconnect, utils.disconnect)
  
  // Host
  socket.on(eventNames.HOST.create, host.create)
  socket.on(eventNames.HOST.start, host.start)
  socket.on(eventNames.HOST.nextQuestion, host.nextQuestion)
  
  // Player
  socket.on(eventNames.PLAYER.join, player.join)
  socket.on(eventNames.PLAYER.answer, player.answer)
})


server.listen(port, function (err) {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", port);
});

