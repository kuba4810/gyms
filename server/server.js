var express = require('express')
const notificationEndpoint = require('./Routes/notification.endpoints');
var app = express()
const {Pool} = require('pg')
var EmailTemplate = require('email-templates').EmailTemplate;
var randomstring = require("randomstring");
var nodemailer = require('nodemailer');
var opn = require('opn');

const pg = require('pg');
const client = new pg.Client('postgresql://postgres:irondroplet@178.128.245.212:5432/postgres');
client.connect();
app.use(express.static('/public'));

const fileUpload = require('express-fileupload');

// Routers
var messagesRoute = require('./messagesRoute');
var gymRoute = require('./gymRoute');
var trainerRoute = require('./trainerRoute');

// default options
app.use(fileUpload());

const cors = require('cors');
const bodyParser = require('body-parser')



// opens the url in the default browser 
// opn('http://localhost:8080/');

//opn('http://localhost:8080/', {app: 'firefox'});


/* SETTINGS */
/* ------------------------------ */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors());
app.options('*', cors());

app.use(messagesRoute);
app.use(gymRoute);
app.use(notificationEndpoint);
app.use(trainerRoute);
/* ------------------------------ */



/* EMAIL */
/* ------------------------------ */

sendEmail =(user_id,verification_code,email,login) =>{
    
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'silownie.info@gmail.com',
      pass: 'Impala67'
    }
  });
  
  var mailOptions = {
    from: 'SILOWNIE-INFO',
    to: email,
    subject: 'Potwierdzenie rejestracji',
    html: `<div style="background-color:darkgray; padding:32px; height:100%;">
               <div style="background-color:cornsilk; width:90%; margin-left:auto; margin-right:auto; text-align:center;">
                    <div style="padding:16px 8px; text-align:center; background-color:rgb(255,51,51); color:white;">
                        <h1>Witaj ${login}</h1>
                    </div>
                   <div style="padding:16px 8px; background-color:white; text-align:center;">
                         <h3> Potwierdź swój E-mail klikając na poniższy link </h3>
                        <a href="http://localhost:3000/verify-email/${user_id}/${verification_code}" target="blank" style="text-decoration:none;"> Link aktywacyjny </a> <br>
                           <h3>Lub skopiuj poniższy kod aktywacyjny<h3> 
                           <h5> ${verification_code}<h5> 
                   
                  
                   <br><br>
                   <hr>
                   Copyright  2018 Kozioł & Koczaski
                   </div>
              </div> 
           </div>
          `
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
      return 'Failed'
    } else {
      return 'Success'
    }
  });
}

/* ==============================END POINTS=================================*/
/* -------------------------------------------------------------------------*/


/* REGISTER */
app.post('/register',function(request,response){

    var client = new pg.Client('postgresql://postgres:irondroplet@178.128.245.212:5432/postgres');
     client.connect((err)=>{
     console.log(err);
    }); 

    var data = request.body;
    console.log("Dane do rejestracji : ", data)
    var values = [data.login,data.password,data.email]
    let verification_code;

    //INSERT INTO USERS
    let userQuery = `INSERT INTO kuba.users 
    (first_name, last_name, login, passw, email, join_date, height, mass, favourite_exercise, is_blocked, is_email_confirmed)
    VALUES('','',$1,$2,$3,CURRENT_TIMESTAMP,0,0,'',false,false)
    returning *`;

    // Sprawdź czy login zajęty
    client.query(`SELECT * FROM kuba.users WHERE login = $1`,[data.login])
        .then(res=>{
            if(res.rows.length > 0){
                response.json({
                    response: 'failed',
                    message : "Ten login jest już zajęty !"
                })
                return Promise.reject('')
                
            }else{
                // Sprawdź czy email zajęty
                 return client.query(`SELECT * FROM kuba.users WHERE email = $1`,[data.email])
            }
        }).then(res=>{            
            if(res.rows.length > 0){
                response.json({
                    response:'failed',
                    message : 'E-mail już w użyciu'
                })
                return Promise.reject('')
            }
            else{
                // Dodaj użytkownika do bazy
                 return client.query(userQuery,values)
            }
        }).then(res=>{
            let user_id = res.rows[0].user_id;
            verification_code = randomstring.generate(15);
            // Dodaj kod weryfikacyjny
             return client.query(`INSERT INTO kuba.email_verification_codes 
            (user_id,verification_code)
            VALUES($1,$2) returning *`,[user_id,verification_code])
        
        }).then((res)=>{
            let user_id = res.rows[0].user_id;
            let result = sendEmail(user_id,verification_code,data.email,data.login);
            if(result === 'Failed'){
                return Promise.reject(`Email sending failed !`)
            }
            console.log('Wysłałem maila, dostałem odpowiedź: ',result);

            response.json({
                response: 'success',
                message: 'Udało się zarejestrować !'
            })
        }).catch(err=>{
            console.log(err);
            client.end();
          if(err !== ''){
            response.json({
                response:'failed',
                message: 'Wystąpił błąd, spróbuj ponownie później bądź skontaktuj się z administratorem'
            });
          }
        })
                        
    
    





});
/* ------------------------------ */

