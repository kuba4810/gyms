var express = require('express')
const notificationEndpoint = require('./Routes/notification.endpoints');
var app = express()
const {Pool} = require('pg')
const pg = require('pg');
var EmailTemplate = require('email-templates').EmailTemplate;
var randomstring = require("randomstring");
var nodemailer = require('nodemailer');
var opn = require('opn');
app.use(express.static('public'));

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

var client = new pg.Client('postgresql://postgres:irondroplet@178.128.245.212:5432/postgres');
    client.connect((err)=>{
    console.log(err);
}); 

let data = request.body;
let values =[data.Login,data.Password]

var responseData = {
    messageCount:0,
    notificationsCount:0,
    userData : {
        user_id:'',
        login:'',
        isEmailConfirmed : ''
    }
}

client.query(`SELECT * FROM kuba.users WHERE login = $1 and passw = $2`,values)
    .then(res=>{
        if(res.rows.length == 0){
            return Promise.reject({
                type: "loginFailed",
                message : 'Błędny login lub hasło !'
            })
        }
        else{
            let userData = {
                user_id: res.rows[0].user_id,
                login: data.Login,
                isEmailConfirmed : res.rows[0].is_email_confirmed
           }
           console.log("Dane użytkownika: ",userData);

            responseData = Object.assign({},responseData,{userData: userData});
            return client.query(`SELECT count(*) as "msg_count" From kuba.messages WHERE receiver = $1 and is_read = false`,[res.rows[0].user_id])
        }
    }).then(res=>{
        responseData = Object.assign({},responseData,{messageCount: res.rows[0].msg_count})
        return client.query(`SELECT count(*) as "ntf_count" From kuba.notifications WHERE user_id = $1`,[responseData.userData.user_id])
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
app.get('/api/user/:user_id/msgCount',(request,response)=>{
    console.log('msgCount...');
    // Połączenie z bazą
    var client = new pg.Client('postgresql://postgres:irondroplet@178.128.245.212:5432/postgres');
    client.connect((err)=>{
        if(err){
            console.log(err);
           }
    }); 

    client.query(`SELECT count(*) as "msg_count" FROM kuba.messages
                  WHERE receiver = $1 and is_read = false`,[request.params.user_id])
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
app.get('/api/user/:user_id/ntfCount',(request,response)=>{
    // Połączenie z bazą
    var client = new pg.Client('postgresql://postgres:irondroplet@178.128.245.212:5432/postgres');
    client.connect((err)=>{
       if(err){
        console.log(err);
       }
    }); 

    client.query(`SELECT count(*) as "ntf_count" FROM kuba.notifications
                  WHERE user_id = $1 and is_read = false`,[request.params.user_id])
    .then( res => {
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
app.post('/newMessage',function(req,res){
    var data = req.body;
    console.log(data);

    const pool = new Pool({
        user: 'postgres',
        host: '178.128.245.212',
        database: 'postgres',
        password: 'irondroplet',
        port: 5432,
    });
    
    var query = "INSERT INTO kuba.messages(sender, receiver, sending_date, message_content, is_read, receiver_deleted, sender_deleted) VALUES($1,$2,CURRENT_TIMESTAMP,$3,false,false,false)"
    var values = [data.sender,data.receiver,data.text];

    pool.query(query,values, (err, response) => {

        //console.log("Odpowiedź: ",response);
        //console.log("Error: ",err);
        res.json({"State":"Wysłano"});
        pool.end()

    });

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
app.get('/getUserData/:user_id',function(req,res){
    var user_id = req.params.user_id;
    console.log("Parametr: ",user_id);

    var pool = new Pool({
        user: 'postgres',
        host: '178.128.245.212',
        database: 'postgres',
        password: 'irondroplet',
        port: 5432,
    });

    var query = "SELECT users.* , user_statistics.*	FROM kuba.users natural join kuba.user_statistics WHERE users.login = $1;";
    var values = [user_id];

    pool.query(query,values,function(err,response){


        console.log("Odpowiedź z bazy: ",response.rows[0]);
        res.json(response.rows[0]);
        pool.end();
    });

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
