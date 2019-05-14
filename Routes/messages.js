module.exports = (app, client) => {

    // Mark message as READ 
    // ------------------------------------------------------------------------------------------------
    app.get('/markMessageAsRead/:messageId', (request, response) => {
        const messageId = request.params.messageId;
        console.log(messageId);


        var query = `UPDATE kuba.messages SET is_read = true WHERE message_id = $1`;
        var values = [messageId];

        client.query(query, values)
            .then(res => {
                response.json({
                    response: "Success"
                });
            })
            .catch(err => {
                if (err !== 'Done') {
                    console.log(err);
                    response.json({
                        response: 'Failed'
                    })
                }
            })


    });

    // Delete message
    // ------------------------------------------------------------------------------------------------
    app.post("/deleteMessage", (request, response) => {
        var data = request.body;
        var query = '';
        var values = [data.message_id];

        console.log("Dane w zapytaniu: ", request.body);

        switch (data.userType) {
            case 'sender':
                query = `UPDATE kuba.messages SET sender_deleted = true WHERE message_id = $1`
                break;

            case 'receiver':
                query = `UPDATE kuba.messages 
                         SET receiver_deleted = true,
                             is_read = true
                              WHERE message_id = $1`
                break;
        }


        console.log("Utworzone zapytanie: ", query);
        client.query(query, values)
            .then(res => {
                response.json({
                    response: "Success"
                });
            })
            .catch(err => {
                if (err !== 'Done') {
                    response.json({
                        response: 'Failed'
                    })
                }
            })




    });

    // Get all messages
    // ------------------------------------------------------------------------------------------------
    app.get('/getMessages/:user_id/:type', (request, response) => {
        console.log('GetMessages...')


        //  Pobiera parametry żądania
        var user_id = request.params.user_id;
        var type = request.params.type;

        // Sprawdza typ użytkownika i ustala odpowiednie nazwy schematów, tabel i kolumn
        let table_name = (type === 'user') ? 'user_messages' : 'trainer_messages';
        let schema_name = (type === 'user') ? 'kuba' : 'trainers';
        let id_name = (type === 'user') ? 'user_id' : 'trainer_id';
        let table_for_login = (type === 'user') ? 'users' : 'trainer';

        var query = `SELECT m.*, ${table_name}.* ,
        (select login from kuba.users where user_id = (select user_id from kuba.user_messages where type='sender' and message_id = m.message_id)) as "user_sender",
        (select login from trainers.trainer where trainer_id = (select trainer_id from trainers.trainer_messages where type='sender' and message_id = m.message_id)) as "trainer_sender"	
                     FROM  ${schema_name}.${table_name} natural join kuba.messages m 
                     WHERE ${id_name} = $1 and sender_deleted = false
                     ORDER BY sending_date desc`

        // var query = `SELECT message_id ,login ,sender,receiver, sending_date,message_content,is_read, receiver_deleted,sender_deleted 
        //             FROM kuba.users  INNER JOIN kuba.messages ON( users.user_id = messages.sender)
        //             WHERE (receiver = $1 and receiver_deleted = false) OR (sender =$1 and sender_deleted = false)  ORDER BY sending_date DESC;`
        var values = [user_id];

        client.query(query, values)
            .then(res => res.rows)
            .then(res => {
                console.log('Pobrane wiadomości: ', res);
                response.send(res);
            })
            .catch(err => {
                console.log('Wystąpił błąd: ', err);
            })




    });


    // Otrzymuje message_id i sprawdza typ użytkownika który jest odbiorcą oraz zwraca jego id
    app.get('/api/message/sender-data/:message_id', (request, response) => {
        console.log('sender-data...');

        let message_id = request.params.message_id;
        client.query(`SELECT um.*,login FROM kuba.user_messages um natural join kuba.users
                      WHERE message_id = $1 and type='sender'`, [message_id])
            .then(res => {
                if (res.rows.length > 0) {
                    response.send({
                        response: 'success',
                        data: {
                            user_id: res.rows[0].user_id,
                            user_type: 'user',
                            login: res.rows[0].login
                        }
                    })
                    return Promise.reject('Done');
                } else {
                    return client.query(`SELECT tm.*,login 
                                     FROM trainers.trainer_messages tm natural join trainers.trainer
                                     WHERE message_id = $1 and type='sender' `, [message_id])
                }
            })
            .then(res => {
                response.send({
                    response: 'success',
                    data: {
                        user_id: res.rows[0].trainer_id,
                        user_type: 'trainer',
                        login: res.rows[0].login
                    }
                })
            })
            .catch(err => {
                if (err !== 'Done') {
                    console.log('Wystąpił błąd: ', err);
                    response.send({
                        response: 'failed'
                    })
                }

            })
    })

    // Otrzymuje login i sprawdza typ użytkownika który jest odbiorcą oraz zwraca jego id
    app.get('/api/message/sender-login-data/:user_login', (request, response) => {


        let login = request.params.user_login;
        console.log('sender-data... ', login);
        client.query(`SELECT login,user_id FROM kuba.users
                      WHERE login = $1;`, [login])
            .then(res => {
                if (res.rows.length > 0) {
                    console.log('Znalazłem usera');

                    response.send({
                        response: 'success',
                        data: {
                            user_id: res.rows[0].user_id,
                            user_type: 'user',
                            login: res.rows[0].login
                        }
                    })
                    return Promise.reject('Done');
                } else {
                    return client.query(`SELECT login ,trainer_id
                                     FROM  trainers.trainer
                                     WHERE login = $1 `, [login])
                }
            })
            .then(res => {
                console.log('Znalazłem trenera');
                response.send({
                    response: 'success',
                    data: {
                        user_id: res.rows[0].trainer_id,
                        user_type: 'trainer',
                        login: res.rows[0].login
                    }
                })
            })
            .catch(err => {
                if (err !== 'Done') {
                    console.log('Wystąpił błąd: ', err);
                    response.send({
                        response: 'failed'
                    })
                }

            })
    })


    /* NEW MESSAGE */
    /* ------------------------------ */
    app.post('/newMessage', function (request, response) {
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

        console.log('NewMessage...: ', request.body);


        //  Zapytanie wstawiania rekordu dla tabeli messages
        var query = `INSERT INTO kuba.messages(sending_date, message_content, is_read, receiver_deleted, sender_deleted)
                 VALUES(CURRENT_TIMESTAMP,$1,false,false,false) returning *`

        // Generowanie zapytania dla odbiorcy
        if (data.sender_type === 'user') {
            sender_message_query = `INSERT INTO kuba.user_messages
                               (user_id, message_id, type)
                               VALUES ($1,$2,'sender');`
        } else {
            sender_message_query = `INSERT INTO trainers.trainer_messages
                                (trainer_id, message_id, type)
                                 VALUES ($1,$2,'sender');`
        }
        console.log('Sender query: ', sender_message_query);

        // Generowanie zapytania dla nadawcy 
        if (data.receiver_type === 'user') {
            receiver_message_query = `INSERT INTO kuba.user_messages
                               (user_id, message_id, type)
                               VALUES ($1,$2,'receiver');`
        } else {
            receiver_message_query = `INSERT INTO trainers.trainer_messages
                                (trainer_id, message_id, type)
                                 VALUES ($1,$2,'receiver');`
        }
        console.log('Receiver query: ', receiver_message_query);
        var values = [data.text];


        // Insert to messages
        client.query(query, values)
            .then(res => {
                new_message_id = res.rows[0].message_id;
                // Insert for sender
                return client.query(sender_message_query, [data.sender, new_message_id])
            })
            .then(res => {
                // Insert for receiver
                return client.query(receiver_message_query, [data.receiver, new_message_id])
            })
            .then(res => {
                response.send({
                    response: 'success'
                })
            })
            .catch(err => {
                console.log('Podczas wysyłania wiadomości wystąpił błąd: ', err);
                response.send({
                    response: 'failed'
                })

            })

    });



    app.get('/updateMsgNot/:user_id', (req, res) => {
        var user_id = req.params.user_id;

        var responseData = {
            messageCounter: '',
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
        pool2.query(query, values, function (err, response) {
            console.log("Liczba wiadomości:", response.rows[0].msg_count);
            responseData = {
                ...responseData,
                messageCount: response.rows[0].msg_count
            }
            console.log("Stan obiektu:", responseData);

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
        pool2.query(query, values, function (err, resp) {
            console.log("Liczba powiadomień:", resp.rows[0].ntf_count);
            responseData = {
                ...responseData,
                notificationsCount: resp.rows[0].ntf_count
            }
            console.log("Stan obiektu:", responseData);
            res.json(responseData)
            pool2.end();
        });
    });

    app.get('/api/message/count/:userId', async (request, response) => {
        let id = request.params.userId;



    })
};