/* LOG IN */
/* ------------------------------ */

app.post('/logIn',function(request,response){
console.log('Log in...');

var client = new pg.Client('postgresql://postgres:irondroplet@178.128.245.212:5432/postgres');
    client.connect((err)=>{
    console.log(err);
}); 

let data = request.body;
console.log(data);

let values =[data.Login,data.Password]
let schema = data.type === 'user' ? 'kuba' : 'trainers';
let user_table = data.type === 'user' ? 'users' : 'trainer';
let table_name = data.type === 'user' ? 'user_messages' : 'trainer_messages';
let column_name = data.type === 'user' ? 'user_id' : 'trainer_id';




var responseData = {
    messageCount:0,
    notificationsCount:0,
    userData : {
        user_id:'',
        login:'',
        isEmailConfirmed : ''
    }

}

client.query(`SELECT * FROM ${schema}.${user_table} WHERE login = $1 and passw = $2`,values)
    .then(res=>{
        if(res.rows.length == 0){
            return Promise.reject({
                type: "loginFailed",
                message : 'Błędny login lub hasło !'
            })
        }
        else{
            let userData = {
                user_id: res.rows[0][column_name],
                login: data.Login,
                isEmailConfirmed : res.rows[0].is_email_confirmed
           }
           console.log("Dane użytkownika: ",userData);
            // Msg count    
            var query = `SELECT count(*) as "msg_count" 
            FROM ${schema}.${table_name} m_t natural join kuba.messages ms
            WHERE m_t.${column_name} = $1 and ms.is_read = false and m_t.type='receiver'`

            console.log('Query: ',query);
            
           
            responseData = Object.assign({},responseData,{userData: userData});
            return client.query(query,[res.rows[0][column_name]])
        }
    }).then(res=>{
        responseData = Object.assign({},responseData,{messageCount: res.rows[0].msg_count})
        // Ntf count
        if(data.type==='user'){
            return client.query(`SELECT count(*) as "ntf_count" 
            FROM kuba.user_notifications natural join kuba.notifications
            WHERE user_id=$1 and is_read = false`,[responseData.userData.user_id])
        }else{
            return client.query(`SELECT count(*) as "ntf_count" 
            FROM trainers.trainer_notifications natural join kuba.notifications
            WHERE trainer_id=$1 and is_read = false`,[responseData.userData.user_id])
        }
      
    }).then((res)=>{
        responseData = Object.assign({},responseData,{notificationsCount: res.rows[0].ntf_count})
        console.log("Dane użytkownika wraz z liczbą wiadomości i powiadomień : ",responseData);
        response.json({
            type : 'success',
            data : responseData
        })
    }).catch(err=>{
        console.log(err);
        if(typeof(err.type)!=='undefined')
        {
            console.log('Wysyłam błąd failed')
;            response.json(err)
        }
        else{
            response.json({
                type: 'serverError',
                message: 'Wystąpił błąd, spróbuj ponownie później !'
            })
        }
    })




});

// Pobiera liczbę nowych wiadomości danego użytkownika
// ------------------------------------------------------------------------------------------------
app.get('/api/user/:user_id/:type/msgCount',(request,response)=>{
    console.log('msgCount...');
    // Połączenie z bazą
    var client = new pg.Client('postgresql://postgres:irondroplet@178.128.245.212:5432/postgres');
    client.connect((err)=>{
        if(err){
            console.log(err);
           }
    }); 
    
    // Ustalanie nazw schematów, tabel i kolumn
    let schema = request.params.type === 'user' ? 'kuba' : 'trainers';
    let table_name = request.params.type === 'user' ? 'user_messages' : 'trainer_messages';
    let column_name =request.params.type === 'user' ? 'user_id' : 'trainer_id';

    let query = `SELECT count(*) as "msg_count" 
    FROM ${schema}.${table_name} m_t natural join kuba.messages ms
    WHERE m_t.${column_name} = $1 and ms.is_read = false and m_t.type='receiver'`;
    console.log('Query: ',query)
    console.log(request.params.type,schema,table_name,column_name);
    
            
    client.query(query,[request.params.user_id])
   
    .then( res => {
        if( res.rows.length > 0 ){
            response.json({
                response: 'success',
                data: res.rows[0].msg_count
            })
        }
        else{
            return Promise.reject({
               type: 'failed'
            })
        }
    })
    .catch(err=>{
        console.log(err);
            response.json({
                response: 'failed'
            })
    })

});

