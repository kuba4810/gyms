var express = require('express')
var app = express()
const {Pool} = require('pg')

var EmailTemplate = require('email-templates').EmailTemplate;


const cors = require('cors');
const bodyParser = require('body-parser')


/* SETTINGS */
/* ------------------------------ */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors());
app.options('*', cors());
/* ------------------------------ */


var verificationCode = "478fh7fh847fedsufhw38f";
/* EMAIL */
/* ------------------------------ */
/*
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'silownie.info@gmail.com',
    pass: 'Impala67'
  }
});

var mailOptions = {
  from: 'SILOWNIE-INFO',
  to: 'kuba__koziol@op.pl',
  subject: 'Potwierdzenie rejestracji',
  html: `<div style="background-color:darkgray; padding:32px; height:100%;">
             <div style="background-color:cornsilk; width:60%; margin-left:auto; margin-right:auto; text-align:center;">
                  <div style="padding:16px 8px; text-align:center; background-color:rgb(255,51,51); color:white;">
                      <h1>Witaj kuba481</h1>
                  </div>
                 <div style="padding:16px 8px; background-color:white; text-align:center;">
                       <h3> Potwierdź swój E-mail klikając na poniższy link </h3>
                      <a href="http://www.wiocha.pl" target="blank" style="text-decoration:none;"> Link aktywacyjny </a> <br>
                         <h3>Lub skopiuj poniższy kod aktywacyjny<h3> 
                         <h5> ${verificationCode}<h5> 
                 
                
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
  } else {
    console.log('Email sent: ' + info.response);
  }
});
*/
/* ==============================END POINTS=================================*/
/* -------------------------------------------------------------------------*/


/* REGISTER */
app.post('/register',function(req,res){
    var data = req.body;

    var responseData = {
        isEmailBusy: false,
        isLoginBusy: false,
        response : ""
    }
    var pool = new Pool({
        user: 'postgres',
        host: '178.128.245.212',
        database: 'postgres',
        password: 'irondroplet',
        port: 5432,
    });
    var query = 'SELECT Login,Email FROM kuba.users WHERE login = $1;';
    var values = [data.Login];

    pool.query(query,values, (err, response) => {
          console.log(err);
            if(response.rows.length > 0){
                responseData.isLoginBusy = true;
            }
            pool.end();
            res.send(response.rows[0]);
                        
    })
    





});
/* ------------------------------ */

/* LOG IN */
/* ------------------------------ */

app.post('/logIn',function(req,res){/*
    var loginData = req.body;

    console.log("Dane użytkownika: ",loginData);

    const pool = new Pool({
        user: 'postgres',
        host: '178.128.245.212',
        database: 'postgres',
        password: 'irondroplet',
        port: 5432,
    });

    var query = "SELECT * FROM Kuba.Users WHERE (Login = $1 OR Email = $1) AND (Passw = $2);";
    var values = [loginData.Login,loginData.Password];

    pool.query(query,values,function(err,response){
        if(response.rows.length > 0){
           var data= {
                response: "success",
                userData:{
                    user_id: response.rows[0].user_id,
                    login: response.rows[0].login,
                    isEmailConfirmed: response.rows[0].is_email_confirmed
                }
           }
           
        }
        else{
            data = { response:"failed"}
        }

        res.json(data);
        pool.end();
    });
*/
var data = req.body;

var responseData = {
    messageCount:0,
    notificationsCount:0,
    userData : {
        user_id:'',
        login:'',
        isEmailConfirmed : ''
    }
}

var pool = new Pool({
    user: 'postgres',
    host: '178.128.245.212',
    database: 'postgres',
    password: 'irondroplet',
    port: 5432,
});

var pool2 = new Pool({
    user: 'postgres',
    host: '178.128.245.212',
    database: 'postgres',
    password: 'irondroplet',
    port: 5432,
});

var query = "SELECT * FROM kuba.users WHERE Login = $1 AND passw = $2";
var values = [data.Login,data.Password];

pool.query(query,values,function(err,response){
    if(response.rows.length > 0){
        
        var userResponseData = response.rows[0];
        responseData.userData.user_id = userResponseData.user_id;
        responseData.userData.login = userResponseData.login;
        responseData.userData.isEmailConfirmed = userResponseData.is_email_confirmed;

        /*---------------------------------------------------- */
        query = 'SELECT count(*) as "msg_count" From kuba.messages WHERE receiver = $1 and is_read = false';
        values = [responseData.userData.user_id];
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
        values = [responseData.userData.user_id];
        pool2.query(query,values,function(err,resp){
            console.log("Liczba powiadomień:",resp.rows[0].ntf_count);
            responseData = {...responseData,notificationsCount:resp.rows[0].ntf_count}
            console.log("Stan obiektu:",responseData);
            res.json({
                response: 'success',
                data: responseData
            })
            pool2.end();  
        });
        /*---------------------------------------------------- */


    }        
    else{
        res.json({
            response: "failed"
        });
    }
    pool.end();
 } );



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

    pool.query('SELECT question_id, user_id, creating_date, topic, content_, pluses, minuses, how_many_answers  , login , category	FROM kuba.questions natural join kuba.users ORDER BY Creating_Date DESC', (err, response) => {

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

/* MESSAGES */
/* ------------------------------ */
app.get('/getMessages/:user_id',function(req,res){
    var user_id = req.params.user_id;

    const pool = new Pool({
        user: 'postgres',
        host: '178.128.245.212',
        database: 'postgres',
        password: 'irondroplet',
        port: 5432,
    });

    var query = "SELECT login ,sender,receiver, sending_date,message_content,is_read FROM kuba.users  INNER JOIN kuba.messages ON( users.user_id = messages.sender) WHERE receiver = $1 OR sender =$1  ORDER BY sending_date ASC; "
    var values = [user_id];

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
    
    var query = "INSERT INTO kuba.messages VALUES($1,$2,CURRENT_TIMESTAMP,$3,false)"
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

    var query = "INSERT INTO kuba.answers(user_id, question_id, creating_date,  content_, pluses, minuses)	VALUES ($1,$2,Current_timestamp,$3,0,0);"
    var values = [data.userID,data.questionId,data.content];

    pool.query(query,values,function(err,response){

        if(typeof(err)!==undefined){
            res.json({
                result:"success",
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


app.get('/getNotifications/:user_id', (req,res) => {
    var user_id = req.params.user_id;

    var pool = new Pool({
        user: 'postgres',
        host: '178.128.245.212',
        database: 'postgres',
        password: 'irondroplet',
        port: 5432,
    });

   var query = "SELECT * FROM kuba.notifications WHERE user_id = $1";
   var values = [user_id];

   pool.query(query,values,(err,response) => {
        if( response.rows.length == 0 ){
            res.json({
                notificationsCount: 0
            });
        }
        else{
           res.json({
            notificationsCount : response.rows.length,
            notifications : response.rows
           });
        }
        pool.end();
   });

});

var port = 8080;
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
