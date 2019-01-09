var express = require('express');
var router = express.Router();
const {Pool} = require('pg');
const pg = require('pg');
const client = new pg.Client('postgresql://postgres:irondroplet@178.128.245.212:5432/postgres');
client.connect();
// Mark message as READ 
// ------------------------------------------------------------------------------------------------
router.get('/markMessageAsRead/:messageId', function(req, res) {
    const messageId = req.params.messageId;
    console.log(messageId);
    var pool = new Pool({
        user: 'postgres',
        host: '178.128.245.212',
        database: 'postgres',
        password: 'irondroplet',
        port: 5432,
    });

    query = `UPDATE kuba.messages SET is_read = true WHERE message_id = ${messageId}`;
   
    pool.query(query, (err,response) => {
        console.log(typeof(err)=='undefined')

        if(typeof(err)=='undefined'){
            res.json({
                response: "Success"
            });      
        }
        else{
            res.json({
                response: "Failed"
            });
        }
        pool.end();
    });

});

// Delete message
// ------------------------------------------------------------------------------------------------
router.post("/deleteMessage",(req,res)=>{
    var data = req.body;
    var query = '';
    
    console.log("Dane w zapytaniu: ", req.body);
    var pool = new Pool({
        user: 'postgres',
        host: '178.128.245.212',
        database: 'postgres',
        password: 'irondroplet',
        port: 5432,
    });

    switch(data.userType){
        case 'sender':
            query = `UPDATE kuba.messages SET sender_deleted = true WHERE message_id = ${data.message_id}`
        break;

        case 'receiver':
            query = `UPDATE kuba.messages SET receiver_deleted = true WHERE message_id = ${data.message_id}`
        break;
    }

    console.log("Utworzone zapytanie: ",query);
    pool.query(query,(err,response)=>{

        if(typeof(err)=='undefined'){
            res.json({
                response: "Success"
            });      
        }
        else{
            console.log(err);
            res.json({
                response: "Failed"
            });
        }
        pool.end();
    });
    
});

// Get all messages
// ------------------------------------------------------------------------------------------------
router.get('/getMessages/:user_id/:type',function(request,response){
    console.log('GetMessages...')
    
    // Łączenie z bazą 
    var client = new pg.Client('postgresql://postgres:irondroplet@178.128.245.212:5432/postgres');
    client.connect((err)=>{
      
     });

    //  Pobiera parametry żądania
    var user_id = request.params.user_id;
    var type = request.params.type;
    
    // Sprawdza typ użytkownika i ustala odpowiednie nazwy schematów, tabel i kolumn
     let table_name = (type === 'user') ? 'user_messages' : 'trainer_messages';
     let schema_name = (type === 'user') ? 'kuba' : 'trainers';
     let id_name = (type === 'user') ? 'user_id' : 'trainer_id';
     let table_for_login = (type === 'user') ? 'users' : 'trainer';
    
    var query = `SELECT m.*, ${table_name}.* ,
    (select login from kuba.users where user_id = (select user_id from kuba.user_messages where type='sender' and message_id = m.message_id)) as "user_sender",
    (select login from trainers.trainer where trainer_id = (select trainer_id from trainers.trainer_messages where type='sender' and message_id = m.message_id)) as "trainer_sender"	
                 FROM  ${schema_name}.${table_name} natural join kuba.messages m 
                 WHERE ${id_name} = $1 and sender_deleted = false
                 ORDER BY sending_date desc`

    // var query = `SELECT message_id ,login ,sender,receiver, sending_date,message_content,is_read, receiver_deleted,sender_deleted 
    //             FROM kuba.users  INNER JOIN kuba.messages ON( users.user_id = messages.sender)
    //             WHERE (receiver = $1 and receiver_deleted = false) OR (sender =$1 and sender_deleted = false)  ORDER BY sending_date DESC;`
    var values = [user_id];

    client.query(query,values)
    .then(res=>res.rows)
    .then(res=>{
        console.log('Pobrane wiadomości: ',res);        
        response.json(res);
    })
    .catch(err=>{
        console.log('Wystąpił błąd: ',err);
    })
    .finally(()=>{
        client.end();
    })



});


// Otrzymuje message_id i sprawdza typ użytkownika który jest odbiorcą oraz zwraca jego id
router.get('/api/message/sender-data/:message_id',(request,response)=>{
    console.log('sender-data...');
    
    let message_id = request.params.message_id;
    client.query(`SELECT um.*,login FROM kuba.user_messages um natural join kuba.users
                  WHERE message_id = $1 and type='sender'`,[message_id])
    .then(res=>{
        if(res.rows.length > 0){
            response.send({
                response: 'success',
                data:{
                    user_id : res.rows[0].user_id,
                    user_type : 'user',
                    login : res.rows[0].login
               }
            })
            return Promise.reject('Done');
        }else{
            return client.query(`SELECT tm.*,login 
                                 FROM trainers.trainer_messages tm natural join trainers.trainer
                                 WHERE message_id = $1 and type='sender' `,[message_id])
        }
    })
    .then(res=>{
        response.send({
            response: 'success',
            data: {
                 user_id : res.rows[0].trainer_id,
                 user_type : 'trainer',
                 login : res.rows[0].login
           }
        })
    })
    .catch(err=>{
       if(err !== 'Done'){
        console.log('Wystąpił błąd: ',err);
        response.send({
            response: 'failed'
        })
       }
        
    })
})

// Otrzymuje login i sprawdza typ użytkownika który jest odbiorcą oraz zwraca jego id
router.get('/api/message/sender-login-data/:user_login',(request,response)=>{
    
    
    let login = request.params.user_login;
    console.log('sender-data... ',login);
    client.query(`SELECT login,user_id FROM kuba.users
                  WHERE login = $1;`,[login])
    .then(res=>{
        if(res.rows.length > 0){
            console.log('Znalazłem usera');
            
            response.send({
                response: 'success',
                data:{
                    user_id : res.rows[0].user_id,
                    user_type : 'user',
                    login : res.rows[0].login
               }
            })
            return Promise.reject('Done');
        }else{
            return client.query(`SELECT login ,trainer_id
                                 FROM  trainers.trainer
                                 WHERE login = $1 `,[login])
        }
    })
    .then(res=>{
        console.log('Znalazłem trenera');
        response.send({
            response: 'success',
            data: {
                 user_id : res.rows[0].trainer_id,
                 user_type : 'trainer',
                 login : res.rows[0].login
           }
        })
    })
    .catch(err=>{
       if(err !== 'Done'){
        console.log('Wystąpił błąd: ',err);
        response.send({
            response: 'failed'
        })
       }
        
    })
})
module.exports = router;