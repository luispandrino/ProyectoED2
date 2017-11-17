var express = require('express');
var router = express.Router();
var moment = require('moment');

router.get('/', function(req, res, next){
    res.render('signup', {title: "Registrarse", password:'', jsonContent:''});
});
function validate(key, content){
    if(key || content)
        return true;
    else
        return false;
}
router.post('/', function(req, res, next){  
   password = req.body.password;
   user = req.body.jsonContent;

   res.render('signup', { title: 'Registro', myKey: password ,content: user});
   return;
   //insertar registro a la base de datos
});

module.exports = router;