// Pobiera liczbę nowych powiadomień danego użytkownika
// ------------------------------------------------------------------------------------------------
app.get('/api/user/:user_id/:type/ntfCount',(request,response)=>{
    // Połączenie z bazą
    var client = new pg.Client('postgresql://postgres:irondroplet@178.128.245.212:5432/postgres');
    client.connect((err)=>{
       if(err){
        console.log(err);
       }
    }); 

     // Ustalanie nazw schematów, tabel i kolumn
    let query;
    let values = [request.params.user_id];
    if(request.params.type === 'user'){
        query = `SELECT count(*) as "ntf_count" 
                 FROM kuba.user_notifications natural join kuba.notifications
                 WHERE user_id = $1 and is_read = false`
    }else{
        query = `SELECT count(*) as "ntf_count" 
                 FROM trainers.trainer_notifications natural join kuba.notifications
                 WHERE trainer_id = $1 and is_read = false`
    }

    client.query(query,values)
    .then( res => {
        console.log(res.rows);
        
        if( res.rows.length > 0 ){
            response.json({
                response: 'success',
                data: res.rows[0].ntf_count
            })
        }
        else{
            return Promise.reject({
               type: 'failed'
            })
        }
    })
    .catch(err=>{
            response.json({
                response: 'failed'
            })
    })

});



/* GET ALL QUESTIONS */
/* ------------------------------ */
app.get('/getAllQuestions', function (req, res) {

    const pool = new Pool({
        user: 'postgres',
        host: '178.128.245.212',
        database: 'postgres',
        password: 'irondroplet',
        port: 5432,
    });
    
    pool.query("SELECT question_id, user_id, creating_date, topic, content_, pluses, minuses, how_many_answers  , login , category FROM kuba.questions natural join kuba.users  ORDER BY Creating_Date DESC", (err, response) => {

         queryResponse = response.rows;
        console.log(err);
         res.json(queryResponse);
        pool.end()
    });
});

/* SINGLE QUESTION */
/* ------------------------------ */
app.get('/getQuestion/:question_id',function(req,res){

    var questionId = req.params.question_id;

    const pool = new Pool({
        user: 'postgres',
        host: '178.128.245.212',
        database: 'postgres',
        password: 'irondroplet',
        port: 5432,
    });

    var query ="SELECT  User_ID,Login, Creating_Date, Topic, Content_, Pluses, Minuses, How_Many_Answers, category FROM Kuba.Questions NATURAL JOIN Kuba.Users WHERE Question_ID = $1;"
    var values = [questionId];

    pool.query(query,values, (err, response) => {

        queryResponse = response.rows[0];
        //console.log(queryResponse)

        res.json(queryResponse);
        pool.end()


    });

   
});
/* ANSWERS */
/* ------------------------------ */
app.get('/getAnswers/:question_id',function(req,res){
    var questionId = req.params.question_id;

    const pool = new Pool({
        user: 'postgres',
        host: '178.128.245.212',
        database: 'postgres',
        password: 'irondroplet',
        port: 5432,
    });

    var query = "SELECT answer_id, user_id, login , question_id, creating_date, content_, pluses, minuses FROM kuba.answers natural join kuba.users where question_id = $1 order by creating_date ASC;"
    var values = [questionId];

    pool.query(query,values, (err, response) => {

        queryResponse = response.rows;
        //console.log(queryResponse)

        res.json(queryResponse);
        pool.end()


    });

});



