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

}