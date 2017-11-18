const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(3010).sockets;
var express = require('express');
var router = express.Router();
var users  = {};

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
            socket.emit('output', res);
        });

        socket.on('send message', function(data, callback){
            var msg = data.trim();
            if(msg.substr(0,3) === '/w '){
                msg = msg.substr(3);
                var ind = msg.indexOf(' ');
                if(ind !== -1)
                {
                 var name = msg.substr(0,ind)
                 var msg = msg.substr(ind + 1);
                 if(name in users)
                 {
                     var newMsg = new Chat({msg: msg, nick: socket.nickname});
                     newMsg.save(function(err){
                         if(err){
                             throw err;
                         }
                         users[name].emit('MensajePrivado', {msg: msg, nick: socket.nickname});
                         console.log('Mensaje Privado');
             
                     });
                     
     
                 }else{
                     callback('error ingrsar un usuario valido')
                 }
                 
                }else{
                    callback('Error porfavor ingresar un mensaje a su destinatario')
     
                }
                
     
            }else{
             var newMsg = new Chat({msg: msg, nick: socket.nickname});
             newMsg.save(function(err){
                 if(err){
                     throw err;
                 }
                 io.sockets.emit('new message', {msg: msg, nick: socket.nickname});
     
             });
             
            }
             
         });

        // Handle input events
        socket.on('input', function(data){

            let name = data.name;
            let message = data.message;

            // Check for name and message
            if(name == '' || message == ''){
                // Send error status
                sendStatus('Porfavor ingresar un nombre y mensaje');
            } else {
                socket.name = data;
                users[socket.name] = socket;
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