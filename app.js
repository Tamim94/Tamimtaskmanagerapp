const config = require('./config.js');
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const users = require('./app/users');
const tasks = require('./app/tasks');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.json(  {
    message: 'it works !!'
  });
});
app.use('/', [users,tasks]);


app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function(err, req, res, next) {
  let errorMessage = {};
  errorMessage.message = err.message;
  errorMessage.error = req.app.get('env')== 'development' ? err : {};
  errorMessage.status = err.status || 500;

  res.status(errorMessage.status).json(errorMessage);
});

module.exports = app;