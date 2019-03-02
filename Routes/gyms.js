var express = require('express');
var router = express.Router();
const {Pool} = require('pg');
const pg = require('pg');
const fileUpload = require('express-fileupload');
const makeDir = require('make-dir');

// Połączenie z bazą danych
var client = new pg.Client('postgresql://postgres:irondroplet@178.128.245.212:5432/postgres');
client.connect();

// Pobiera listę wszystkich siłowni
// ------------------------------------------------------------------------------------------------
router.get('/api/gyms',(request,response)=>{
    console.log('Get all gyms...');
    
  /*   var client = new pg.Client('postgresql://postgres:irondroplet@178.128.245.212:5432/postgres');
    client.connect((err)=>{
        console.log(err);
     }); */

    let query = 'SELECT * FROM kuba.gyms';
     client.query(query)
     .then(res=> res.rows)
     .then(res=>{
        response.json(res)
     })
     .catch(err=>{
         response.json({
             response: 'failed'
         })
     })  

});


// Pobiera szczegółowe dane jednej siłowni
// ------------------------------------------------------------------------------------------------
router.get('/api/gym/:gym_id',(request,response)=>{
   /*  var client = new pg.Client('postgresql://postgres:irondroplet@178.128.245.212:5432/postgres');
    client.connect((err)=>{
        console.log(err);
     }); */
     
    // Pusty obiekt przygotowany pod odbiór danych
    var responseData={
        gymData:{},
        offers:[],
        packages:[],
        photos : [],
        comments: [],
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

        return client.query(`SELECT * FROM kuba.gym_photos WHERE gym_id = $1`,[request.params.gym_id])
    }) 
    .then(res => {
        responseData = Object.assign({},responseData,{photos:[...res.rows]});
        
        return client.query(`SELECT comment_id, login, user_id, creation_date, pluses,minuses,content
                            FROM kuba.users NATURAL JOIN kuba.gym_comments
                            WHERE gym_id = $1 ORDER BY creation_date DESC`,[request.params.gym_id])
    })
    .then(res=>{
        responseData = Object.assign({},responseData,{comments:[...res.rows]});     
    })
    .then(()=>{
         // Po wykonaniu ostatniego zapytania dane są zwracane do klienta   
        response.json({
            response: 'success',
            data: responseData
         });
    })
    .catch(err=>{
        console.log("Wystąpił błąd: ",err);
        response.json({
            response: 'failed'
        })
    })
    .finally(()=>{
        console.log('Rozłączam baze...');

        
    })

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
    let values =[data.gym_name,data.city,data.street,data.post_code,data.phone_number,data.landline_number,
                 data.email,data.description,data.equipment]
    const createGym = `INSERT INTO kuba.gyms 
    (gym_name,city,street,post_code,phone_number,landline_phone,email,evaluation,description,equipment)
    VALUES($1,$2,$3,$4,$5,$6,$7,0,$8,$9) returning *`

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
                return client.query(createGym,values)
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
            console.log('Dodaje zdjęcia na serwer...');
            let query = 'INSERT INTO kuba.gym_photos (gym_id,url) VALUES ($1,$2)'

            return Promise.all( 
                data.pictures.map( 
                    pic=> ( 
                        client.query(query,[gym_id,pic])
                  
                        )))
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

// Odbiera zdjęcia przesłane od klienta
// ------------------------------------------------------------------------------------------------
router.post('/upload/:gym_name', (req, res) => {
    let gym_name = req.params.gym_name;

    console.log("Tworzę zdjęcia w folderach...");
    
    console.log("Dostałem takie pliki: ", req.files);
    // res.send("Odpowiedź")
    if (Object.keys(req.files).length == 0) {
      return res.status(400).send('No files were uploaded.');
    }
  
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let files = req.files.image;
    // console.log("Pojedynczy plik: ", files[0]);
    // Use the mv() method to place the file somewhere on your server
    console.log(`public/images/${gym_name}/${files[0].name}.jpg`)

    makeDir(`public/images/${gym_name}`)
    .then(path=>{
        for(var i = 0; i< files.length; i++){
            files[i].mv(`public/images/${gym_name}/${files[i].name}`, function(err) {
                if (err)
                 { 
                    console.log("Wystąpił błąd: ",err);            
                   
                }
           
                  
              });
        }
        res.send('File uploaded!'); 
    })
   
   
  });

// Wystawianie ocen
// -----------------------------------------------------------------------------------------------
router.post('/api/gym/vote',(request,response)=>{
    let data = request.body;
    let star_column_name;

    var client = new pg.Client('postgresql://postgres:irondroplet@178.128.245.212:5432/postgres');
       client.connect((err)=>{
       console.log(err);
    }); 
    console.log("Typ star to : ",typeof(data.star))

    // Ustal którą liczbę gwiazdek zaktualizować
    switch(data.star){
        case 1:
         star_column_name = 'one_star_count'
         break;

        case 2:
         star_column_name = 'two_star_count'
         break;

        case 3:
         star_column_name = 'three_star_count'
         break;

        case 4:
         star_column_name = 'four_star_count'
         break;

        case 5: 
         star_column_name = 'five_star_count'
         break;
    }
    console.log('Zamierzam zmienić kolumnę : ',star_column_name)
    // Utwórz zapytanie z parametrami
    let query = `UPDATE kuba.gym_stats SET ${star_column_name} = $1 WHERE gym_id = $2`;
    let values = [data.star,data.gym_id]

    // Wynonanie kwerendy
    client.query(query,values)
       .then(res=>res.rows)
       .then(res=>{
            response.json({
                response:'success'
            })
       })
       .catch(err=>{
           response.json({
               response:'failed'
           })
           console.log(err);
           
       })

});

// Wystawianie komentarza do siłowni
// ------------------------------------------------------------------------------------------------
router.post('/api/gym/comment',(request,response)=>{
    let data = request.body;

    var client = new pg.Client('postgresql://postgres:irondroplet@178.128.245.212:5432/postgres');
       client.connect((err)=>{
       console.log(err);
    }); 

    let query =`INSERT INTO kuba.gym_comments(
         user_id, gym_id, creation_date, pluses, minuses, content)
        VALUES ($1,$2,CURRENT_TIMESTAMP,0,0,$3) returning *`
    let values = [data.user_id,data.gym_id,data.text]

    client.query(query,values)
       .then(res=>res.rows)
       .then(res=>{
        
           return res[0].comment_id
       })
       .then(res=>{
           return client.query(`SELECT comment_id, login, user_id, creation_date, pluses,minuses,content
           FROM kuba.users NATURAL JOIN kuba.gym_comments
           WHERE comment_id = $1`,[res])
       })
       .then(res=>{
        response.json({
            response:'success',
            comment: res.rows[0]
        })
       })
       .catch(err=>{
           console.log(err);
           response.json({
               response:'failed'
           })
       })
})




module.exports=router;