/* NEW MESSAGE */
/* ------------------------------ */
app.post('/newMessage',function(request,response){
    /* 
        body: {
            sender: int,
            receiver: int,
            text: string,
            receiver_type: 'user' or 'trainer',
            sender_type: 'user' or 'trainer'
        }
    */
    
    var data = request.body;
    let new_messae_id;
    let sender_message_query;
    let receiver_message_query;

    console.log('NewMessage...: ',request.body);
    

    //  Zapytanie wstawiania rekordu dla tabeli messages
    var query = `INSERT INTO kuba.messages(sending_date, message_content, is_read, receiver_deleted, sender_deleted)
                 VALUES(CURRENT_TIMESTAMP,$1,false,false,false) returning *`

    // Generowanie zapytania dla odbiorcy
    if(data.sender_type === 'user'){
        sender_message_query = `INSERT INTO kuba.user_messages
                               (user_id, message_id, type)
                               VALUES ($1,$2,'sender');`
    }else{
        sender_message_query = `INSERT INTO trainers.trainer_messages
                                (trainer_id, message_id, type)
                                 VALUES ($1,$2,'sender');`
    }
    console.log('Sender query: ', sender_message_query);
    
    // Generowanie zapytania dla nadawcy 
    if(data.receiver_type === 'user'){
        receiver_message_query = `INSERT INTO kuba.user_messages
                               (user_id, message_id, type)
                               VALUES ($1,$2,'receiver');`
    }else{
        receiver_message_query = `INSERT INTO trainers.trainer_messages
                                (trainer_id, message_id, type)
                                 VALUES ($1,$2,'receiver');`
    }
    console.log('Receiver query: ', receiver_message_query);
    var values = [data.text];


    // Insert to messages
    client.query(query,values)
    .then(res=>{
        new_message_id = res.rows[0].message_id;
        // Insert for sender
        return client.query(sender_message_query,[data.sender,new_message_id])
    })
    .then(res=>{
        // Insert for receiver
        return client.query(receiver_message_query,[data.receiver,new_message_id])
    })
    .then(res=>{
        response.send({
            response : 'success'
        })
    })
    .catch(err=>{
        console.log('Podczas wysyłania wiadomości wystąpił błąd: ',err);
        response.send({
            response:'failed'
        })
        
    })

});

/* NEW QUESTION */
/* ------------------------------ */
app.post('/newQuestion',function(req,res){
    var data = req.body;
    console.log(req.body);

    /* Sending a new question */
var pool = new Pool({
        user: 'postgres',
        host: '178.128.245.212',
        database: 'postgres',
        password: 'irondroplet',
        port: 5432,
    });
    
    var query = "INSERT INTO Kuba.Questions (User_ID, Creating_Date, Topic, Content_, Pluses, Minuses, How_Many_Answers , category) VALUES ($1,CURRENT_TIMESTAMP,$2,$3,0,0,0,$4) RETURNING *"
    var values = [data.UserID,data.Topic,data.Text,data.Category];

    pool.query(query,values, (err, response) => {

        //console.log("Odpowiedź: ",response);
        //console.log("Error: ",err);        
        

    });
    /* Id of sent question */
     pool = new Pool({
        user: 'postgres',
        host: '178.128.245.212',
        database: 'postgres',
        password: 'irondroplet',
        port: 5432,
    });
    
    var query = "select Question_ID from Kuba.Questions order by Creating_Date DESC LIMIT 1;"

    pool.query(query, (err, response) => {

        console.log("Id nowego pytania: ",parseInt(response.rows[0].question_id)+1);
       // console.log("Error: ",err);
        res.json({question_id: parseInt(response.rows[0].question_id)+1});
        pool.end()

    });

});

/* USER DATA */
/* ------------------------------ */
app.get('/getUserData/:login',function(request,response){
    var login = request.params.login;

    console.log("Parametr: ",login);

    var query = `SELECT users.*,us.*
                 FROM kuba.users natural join kuba.user_statistics us
                 WHERE users.login = $1`;
    var values = [login];

    client.query(query,values)
    .then(res=>{

        if(res.rows.length > 0) {
            response.send({
                response : 'success',
                type: 'user',
                data: res.rows[0]
            })
            return Promise.reject('Done');
        }  
        else{
            return client.query(`SELECT trainer.*
            FROM trainers.trainer
            WHERE login = $1`,[login])
        }
    })
    .then(res=>{
        response.send({
            response : 'success',
            type: 'trainer',
            data: res.rows[0]
        })
    })
    .catch(err=>{
        if(err!=='Done'){
            response.send({
                response: 'failed'
            })
        }
        console.log(err);
        
    })
    


  
});

/* ANSWER */

app.post('/insertAnswer',function(req,res){
    var data = req.body;

    var pool = new Pool({
        user: 'postgres',
        host: '178.128.245.212',
        database: 'postgres',
        password: 'irondroplet',
        port: 5432,
    });

    var query = "INSERT INTO kuba.answers(user_id, question_id, creating_date,  content_, pluses, minuses)	VALUES ($1,$2,Current_timestamp,$3,0,0) returning *;"
    var values = [data.userID,data.questionId,data.content];

    pool.query(query,values,function(err,response){

        if(typeof(err)!==undefined){
            res.json({
                result:"success",
                newAnswer : response.rows[0]
            });
        }
        else{
            res.json({
                result: "failed",
                message:"Wystąpił problem , spróbuj ponownie później !"
            })
        }
        pool.end();
    });
});
/* ------------------------------ */


