require('dotenv').config();
var express = require('express');
var path = require('path');

// var cookieParser = require('cookie-parser');
// var SQL = require('SQL');
var createError = require('http-errors');
var session = require("express-session");
// for storing sessions in MySQL server
// var MySQLStore = require('express-SQL-session')(session);

// for storing sessions in MongoDB
var MongoStore = require("connect-mongo")(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var ridesRouter = require('./routes/rides');
var locationRouter = require('./routes/location');
var analyticsRouter = require('./routes/analytics');
var carRouter = require('./routes/car');

var app = express();

// the MongoDB connection string
var MongoSessionURL = "mongodb://localhost:27017/sessions";

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(cookieParser());
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB session option
app.use(session({
    cookieName: 'session',
    secret: 'cmpe_226_team_8',
    resave: false,
    saveUninitialized: false,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 6 * 1000,
    store: new MongoStore({
        url: MongoSessionURL
    })
}));

app.use('/api/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/rides', ridesRouter);
app.use('/api/locations', locationRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/car', carRouter);

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
