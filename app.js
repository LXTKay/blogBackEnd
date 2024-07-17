require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose");
const cors = require("cors");

mongoose.connect(process.env.DBURL);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');
const authenticationRouter = require('./routes/authentication');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({origin: true, credentials: true}));

app.use('/API/v1/posts', postsRouter);
app.use('/API/v1/comments', commentsRouter);
app.use('/API/v1/authentication', authenticationRouter);

// Error Handling Middleware
app.use(function(req, res, next) {
  next(createError(404));
});

// Update the error handling middleware to send JSON response for all errors
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send JSON response for 404 errors
  if (err.status === 404) {
    res.status(404).json({ error: 'Not found' });
  } else {
    // send JSON response for other errors
    res.status(err.status || 500).json({ error: 'Internal Server Error' });
  }
});

module.exports = app;