// Question vote
// ------------------------------------------------------------------------------------------------
app.post('/api/question/vote',(request,response)=>{
 /* 
        Body structure:
            {
                user_id,
                question_id,
                value (0 or 1) where 0 means vote down, 1 means vote up
            }    
    */
   console.log('Question vote...',request.body);
   
   let data = request.body;
   let question_column='';
   let user_column =''

   // Votes count ( for response )
   let votes_count = 0;

   // Check which column update
   question_column = data.value === '0' ? 'minuses' : 'pluses';
   user_column = data.value === '0' ? 'voted_down' : 'votes_up';

   let query = `UPDATE kuba.questions
                SET ${question_column} = ${question_column}+1
                WHERE question_id = $1 returning *`;
   let values =[data.question_id];

   client.query(query,values)
   .then(res=>{     
       votes_count = res.rows[0].pluses - res.rows[0].minuses;
   })
   .then(()=>{
       return client.query(`UPDATE kuba.user_statistics 
                            SET ${user_column} = ${user_column} +1
                            WHERE user_id = $1`,[data.user_id])
   })
   .then(res=>{
        response.send({
            response : 'success',
            votes_count : votes_count
        })
   })
   .catch(err=>{
       console.log(err);
       
       response.send({
           response : 'Wystąpił błąd, spróbuj ponownie później !'
       })
   })

});

// Answer vote
// ------------------------------------------------------------------------------------------------
app.post('/api/answer/vote',(request,response)=>{
    /* 
           Body structure:
               {
                   user_id,
                   answer_id,
                   value (0 or 1) where 0 means vote down, 1 means vote up
               }    
       */
      console.log('Answer vote...',request.body);
      
      let data = request.body;
      let answer_column='';
      let user_column =''
   
      // Votes count ( for response )
      let votes_count = 0;
   
      // Check which column update
      answer_column = data.value === '0' ? 'minuses' : 'pluses';
      user_column = data.value === '0' ? 'voted_down' : 'votes_up';
   
      let query = `UPDATE kuba.answers
                   SET ${answer_column} = ${answer_column}+1
                   WHERE answer_id = $1 returning *`;
                   
      let values =[data.answer_id];
   
      client.query(query,values)
      .then(res=>{   
        console.log(res);            
        votes_count = res.rows[0].pluses - res.rows[0].minuses;
      })
      .then(()=>{
          return client.query(`UPDATE kuba.user_statistics 
                               SET ${user_column} = ${user_column} +1
                               WHERE user_id = $1`,[data.user_id])
      })
      .then(res=>{
           response.send({
               response : 'success',
               votes_count : votes_count
           })
      })
      .catch(err=>{
          console.log(err);
          
          response.send({
              response : 'Wystąpił błąd, spróbuj ponownie później !'
          })
      })
   
   });

app.post('/test',function(req,res){

   


});


app.get('/updateMsgNot/:user_id',(req,res)=>{
    var user_id = req.params.user_id;

    var responseData = {
        messageCounter:'',
        notificationsCounter: ''
    }
    

    var pool2 = new Pool({
        user: 'postgres',
        host: '178.128.245.212',
        database: 'postgres',
        password: 'irondroplet',
        port: 5432,
    });

    query = 'SELECT count(*) as "msg_count" From kuba.messages WHERE receiver = $1 and is_read = false';
        values = [user_id];
        pool2.query(query,values,function(err,response){
            console.log("Liczba wiadomości:",response.rows[0].msg_count);
            responseData = {...responseData,messageCount:response.rows[0].msg_count}
            console.log("Stan obiektu:",responseData);    
                      
        });

        /*---------------------------------------------------- */
        pool2 = new Pool({
            user: 'postgres',
            host: '178.128.245.212',
            database: 'postgres',
            password: 'irondroplet',
            port: 5432,
        });

        query = 'SELECT count(*) as "ntf_count" From kuba.notifications WHERE user_id = $1';
        values = [user_id];
        pool2.query(query,values,function(err,resp){
            console.log("Liczba powiadomień:",resp.rows[0].ntf_count);
            responseData = {...responseData,notificationsCount:resp.rows[0].ntf_count}
            console.log("Stan obiektu:",responseData);
            res.json(responseData
            )
            pool2.end();  
        });
});








var port = 8080;
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
