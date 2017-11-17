var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var app = express();


var index = require('./routes/index');
var users = require('./routes/users');
var chat = require('./routes/server');
var login = require('./routes/login');
var registro = require('./routes/signup');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/chat',chat);
app.use('/login', login);
app.use('/signup', login);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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


app.get('/', function (req, res) {
  res.render('index');
  });
  
  app.get('/secret', isLoggedIn, function (req, res) {
  res.render('secret');
  });
  
  // AUTH Routes
  
  //sign up page
  app.get("/register", function(req, res) {
  res.render("register.hjs");
  });
  
  // register post
  app.post("/register", function(req,res){
  User.register(new User({username: req.body.username}), req.body.password, function(err, user){
      if(err){
          console.log(err);
          return res.render('register');
      }
      passport.authenticate("local")(req, res, function(){
         res.redirect("/secret"); 
      });
  });
  });
  // LOGIN
  // render login form
  /*app.get("/login", function(req, res) {
  res.render("login"); 
  });
  //login logic
  //middleware
  app.post("/login", passport.authenticate("local", {
  successRedirect: "/secret",
  failureRedirect: "/login" 
  }), function(req, res) {
  
  });*/
  
  app.get("/logout",function(req, res) {
  req.logout();
  res.redirect("/");
  });
  
  function isLoggedIn(req,res,next) {
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect("/login");
  }

module.exports = app;
