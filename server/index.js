var express = require('express');
var randomstring = require("randomstring");
var opn = require('opn');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const pg = require('pg');

const {Pool} = require('pg');

// Utworzenie aplikacji express
var app = express();

// Połączenie z postgres
const client = new pg.Client('postgresql://postgres:irondroplet@178.128.245.212:5432/postgres');
client.connect((err)=>{
    if(!err){
        console.log('Połączono z bazą danych !');
        
    }
    
});




var gymRoute = require('./Routes/gyms');



/* SETTINGS */
/* ------------------------------ */
app.use(express.static('./public'));
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.options('*', cors());
// const path = require('path');
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
//   });

/* ------------------------------ */


// Routes
require('./Routes/messages')(app,client);
require('./Routes/trainers')(app,client);
require('./Routes/notifications')(app,client);
require('./Routes/user')(app,client);
require('./Routes/questions')(app,client);
app.use(gymRoute);
   
/* REGISTER */
app.post('/register',function(request,response){

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
