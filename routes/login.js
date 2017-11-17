var express = require('express');
var router = express.Router();
var moment = require('moment');
let jwt = require('jsonwebtoken');

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
        sub : req.body.jsonContent,         
    };
    
    if(validate(key, req.body.jsonContent)){
        token = jwt.sign(myContent, key, { expiresIn: '1m' });


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








