module.exports = (app, client) => {


    /* GET ALL QUESTIONS */
    /* ------------------------------ */
    app.get('/getAllQuestions/:sort_type', (request, response) => {
        console.log('Questions...');

        const sort = request.params.sort_type;
        let query = '';

        // Different query depending of sort type
        switch (sort) {

            // Newest
            case 'newest':
                query = `SELECT question_id, user_id, creating_date, topic, content_, pluses, minuses, how_many_answers  , login , category 
                         FROM kuba.questions natural join kuba.users  
                         ORDER BY Creating_Date DESC`
                break;

                // Oldest
            case 'oldest':
                query = `SELECT question_id, user_id, creating_date, topic, content_, pluses, minuses, how_many_answers  , login , category 
                FROM kuba.questions natural join kuba.users  
                ORDER BY Creating_Date ASC`
                break;

                // Most answered
            case 'most_answered':
                query = `SELECT question_id, user_id, creating_date, topic, content_, pluses, minuses, how_many_answers  , login , category 
                 FROM kuba.questions natural join kuba.users  
                 ORDER BY how_many_answers DESC`
                break;

                // Without answers
            case 'without_answers':
                query = `SELECT question_id, user_id, creating_date, topic, content_, pluses, minuses, how_many_answers  , login , category 
                 FROM kuba.questions natural join kuba.users  
                 WHERE how_many_answers = 0`
                break;

                // Most rated
            case 'most_rated':
                query = `SELECT question_id, user_id, creating_date, topic, content_, pluses, minuses, how_many_answers  , login , category , (pluses - minuses) as  "vote"
                 FROM kuba.questions natural join kuba.users  
                 ORDER BY vote DESC;`
                break;
        }

        client.query(query)
            .then(res => {
                response.json(
                    res.rows
                );
            })
            .catch(err => {
                if (err !== 'Done') {
                    console.log(err);
                    response.send({
                        response: 'failed'
                    })
                }
            })


    });

    // CHECK QUESTION VOTE
    // Check if speciefied question was voted by specified user
    // ----------------------------------------------------------------------------
    app.post('/api/question/vote/check', async (request, response) => {

        console.log('Question vote check ...');


        // Prepare varaibles and constants
        let res;
        const query = `SELECT * FROM kuba.question_vote
                   WHERE user_id = $1 and question_id = $2`;
        const values = [request.body.user_id, request.body.question_id];

        try {
            // Execute query
            res = await client.query(query, values);

            // If question was founded
            if (res.rows.length > 0) {
                // Send true
                response.send({
                    response: 'success',
                    value: true,
                    vote_value: res.rows[0].value
                })

            }
            // There is no question in response
            else {

                // Send false
                response.send({
                    response: 'success',
                    value: false,
                    vote_value: -1
                })
            }

        } catch (error) {
            response.send({
                response: 'failed'
            })
        }

    })

    // CHECK ANSWER VOTE
    // Check if speciefied answer was voted by specified user
    // ----------------------------------------------------------------------------
    app.post('/api/answer/vote/check', async (request, response) => {

        console.log('Answer check ... ', request.body);

        // Prepare varaibles and constants
        let res;
        const query = `SELECT * FROM kuba.answer_vote
                   WHERE user_id = $1 and answer_id = $2`;
        const values = [request.body.user_id, request.body.answer_id];

        try {
            // Execute query
            res = await client.query(query, values);

            // If answer was founded
            if (res.rows.length > 0) {
                // Send true
                response.send({
                    response: 'success',
                    value: true,
                    vote_value: res.rows[0].value
                })

            }
            // There is no answer in response
            else {

                // Send false
                response.send({
                    response: 'success',
                    value: false,
                    vote_value: -1
                })
            }

        } catch (error) {
            response.send({
                response: 'failed'
            })
        }

    })

    // CHANGE QUESTION VOTE
    // Znajduje pytanie w bazie danych
    // Zmienia liczbę plusów i/lub minusów
    // Aktualizuje tabele question_vote
    app.post('/api/question/vote/change', async (request, response) => {

        console.log('Vote...', request.body);

        let data = request.body;
        let res;

        let question_query; /* For table questions */
        let vote_query; /* For table question_vote */
        let question_values; /* For table questions */
        let vote_values; /* For table question_vote */

        // When user clicks for new vote
        if (data.previous_vote === -1) {
            vote_query = `INSERT INTO kuba.question_vote(
                           user_id, question_id, value)
                           VALUES ($1, $2, $3) returning *;`
            vote_values = [data.user_id, data.question_id, data.next_vote];
            question_values = [data.question_id];


            // Click vote down
            if (data.next_vote === 0) {

                question_query = `UPDATE kuba.questions
                              SET minuses = minuses + 1
                              WHERE question_id = $1`;

            }
            // Click vote up
            else if (data.next_vote === 1) {

                question_query = `UPDATE kuba.questions
                              SET pluses = pluses + 1
                              WHERE question_id = $1`;

            }
        }

        // When user clicks to removes vote
        if (data.next_vote === -1) {
            vote_query = `DELETE FROM kuba.question_vote 
                     WHERE user_id = $1 and question_id = $2 returning *;`
            vote_values = [data.user_id, data.question_id]
            question_values = [data.question_id];

            // Removes from vote down
            if (data.previous_vote === 0) {
                question_query = `UPDATE kuba.questions
                                  SET minuses = minuses-1
                                  WHERE question_id = $1`;
            }
            // Removes from vote up
            else if (data.previous_vote === 1) {
                question_query = `UPDATE kuba.questions
                                  SET pluses = pluses-1
                                  WHERE question_id = $1`;
            }
        }

        // Change vote from down to up
        if (data.previous_vote === 0 && data.next_vote === 1) {

            vote_query = `UPDATE kuba.question_vote 
                          SET value= $1
            WHERE user_id = $2 and question_id = $3 returning *;`;

            question_query = `UPDATE kuba.questions
                                  SET minuses = minuses-1, pluses = pluses+1
                                  WHERE question_id = $1`;

            vote_values = [data.next_vote, data.user_id, data.question_id];
            question_values = [data.question_id];

        }

        // Change vote from up to down
        if (data.previous_vote === 1 && data.next_vote === 0) {

            vote_query = `UPDATE kuba.question_vote 
            SET value= $1
            WHERE user_id = $2 and question_id = $3 returning *;`;

            question_query = `UPDATE kuba.questions
                    SET pluses = pluses-1, minuses = minuses+1
                    WHERE question_id = $1`;

            vote_values = [data.next_vote, data.user_id, data.question_id];
            question_values = [data.question_id];

        }

        /* 
            DATABASE OPERATIONS
        */

        try {

            // Query for table question_vote
            res = await client.query(vote_query, vote_values);

            if (res) {
                // Query for table questions
                res = await client.query(question_query, question_values);
            } else {
                throw 'failed';
            }

            if (res) {
                response.send({
                    response: 'success'
                })
            } else {
                throw 'failed';
            }

        } catch (error) {
            console.log(error);

            response.send({
                response: 'failed'
            })

        }


    });

    // CHANGE ANSWER VOTE
    // Znajduje pytanie w bazie danych
    // Zmienia liczbę plusów i/lub minusów
    // Aktualizuje tabele answer_vote
    app.post('/api/answer/vote/change', async (request, response) => {

        console.log('Answer vote...', request.body);

        let data = request.body;
        let res;

        let answer_query; /* For table answers */
        let vote_query; /* For table answer_vote */
        let answer_values; /* For table answers */
        let vote_values; /* For table answer_vote */

        // When user clicks for new vote
        if (data.previous_vote === -1) {
            vote_query = `INSERT INTO kuba.answer_vote(
                           user_id, answer_id, value)
                           VALUES ($1, $2, $3) returning *;`
            vote_values = [data.user_id, data.answer_id, data.next_vote];
            answer_values = [data.answer_id];


            // Click vote down
            if (data.next_vote === 0) {

                answer_query = `UPDATE kuba.answers
                              SET minuses = minuses + 1
                              WHERE answer_id = $1`;

            }
            // Click vote up
            else if (data.next_vote === 1) {

                answer_query = `UPDATE kuba.answers
                              SET pluses = pluses + 1
                              WHERE answer_id = $1`;

            }
        }

        // When user clicks to removes vote
        if (data.next_vote === -1) {
            vote_query = `DELETE FROM kuba.answer_vote 
                     WHERE user_id = $1 and answer_id = $2 returning *;`
            vote_values = [data.user_id, data.answer_id]
            answer_values = [data.answer_id];

            // Removes from vote down
            if (data.previous_vote === 0) {
                answer_query = `UPDATE kuba.answers
                                  SET minuses = minuses-1
                                  WHERE answer_id = $1`;
            }
            // Removes from vote up
            else if (data.previous_vote === 1) {
                answer_query = `UPDATE kuba.answers
                                  SET pluses = pluses-1
                                  WHERE answer_id = $1`;
            }
        }

        // Change vote from down to up
        if (data.previous_vote === 0 && data.next_vote === 1) {

            vote_query = `UPDATE kuba.answer_vote 
                          SET value= $1
            WHERE user_id = $2 and answer_id = $3 returning *;`;

            answer_query = `UPDATE kuba.answers
                                  SET minuses = minuses-1, pluses = pluses+1
                                  WHERE answer_id = $1`;

            vote_values = [data.next_vote, data.user_id, data.answer_id];
            answer_values = [data.answer_id];

        }

        // Change vote from up to down
        if (data.previous_vote === 1 && data.next_vote === 0) {

            vote_query = `UPDATE kuba.answer_vote 
            SET value= $1
            WHERE user_id = $2 and answer_id = $3 returning *;`;

            answer_query = `UPDATE kuba.answers
                    SET pluses = pluses-1, minuses = minuses+1
                    WHERE answer_id = $1`;

            vote_values = [data.next_vote, data.user_id, data.answer_id];
            answer_values = [data.answer_id];

        }

        /* 
            DATABASE OPERATIONS
        */

        try {

            // Query for table answer_vote
            res = await client.query(vote_query, vote_values);

            if (res) {
                // Query for table answers
                res = await client.query(answer_query, answer_values);
            } else {
                throw 'failed';
            }

            if (res) {
                response.send({
                    response: 'success'
                })
            } else {
                throw 'failed';
            }

        } catch (error) {
            console.log(error);

            response.send({
                response: 'failed'
            })

        }


    });




    /* SINGLE QUESTION */
    /* ------------------------------ */
    app.get('/getQuestion/:question_id', (request, response) => {
        console.log('Question details...');


        var questionId = request.params.question_id;


        var query = "SELECT  User_ID,Login, Creating_Date, Topic, Content_, Pluses, Minuses, How_Many_Answers, category FROM Kuba.Questions NATURAL JOIN Kuba.Users WHERE Question_ID = $1;"
        var values = [questionId];

        client.query(query, values)
            .then(res => {
                response.json(res.rows[0]);
            })
            .catch(err => {
                console.log(err);

            })

    });


    /* NEW QUESTION */
    /* ------------------------------ */
    app.post('/newQuestion', (request, response) => {
        console.log('New question...');

        var data = request.body;

        var query = `INSERT INTO Kuba.Questions 
         (User_ID, Creating_Date, Topic, Content_, Pluses, Minuses, How_Many_Answers , category) 
          VALUES ($1,CURRENT_TIMESTAMP,$2,$3,0,0,0,$4) RETURNING *`

        var values = [data.UserID, data.Topic, data.Text, data.Category];

        client.query(query, values)
            .then(res => {
                response.json({
                    question_id: res.rows[0].question_id
                })
            })
            .catch(err => {
                console.log(err);

            })

    });


    // Question vote
    // ------------------------------------------------------------------------------------------------
    app.post('/api/question/vote', (request, response) => {
        /* 
               Body structure:
                   {
                       user_id,
                       question_id,
                       value (0 or 1) where 0 means vote down, 1 means vote up
                   }    
           */
        console.log('Question vote...', request.body);

        let data = request.body;
        let question_column = '';
        let user_column = ''

        // Votes count ( for response )
        let votes_count = 0;

        // Check which column update
        question_column = data.next_vote === '0' ? 'minuses' : 'pluses';
        user_column = data.next_vote === '0' ? 'voted_down' : 'votes_up';

        let query = `UPDATE kuba.questions
                   SET ${question_column} = ${question_column}+1
                   WHERE question_id = $1 returning *`;
        let values = [data.question_id];

        client.query(query, values)
            .then(res => {
                votes_count = res.rows[0].pluses - res.rows[0].minuses;
            })
            .then(() => {
                return client.query(`UPDATE kuba.user_statistics 
                               SET ${user_column} = ${user_column} +1
                               WHERE user_id = $1`, [data.user_id])
            })
            .then(res => {
                response.send({
                    response: 'success',
                    votes_count: votes_count
                })
            })
            .catch(err => {
                console.log(err);

                response.send({
                    response: 'Wystąpił błąd, spróbuj ponownie później !'
                })
            })

    });


    /* ANSWERS */
    /* ------------------------------ */
    app.get('/getAnswers/:question_id', (request, response) => {
        console.log('Answers...');

        var questionId = request.params.question_id;

        var query = "SELECT * FROM kuba.answers  where question_id = $1 order by creating_date DESC;"
        var values = [questionId];

        client.query(query, values)
            .then(res => {
                response.json(res.rows);
            })
            .catch(err => {
                console.log(err);
            })

    });


    /* New answer */
    app.post('/insertAnswer', (request, response) => {
        console.log('NewAnswer... ', request.body);

        var data = request.body;

        var query = `INSERT INTO kuba.answers 
                    (user_id, question_id, creating_date,  content_, pluses, minuses, user_type, login)	
                    VALUES ($1,$2,Current_timestamp,$3,0,0,$4,$5) returning *;`
        var values = [data.userID, data.questionId, data.content,data.user_type,data.login];

        client.query(query, values)
            .then(res => {

                response.json({
                    result: "success",
                    newAnswer: res.rows[0]

                });
            })
            .catch(err => {
                console.log(err);
                
                response.json({
                    result: "failed",
                })
            })

    });



    // Answer vote
    // ------------------------------------------------------------------------------------------------
    app.post('/api/answer/vote', (request, response) => {
        /* 
               Body structure:
                   {
                       user_id,
                       answer_id,
                       value (0 or 1) where 0 means vote down, 1 means vote up
                   }    
           */
        console.log('Answer vote...', request.body);

        let data = request.body;
        let answer_column = '';
        let user_column = ''

        // Votes count ( for response )
        let votes_count = 0;

        // Check which column update
        answer_column = data.next_vote === '0' ? 'minuses' : 'pluses';
        user_column = data.next_vote === '0' ? 'voted_down' : 'votes_up';

        let query = `UPDATE kuba.answers
                   SET ${answer_column} = ${answer_column}+1
                   WHERE answer_id = $1 returning *`;

        let values = [data.answer_id];

        client.query(query, values)
            .then(res => {
                console.log(res);
                votes_count = res.rows[0].pluses - res.rows[0].minuses;
            })
            .then(() => {
                return client.query(`UPDATE kuba.user_statistics 
                               SET ${user_column} = ${user_column} +1
                               WHERE user_id = $1`, [data.user_id])
            })
            .then(res => {
                response.send({
                    response: 'success',
                    votes_count: votes_count
                })
            })
            .catch(err => {
                console.log(err);

                response.send({
                    response: 'Wystąpił błąd, spróbuj ponownie później !'
                })
            })

    });



    // Delete single answer
    // Needs answer_id and deletes row from table answers
    // If it's necesery function deletes row from table answer_vote
    app.post('/api/answer', async (request, response) => {

        console.log('Delete answer ,', request.body);

        const id = request.body.answer_id;
        let question_id;
        let res;

        try {

            // Delete from table answer vote
            res = await client.query(`DELETE from kuba.answer_vote WHERE answer_id = $1 returning *`, [id]);

            // Select question_id
            res = await client.query(`SELECT question_id from kuba.answers 
                                       WHERE answer_id = $1 `, [id]);

            // Update table questions, decrement answer count
            res = await client.query(`UPDATE kuba.questions 
                     SET how_many_answers = how_many_answers - 1
                     WHERE question_id = $1`, [res.rows[0].question_id]);

            // Delete from table answers
            res = await client.query('DELETE FROM kuba.answers WHERE answer_id = $1 returning *', [id]);   
            
            // Send response
            response.send({
                response: 'success',
            })


        } catch (error) {
            console.log(error);

            response.send({
                response: 'failed',
                error: error
            })
        }


    })

}