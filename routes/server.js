const mongo = require('mongodb').MongoClient;
/*var edge = require('edge.js');*/
const client = require('socket.io').listen(3010).sockets;
var express = require('express');
var router = express.Router();

//CAPA DE PROCESOS ALTERNOS

/*var Cifrar = edge.func({
  assemblyFile: "Libreria.dll",
  typeName: "Libreria.Sdes",
  methodName: "Cifrar"
});
var Descifrar = edge.func({
    assemblyFile: "Libreria.dll",
    typeName: "Libreria.Sdes",
    methodName: "Descifrar"
  });*/

//obtiene pagina principal del chat
router.get('/', function(req, res, next) {
  res.render('ChatIndex', { title: 'Express' });
});

// Connect to mongo
mongo.connect('mongodb://127.0.0.1/mongochat', function(err, db){
    if(err){
        throw err;
    }

    console.log('MongoDB connected...');

    // Connect to Socket.io
    client.on('connection', function(socket){
        let chat = db.collection('chats');

        // Create function to send status
        sendStatus = function(s){
            socket.emit('status', s);
        }

        // Get chats from mongo collection
        chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
            if(err){
                throw err;
            }

            // Emit the messages
            /*Descifrar(res, function (error, result) {
                if(error) throw error;
                res = result;
              });*/
            socket.emit('output', res);
        });

        // Handle input events
        socket.on('input', function(data){
            let name = data.name;
            let message = data.message;


           /* Cifrar(message, function (error, result) {
                if(error) throw error;
                message = result;
              });*/

            // Check for name and message
            if(name == '' || message == ''){
                // Send error status
                sendStatus('Porfavor ingresar un nombre y mensaje');
            } else {
                // Insert message
                chat.insert({name: name, message: message}, function(){
                    client.emit('output', [data]);
                    console.log(data);

                    // Send status object
                    sendStatus({
                        message: 'Mensaje Enviado',
                        clear: true
                    });
                });
            }
        });

        // Handle clear
        socket.on('clear', function(data){
            // Remove all chats from collection
            chat.remove({}, function(){
                // Emit cleared
                socket.emit('cleared');
            });
        });
    });
});

module.exports = router;