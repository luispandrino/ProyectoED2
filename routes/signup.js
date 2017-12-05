var express = require('express');
var router = express.Router();
var moment = require('moment');
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectId;
var assert = require('assert'); 
//var crypto = require('crypto');

var url = 'mongodb://localhost:27017/test'

router.get('/', function(req, res, next) {
    var users = [];  
    //add in mongoDB
    mongo.connect(url, function(err, db){
      assert.equal(null, err); 
      var cursor = db.collection('Usuarios').find(); 
      cursor.forEach(function(doc, err){
        assert.equal(null, err); 
        users.push(doc)
      }, function(){
        db.close(); 
        res.render('index', { title: '',  Usuarios: users});
      }); 
    }); 
  });
  
  //#1 ADD 
  router.post('/', function(req, res, next){
    var users = {
      user: req.body.jsonContent,
      password: (req.body.password),     
    }
    
    mongo.connect(url, function(err, db){
      if(err){
        console.error(err); 
      }
      db.collection('Usuarios').insertOne(users, function(err, result){
        assert.equal(null, err); 
        console.log('Added'); 
        db.close(); 
        res.redirect('/'); 
      }); 
    });
  });


function validate(key, content){
    if(key || content)
        return true;
    else
        return false;
}

module.exports = router;