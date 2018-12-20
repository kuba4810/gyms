var express = require('express');
var router = express.Router();
const pg = require('pg');
var client = new pg.Client('postgresql://postgres:irondroplet@178.128.245.212:5432/postgres');
client.connect();
// Pobiera wszystkie treningi danego trenera
// ------------------------------------------------------------------------------------------------
router.get('/api/trainer/shedule/:trainer_id',(request,response)=>{
    

    console.log('Zaraz skleje jakiś harmonogram :P ');
    
    let query = `select training_id,name,date 
                 from trainers.training NATURAL JOIN trainers.trainer_shedule
                    where trainer_id = $1 ; `
    let values = [request.params.trainer_id]

    client.query(query,values)
    .then(res=>res.rows)
    .then(res=>{
        
        response.json({
            response: 'success',
            trainings : res
        })
    })
    .catch( err=>{
        response.json({
            response: 'failed',
            message : 'Wystąpił błąd ! Spróbuj ponownie później'
        })
        console.log(err);
        
    })
    /* .finally(()=>{
        console.log('Rozłączam baze...');
        client.end(err=>{
            console.log(err);
            
        });
        
    }) */
    

});

// Pobiera szczegółowe dane pojedynczego treningu
// ------------------------------------------------------------------------------------------------
router.get('/api/trainer/training/:training_id',(request,response)=>{
    
   
   console.log('Training details...');
   
    let query = `select name,date,prize,duration,note,login , first_name,last_name
    from trainers.training natural join trainers.trainer_shedule natural join kuba.user_shedule natural join kuba.users
    where training_id = $1 ; `
    let values = [request.params.training_id]

    client.query(query,values)
    .then(res=>res.rows)
    .then(res=>{

        response.json({
            response: 'success',
            training : res[0]
        })
    })
    .catch( err=>{
        console.log(err);
        
        response.json({
            response: 'failed',
            message : 'Wystąpił błąd ! Spróbuj ponownie później'
        })
    })
    /* .finally(()=>{
        console.log('Rozłączam baze...');
        client.end(err=>{
            console.log(err);
            
        });
        
    }) */
})
module.exports=router;