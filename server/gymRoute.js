var express = require('express');
var router = express.Router();
const {Pool} = require('pg');
const pg = require('pg');
var client = new pg.Client('postgresql://postgres:irondroplet@178.128.245.212:5432/postgres');

// Pobiera listę wszystkich siłowni
// ------------------------------------------------------------------------------------------------
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


// Pobiera szczegółowe dane jednej siłowni
// ------------------------------------------------------------------------------------------------
router.get('/api/gym/:gym_id',(request,response)=>{
    var client = new pg.Client('postgresql://postgres:irondroplet@178.128.245.212:5432/postgres');
    client.connect((err)=>{
        console.log(err);
     });
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
       
  


// Tworzy nową siłownię
// ------------------------------------------------------------------------------------------------
router.post('/api/gym',(request,response)=>{

    var client = new pg.Client('postgresql://postgres:irondroplet@178.128.245.212:5432/postgres');
       client.connect((err)=>{
       console.log(err);
    }); 
    var data = request.body;
    console.log("Odpalone dodawanie siłowni")
    console.log('Dostałem takie dane: ',data)
    var gym_id

    // Kwerenda do sprawdzenia czy dana siłownia już istnieje
    var ckeckGymQuery = `SELECT * FROM kuba.gyms
         WHERE gym_name='${data.gym_name}' and city='${data.city}' and street='${data.street}' `

    // Kwerenda do pozyskania ID nowo utworzonej siłowni
    const getID = `SELECT gym_id FROM kuba.gyms WHERE email ='${data.email}'`  

    // Kwerenda do tabeli GYMS
    const createGym = `INSERT INTO kuba.gyms 
    (gym_name,city,street,post_code,phone_number,landline_phone,email,evaluation,description)
    VALUES('${data.gym_name}','${data.city}','${data.street}','${data.post_code}','${data.phone_number}','${data.landline_number}',
        '${data.email}',0,'${data.description}') returning *`

    // Kwerenda dla tabeli OPENING HOURS
    const createOpeningHours = `INSERT INTO kuba.opening_hours (gym_id,mon,tue,wed,thu,fri,sat,sun)
    VALUES(${gym_id},'${data.mon}','${data.tue}','${data.wed}','${data.thu}','${data.fri}','${data.sat}','${data.sun}')`


    // Początek łańcucha zapytań
    client.query(`SELECT email from kuba.gyms WHERE email='${data.email}'`)
        .then(res=>{
            console.log("Sprawdzam czy mail zajęty")
            if(res.rows.length>0){
                response.send({
                    response:'failed',
                    message: 'Podany email jest już zajęty !'
                })
            }
            else{
                // Sprawdzenie czy siłownia już istnieje
                return client.query(ckeckGymQuery)
            }
        }).then(res=>{
            console.log("Sprawdzam czy siłownia juz istnieje")
            if(res.rows.length>0){
                response.json({
                    response:'failed',
                    message: 'Siłownia o podanych danych już istnieje'
                })
            }
            else{

                // Utworzenie rekordu dla GYMS
                return client.query(createGym)
            }
        }).then((res)=>{
            
                gym_id = res.rows[0].gym_id;
                console.log("Znalazłem id siłowni !: ",gym_id);
                //Utworzenie harmonogramu siłowni
                return client.query(`INSERT INTO kuba.opening_hours (gym_id,mon,tue,wed,thu,fri,sat,sun)
                VALUES(${res.rows[0].gym_id},'${data.mon}','${data.tue}','${data.wed}','${data.thu}','${data.fri}','${data.sat}','${data.sun}')`)
            
        }).then(()=>{
            console.log("Tworze oferty !");
            return Promise.all( data.offers.map( offer=>( client.query(` INSERT INTO kuba.gym_offer
            (gym_id,offer_name,description) VALUES(${gym_id},'${offer.name}','${offer.description}') `) )))

        }).then(()=>{
            console.log("Tworze pakiety !");
            return Promise.all( data.packages.map( package=>( client.query(`INSERT INTO kuba.gym_packages
            (gym_id,package_name,description,prize) VALUES(${gym_id},'${package.name}','${package.period}','${package.price}')`) )))
        })
        .then(()=>{
            console.log("Udało się, siłownia dodana !");
                response.json({
                    response :'success',
                    gym_id: gym_id,
                    gym_name: data.gym_name
                })
            })
        .catch(err=>{
             console.log(err);   
             response.json({
                 response:'failed',
                 message: 'Wystapił błąd, spróbuj ponownie później !'
             })

        });
});



module.exports=router;

