let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require('cors');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let authRouter = require('./routes/auth');
let mapRouter = require('./routes/map');
let paymentRouter = require('./routes/payment');
let managerAuthRouter = require('./routes/manager/auth')
let managerParking = require('./routes/manager/parking')
let db = require('./routes/db');
let managerDB = require('./routes/manager/db');

let app = express();

db.init().then(err => {
  console.log("User DB Connected!");
  // console.log(db.getNearbyParkingLots());
});

managerDB.init().then(err => {
  console.log("Manager DB Connected!");
  // console.log(db.getNearbyParkingLots());
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/map', mapRouter);
app.use('/payment', paymentRouter);
app.use('/manager/auth', managerAuthRouter);
app.use('/manager/parking', managerParking);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
