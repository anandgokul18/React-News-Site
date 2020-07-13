var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testAPIRouter = require("./routes/testAPI");
//GuardianAPIs
var guardianAPIRouter = require("./routes/guardianAPI");
var guardianAPIWorldRouter = require("./routes/guardianAPIWorld");
var guardianAPIPoliticsRouter = require("./routes/guardianAPIPolitics");
var guardianAPIBusinessRouter = require("./routes/guardianAPIBusiness");
var guardianAPITechnologyRouter = require("./routes/guardianAPITechnology");
var guardianAPISportsRouter = require("./routes/guardianAPISports");
var guardianAPIDetailedRouter = require("./routes/guardianAPIDetailed");
var guardianAPISearchRouter = require("./routes/guardianAPISearch");
//NYT APIs
var nytAPIRouter = require("./routes/nytAPI");
var nytAPIWorldRouter = require("./routes/nytAPIWorld");
var nytAPIPoliticsRouter = require("./routes/nytAPIPolitics");
var nytAPIBusinessRouter = require("./routes/nytAPIBusiness");
var nytAPITechnologyRouter = require("./routes/nytAPITechnology");
var nytAPISportsRouter = require("./routes/nytAPISports");
var nytAPIDetailedRouter = require("./routes/nytAPIDetailed");
var nytAPISearchRouter = require("./routes/nytAPISearch");

var app = express();

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
app.use("/testAPI", testAPIRouter);
//Guardian APIs
app.use("/guardianAPI", guardianAPIRouter);
app.use("/guardianAPIWorld", guardianAPIWorldRouter);
app.use("/guardianAPIPolitics", guardianAPIPoliticsRouter);
app.use("/guardianAPIBusiness", guardianAPIBusinessRouter);
app.use("/guardianAPITechnology", guardianAPITechnologyRouter);
app.use("/guardianAPISports", guardianAPISportsRouter);
app.use("/guardianAPIDetailed", guardianAPIDetailedRouter);
app.use("/guardianAPISearch", guardianAPISearchRouter);
//NYT APIs
app.use("/nytAPI", nytAPIRouter);
app.use("/nytAPIWorld", nytAPIWorldRouter);
app.use("/nytAPIPolitics", nytAPIPoliticsRouter);
app.use("/nytAPIBusiness", nytAPIBusinessRouter);
app.use("/nytAPITechnology", nytAPITechnologyRouter);
app.use("/nytAPISports", nytAPISportsRouter);
app.use("/nytAPIDetailed", nytAPIDetailedRouter);
app.use("/nytAPISearch", nytAPISearchRouter);


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
