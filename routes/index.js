var express = require('express');
var router = express.Router();
var User = require('../models/user'); 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});


router.post('/signup', function(req, res){
console.log('dentro de suscribirse..');
  var newUser = new User();
  newUser.userName = req.body.username;
  newUser.name = req.body.nombre;
  newUser.password = req.body.password;

  newUser.save(function (error, saved) {
    if (error) {
      console.log('cayó en un error');
      console.log(err);
    } else {
      if (saved) {
        console.log('Ingresado exitosamente el elemento')
        console.log(saved);
      }
    }
  });
})

router.post('/login', function(req, res){
  var userName = req.body.username;
  var password = req.body.password;
});

module.exports = router;