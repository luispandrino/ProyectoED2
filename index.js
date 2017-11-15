const mongo = require('mongodb').MongoClient;
const Client = require('socket.io').listen(3000).sockets;

//coneccion a mongo 
mongo.connect('mongodb://localhost/proyectoED2', function(err, db){
    if(err){
        throw err;
    }


    console.log('Mongodb Conectado......');

    //Coneccion a Socket.io
    Client.on('connection', function(Socket){
        let chat = db.collection('chats');


        ///Crear funcion para mandar estados 
        sendStatus = function(s){
            Socket.emit('status',s);
        }

        //Obtener Chats de mongo 
        chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
            if(err){
                throw err;
            }

            //Emitir
            Socket.emit('output', res);
        });

        //Manejar eventos de entrada 
        Socket.on('input',function(data){
            let name = data.name;
            let mensaje = data.mensaje;

            //Revisar nombre y mensaje 
            if(name === '' || mensaje === ''){
                //Mando estado de error
                sendStatus('Porfavor ingresar un mensaje y nombre');
            }else{
                //Insertar mensaje a la base de datos 
                chat.insert({name: name , mensaje: mensaje}, function(){
                    Client.emit('output',[data]);

                    //mandar status 
                    sendStatus({
                        mensaje: 'Mensaje enviado',
                        clear: true 
                    });
                });
            }


        });

        //manejado de borrado 
        Socket.on('clear', function(data){
             //remover todos los chats
             chat.remove({},function(){
                 //emitir que se elimino 
                 Socket.emit('cleared');
             });
        });
    });
});