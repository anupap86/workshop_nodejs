var createError = require('http-errors');
const express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config()
require('./db.js');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var loginRouter = require('./routes/login.js');
var registerRouter = require('./routes/register.js');
var approveRouter = require('./routes/approve.js');
var productRouter = require('./routes/products.js');
var orderRouter = require('./routes/orders.js')
var app = express();

const verifyToken = require('./middleware/jwt_decode.js')
const isAdmin = require('./middleware/isAdmin.js')
const hasApprove = require('./middleware/hasApprove.js')


//set up cors
app.use(cors());



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users',usersRouter);

app.use('/api/v1',loginRouter);
app.use('/api/v1',registerRouter);

app.use('/api/v1/users', verifyToken, isAdmin, approveRouter);      // เฉพาะ admin
app.use('/api/v1/', verifyToken, hasApprove, productRouter);  // ทุกคนที่ approve แล้ว
app.use('/api/v1/', verifyToken, hasApprove, orderRouter);   // ทุกคนที่ approve แล้ว
  

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
