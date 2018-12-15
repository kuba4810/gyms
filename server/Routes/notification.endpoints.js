var express = require('express');
var router = express.Router();
const pg = require('pg');
var client = new pg.Client('postgresql://postgres:irondroplet@178.128.245.212:5432/postgres');


// Get all notifications for specified user
router.get('/notifications/:user_id', (request,response) => {

    var client = new pg.Client('postgresql://postgres:irondroplet@178.128.245.212:5432/postgres');
    client.connect((err)=>{
       if(!err){
        console.log('Nie udało się połączyć z bazą !: ',err);
       }
     });
     var user_id = request.params.user_id;

     var query = "SELECT * FROM kuba.notifications WHERE user_id = $1";
     var values = [user_id];

     client.query(query,values)
        .then(res=>res.rows)
        .then(res=>{
            if(res.length === 0){
                response.json({
                    notificationsCount: 0
                })
            }else{
                response.json({
                    notificationsCount : res.length,
                    notifications : res
                   });
            }
        })
        .catch(err=>{
            console.log('Wystąpił błąd, spróbuj ponownie później !',err);
        })
        .finally(()=>{
            client.end();
        })
});

module.exports=router;