var express = require('express');
var router = express.Router();
const {Pool} = require('pg')
// Home page route
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

module.exports = router;