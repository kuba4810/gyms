module.exports = (app,client) =>{
    

/* GET ALL QUESTIONS */
/* ------------------------------ */
app.get('/getAllQuestions', (request, response)=>{
    console.log('Questions...');    

    
    client.query(`SELECT question_id, user_id, creating_date, topic, content_, pluses, minuses, how_many_answers  , login , category 
                FROM kuba.questions natural join kuba.users  
                ORDER BY Creating_Date DESC`)
    .then(res=>{
        response.json(
            res.rows
        );
    })
    .catch(err=>{
        if(err!=='Done'){
            console.log(err);
            response.send({
                response : 'failed'
            })            
        }
    })       
       
  
});

/* SINGLE QUESTION */
/* ------------------------------ */
app.get('/getQuestion/:question_id',(request,response)=>{
    console.log('Question details...');
    

    var questionId = request.params.question_id;


    var query ="SELECT  User_ID,Login, Creating_Date, Topic, Content_, Pluses, Minuses, How_Many_Answers, category FROM Kuba.Questions NATURAL JOIN Kuba.Users WHERE Question_ID = $1;"
    var values = [questionId];

    client.query(query,values)
    .then(res=>{
        response.json(res.rows[0]);
    })
    .catch(err=>{
        console.log(err);
        
    })       
   
});


/* NEW QUESTION */
/* ------------------------------ */
app.post('/newQuestion',(request,response) =>{
    console.log('New question...');

    var data = request.body;
    
    var query = `INSERT INTO Kuba.Questions 
         (User_ID, Creating_Date, Topic, Content_, Pluses, Minuses, How_Many_Answers , category) 
          VALUES ($1,CURRENT_TIMESTAMP,$2,$3,0,0,0,$4) RETURNING *`

    var values = [data.UserID,data.Topic,data.Text,data.Category];

    client.query(query,values)
    .then(res=>{        
        response.json({
            question_id : res.rows[0].question_id
        })  
    })
    .catch(err=>{
        console.log(err);
        
    })
    
});


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


/* ANSWERS */
/* ------------------------------ */
app.get('/getAnswers/:question_id',(request,response)=>{
    console.log('Answers...');
    
    var questionId = request.params.question_id;

    var query = "SELECT answer_id, user_id, login , question_id, creating_date, content_, pluses, minuses FROM kuba.answers natural join kuba.users where question_id = $1 order by creating_date ASC;"
    var values = [questionId];

    client.query(query,values) 
    .then(res=>{
        response.json(res.rows);
    })
    .catch(err=>{
        console.log(err);        
    })
   
});



/* New answer */
app.post('/insertAnswer',(request,response)=>{
    console.log('NewAnswer... ',request.body);
    
    var data = request.body;

    var query = `INSERT INTO kuba.answers(user_id, question_id, creating_date,  content_, pluses, minuses)	
                 VALUES ($1,$2,Current_timestamp,$3,0,0) returning *;`
    var values = [data.userID,data.questionId,data.content];

    client.query(query,values)
    .then(res=>{
        
            response.json({
                result:"success",
                newAnswer : res.rows[0]

        });
    })
    .catch(err=>{
        response.json({
            result: "failed",
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

}