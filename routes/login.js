var express = require('express');
var router = express.Router();
var moment = require('moment');
let jwt = require('jsonwebtoken');
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectId;
var assert = require('assert'); 
//var crypto = require('crypto');

var url = 'mongodb://localhost:27017/test'

router.get('/', function(req, res, next){
    res.render('login', {title: "Iniciar sesión", password:'', jsonContent:'', tokenValue:''});
});

function validate(key, content){
    if(key || content)
        return true;
    else
        return false;
}

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
 }

router.post('/', function(req, res, next){  
   key = req.body.password;
   let token = '';
   let myContent = {
        content : req.body.jsonContent,         
    };
    
    if(validate(key, req.body.jsonContent)){
        token = jwt.sign(req.body.jsonContent, key /*, { expiresIn: "2m"}*/);
        localStorage.setItem("actualToken", token);
        localStorage.setItem("key", key);

        //Esto iría al realizar una petición
        var Token = localStorage.getItem("actualToken");
        var myKey = localStorage.getItem("key");

        jwt.verify(Token, myKey, function(err, Token) {
        if (err) {
           console.log("Tiempo expirado");
           localStorage.removeItem("actualToken");     
        }
        else{
            console.log("Queda tiempo.");
        }

        mongo.connect(url, function(err, db){ 
            assert.equal(null, err); 
            

            var found = db.collection('Usuarios').findOne({'user' : req.body.jsonContent, 'password' : req.body.password}, function(err, oRetrieved){
            if(!oRetrieved){ 
              console.log("entro al if")
              console.error(err); 
              res.redirect('/'); 
            } else {
              console.log("Usuario encontrado.")

              } 
            });
          


        });
        
    });
    }
    
    else{
        res.render('login', { title: 'Iniciar sesión', myKey :'' , content:'', tokenValue:''});
        return;
    }
    // Verificar que el usuario y password estén en la base de datos
    res.render('login', { title: 'Iniciar sesión', myKey :key ,content: req.body.jsonContent, tokenValue:token});
});

module.exports = router;








