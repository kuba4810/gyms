var express = require('express');
var router = express.Router();
const {Pool} = require('pg');
const pg = require('pg');

var client = new pg.Client('postgresql://postgres:irondroplet@178.128.245.212:5432/postgres');
client.connect((err)=>{
    console.log(err);
}); 
// Pobiera listę wszystkich siłowni
router.get('/api/gyms',(request,response)=>{

    var pool = new Pool({
        user: 'postgres',
        host: '178.128.245.212',
        database: 'postgres',
        password: 'irondroplet',
        port: 5432,
    });

    let query = 'SELECT * FROM kuba.gyms';

    try{
        pool.query(query,(err,res)=>{
            response.json(res.rows);
        });
    }
    catch(err){
        response.json({
            response: 'failed'
        })
    }
  

});
// ----------------------------------------------------------------------------------------

// Pobiera szczegółowe dane jednej siłowni
// ----------------------------------------------------------------------------------------
router.get('/api/gym/:gym_id',(request,response)=>{

    // Pusty obiekt przygotowany pod odbiór danych
    var responseData={
        gymData:{},
        offers:[],
        packages:[],
        photos : []
    }


    // Pierwsze zapytanie pobierające podstawowe dane siłowni
    var gymData= client.query(`SELECT * FROM kuba.gyms NATURAL JOIN kuba.opening_hours NATURAL JOIN kuba.gym_stats 
    WHERE gym_id=${request.params.gym_id};`);    
    
    // Po wykonaniu zapytania dane są dodawane do przygotowanego obiektu.
    // W kolejnym kroku wywoływane jest następne zapytanie
    gymData.then( res=>{
        console.log("Pierwszy select: ",res.rows);
        responseData = Object.assign({},responseData,{gymData:res.rows[0]});
        return client.query(`SELECT * FROM kuba.gym_offer WHERE gym_id=${request.params.gym_id}`)
    }).then(res=>{
        console.log("Drugi select: ", res.rows);
        responseData = Object.assign({},responseData,{offers:[...res.rows]});

        return client.query(`SELECT * FROM kuba.gym_packages WHERE gym_id=${request.params.gym_id}`)
    }).then((res)=>{
        console.log("Trzeci select: ", res.rows);
        responseData = Object.assign({},responseData,{packages:[...res.rows]});
        // Po wykonaniu ostatniego zapytania dane są zwracane do klienta
       response.json({
           response: 'success',
           data: responseData
       });
    }) .catch(err=>{
        console.log("Wystąpił błąd: ",err);
        response.json({
            response: 'failed'
        })
    });

    });
       
  
// -----------------------------------------------------------------------------------------
// Tworzy nową siłownię
router.post('/api/gym',(request,response)=>{
    var data = request.body;
});

module.exports=router;

