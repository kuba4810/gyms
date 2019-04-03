const userDAO = require('../DAO/userDAO');
const trainerDAO = require('../DAO/trainerDAO');
const sendMail = require('../Services/email');
const multer = require("multer");
const fileToArrayBuffer = require('file-to-array-buffer');
var FileReader = require('filereader')

module.exports = (app, client) => {


    /* REGISTER */
    app.post('/register', function (request, response) {

        var data = request.body;
        console.log("Dane do rejestracji : ", data)
        var values = [data.login, data.password, data.email]
        let verification_code;

        //INSERT INTO USERS
        let userQuery = `INSERT INTO kuba.users 
    (first_name, last_name, login, passw, email, join_date, height, mass, favourite_exercise, is_blocked, is_email_confirmed)
    VALUES('','',$1,$2,$3,CURRENT_TIMESTAMP,0,0,'',false,false)
    returning *`;

        // Sprawdź czy login zajęty
        client.query(`SELECT * FROM kuba.users WHERE login = $1`, [data.login])
            .then(res => {
                if (res.rows.length > 0) {
                    response.json({
                        response: 'failed',
                        message: "Ten login jest już zajęty !"
                    })
                    return Promise.reject('')

                } else {
                    // Sprawdź czy email zajęty
                    return client.query(`SELECT * FROM kuba.users WHERE email = $1`, [data.email])
                }
            }).then(res => {
                if (res.rows.length > 0) {
                    response.json({
                        response: 'failed',
                        message: 'E-mail już w użyciu'
                    })
                    return Promise.reject('')
                } else {
                    // Dodaj użytkownika do bazy
                    return client.query(userQuery, values)
                }
            }).then(res => {
                let user_id = res.rows[0].user_id;
                verification_code = randomstring.generate(15);
                // Dodaj kod weryfikacyjny
                return client.query(`INSERT INTO kuba.email_verification_codes 
            (user_id,verification_code)
            VALUES($1,$2) returning *`, [user_id, verification_code])

            }).then((res) => {
                let user_id = res.rows[0].user_id;
                let result = sendEmail(user_id, verification_code, data.email, data.login);
                if (result === 'Failed') {
                    return Promise.reject(`Email sending failed !`)
                }
                console.log('Wysłałem maila, dostałem odpowiedź: ', result);

                response.json({
                    response: 'success',
                    message: 'Udało się zarejestrować !'
                })
            }).catch(err => {
                console.log(err);
                if (err !== '') {
                    response.json({
                        response: 'failed',
                        message: 'Wystąpił błąd, spróbuj ponownie później bądź skontaktuj się z administratorem'
                    });
                }
            })

    });



    /* ------------------------------ */

    /* LOG IN */
    /* -------------------------------------------------------------------------------------- */

    app.post('/logIn', function (request, response) {
        console.log('Log in...');

        let data = request.body;
        console.log(data);

        let values = [data.Login, data.Password]
        let schema = data.type === 'user' ? 'kuba' : 'trainers';
        let user_table = data.type === 'user' ? 'users' : 'trainer';
        let table_name = data.type === 'user' ? 'user_messages' : 'trainer_messages';
        let column_name = data.type === 'user' ? 'user_id' : 'trainer_id';


        var responseData = {
            messageCount: 0,
            notificationsCount: 0,
            userData: {
                user_id: '',
                login: '',
                isEmailConfirmed: ''
            }

        }

        client.query(`SELECT * FROM ${schema}.${user_table} WHERE login = $1 and passw = $2`, values)
            .then(res => {
                if (res.rows.length == 0) {
                    return Promise.reject({
                        type: "loginFailed",
                        message: 'Błędny login lub hasło !'
                    })
                } else {
                    let userData = {
                        user_id: res.rows[0][column_name],
                        login: data.Login,
                        isEmailConfirmed: res.rows[0].is_email_confirmed,
                        image: res.rows[0].image
                    }
                    console.log("Dane użytkownika: ", userData);
                    // Msg count    
                    var query = `SELECT count(*) as "msg_count" 
                FROM ${schema}.${table_name} m_t natural join kuba.messages ms
                WHERE m_t.${column_name} = $1 and ms.is_read = false and m_t.type='receiver'`

                    console.log('Query: ', query);


                    responseData = Object.assign({}, responseData, {
                        userData: userData
                    });
                    return client.query(query, [res.rows[0][column_name]])
                }
            }).then(res => {
                responseData = Object.assign({}, responseData, {
                    messageCount: res.rows[0].msg_count
                })
                // Ntf count
                if (data.type === 'user') {
                    return client.query(`SELECT count(*) as "ntf_count" 
                FROM kuba.user_notifications natural join kuba.notifications
                WHERE user_id=$1 and is_read = false`, [responseData.userData.user_id])
                } else {
                    return client.query(`SELECT count(*) as "ntf_count" 
                FROM trainers.trainer_notifications natural join kuba.notifications
                WHERE trainer_id=$1 and is_read = false`, [responseData.userData.user_id])
                }

            }).then((res) => {
                responseData = Object.assign({}, responseData, {
                    notificationsCount: res.rows[0].ntf_count
                })
                console.log("Dane użytkownika wraz z liczbą wiadomości i powiadomień : ", responseData);
                response.json({
                    type: 'success',
                    data: responseData
                })
            }).catch(err => {
                console.log(err);
                if (typeof (err.type) !== 'undefined') {
                    console.log('Wysyłam błąd failed');
                    response.json(err)
                } else {
                    response.json({
                        type: 'serverError',
                        message: 'Wystąpił błąd, spróbuj ponownie później !'
                    })
                }
            })


    });


    /* USER DATA */
    /* ------------------------------ */
    app.get('/getUserData/:login', (request, response) => {
        var login = request.params.login;

        console.log("Parametr: ", login);

        var query = `SELECT users.*,us.*
                 FROM kuba.users natural join kuba.user_statistics us
                 WHERE users.login = $1`;
        var values = [login];

        client.query(query, values)
            .then(res => {

                if (res.rows.length > 0) {
                    response.send({
                        response: 'success',
                        type: 'user',
                        data: res.rows[0]
                    })
                    return Promise.reject('Done');
                } else {
                    return client.query(`SELECT trainer.*
            FROM trainers.trainer
            WHERE login = $1`, [login])
                }
            })
            .then(res => {
                response.send({
                    response: 'success',
                    type: 'trainer',
                    data: res.rows[0]
                })
            })
            .catch(err => {
                if (err !== 'Done') {
                    response.send({
                        response: 'failed'
                    })
                }
                console.log(err);

            })




    });


    // Pobiera liczbę nowych wiadomości danego użytkownika
    // Na podstawie własności typ sprawdza czy pobrać dane trenera czy użytkownika
    app.get('/api/user/:user_id/:type/msgCount', (request, response) => {
        console.log('msgCount...');


        // Ustalanie nazw schematów, tabel i kolumn
        let schema = request.params.type === 'user' ? 'kuba' : 'trainers';
        let table_name = request.params.type === 'user' ? 'user_messages' : 'trainer_messages';
        let column_name = request.params.type === 'user' ? 'user_id' : 'trainer_id';

        let query = `SELECT count(*) as "msg_count" 
    FROM ${schema}.${table_name} m_t natural join kuba.messages ms
    WHERE m_t.${column_name} = $1 and ms.is_read = false and m_t.type='receiver'`;
        console.log('Query: ', query)
        console.log(request.params.type, schema, table_name, column_name);


        client.query(query, [request.params.user_id])

            .then(res => {
                if (res.rows.length > 0) {
                    response.json({
                        response: 'success',
                        data: res.rows[0].msg_count
                    })
                } else {
                    return Promise.reject({
                        type: 'failed'
                    })
                }
            })
            .catch(err => {
                console.log(err);
                response.json({
                    response: 'failed'
                })
            })

    });


    // Pobiera liczbę nowych powiadomień danego użytkownika
    // Na podstawie własności typ sprawdza czy pobrać dane trenera czy użytkownika
    app.get('/api/user/:user_id/:type/ntfCount', (request, response) => {


        // Ustalanie nazw schematów, tabel i kolumn
        let query;
        let values = [request.params.user_id];
        if (request.params.type === 'user') {
            query = `SELECT count(*) as "ntf_count" 
                 FROM kuba.user_notifications natural join kuba.notifications
                 WHERE user_id = $1 and is_read = false`
        } else {
            query = `SELECT count(*) as "ntf_count" 
                 FROM trainers.trainer_notifications natural join kuba.notifications
                 WHERE trainer_id = $1 and is_read = false`
        }

        client.query(query, values)
            .then(res => {
                console.log(res.rows);

                if (res.rows.length > 0) {
                    response.json({
                        response: 'success',
                        data: res.rows[0].ntf_count
                    })
                } else {
                    return Promise.reject({
                        type: 'failed'
                    })
                }
            })
            .catch(err => {
                response.json({
                    response: 'failed'
                })
            })

    });

    // Pobiera dane użytkownika lub trenera
    // W body powinno się znajdować id konta oraz jego typ
    // Na podstawie typu pobiera dane z odpowiednich tabel
    app.post('/api/user', (request, response) => {
        console.log('User data...');

        let data = request.body;
        let query = '';
        let values = [data.id];

        if (data.type === 'user') {
            query = 'SELECT * FROM kuba.users WHERE user_id = $1';
        } else if (data.type === 'trainer') {
            query = 'SELECT * FROM trainers.trainer WHERE trainer_id = $1';
        }

        // Wykonanie zapytania
        client.query(query, values)
            .then(res => res.rows)
            .then(res => {
                response.send({
                    response: 'success',
                    data: res[0]
                });
            })
            .catch(err => {
                console.log(err);
                response.send({
                    response: 'failed'
                });
            });

    })


    // Edycja profilu
    // Otrzymuje obiekt zawierający dane użytkownika lub klienta
    // Na podstawie własności typ aktualizowana jest tabela users lub trainers

    /* 
        {
            type : '',
            id : '',
            data : {
                ...
            }
        }
    */

    app.post('/api/user/edit-profile', (request, response) => {
        console.log('Edit profile...', request.body);

        let data = request.body;
        let query = '';
        let values = '';

        // Przesłano dane użytkownika
        if (data.type === 'user') {
            query = `UPDATE kuba.users
            SET first_name=$1, last_name=$2, login=$3, 
                height=$4, mass=$5, favourite_exercise=$6,
                phone_number=$7
            WHERE user_id = $8;`;

            values = [data.data.first_name, data.data.last_name, data.data.login,
                data.data.height, data.data.mass,
                data.data.favourite_exercise, data.data.phone_number,
                data.id
            ];

            // Przesłano dane trenera
        } else if (data.type === 'trainer') {
            query = `UPDATE trainers.trainer
                     SET first_name=$1, last_name=$2, city=$3, voivodeship=$4,
                         login=$5 
                     WHERE trainer_id = $6;`;
            values = [data.data.first_name, data.data.last_name, data.data.city,
                data.data.voivodeship, data.data.login,
                data.id
            ];
        }

        // Wykonanie zapytania
        client.query(query, values)
            .then(res => {
                console.log(res);

                response.send({
                    response: 'success'
                });
            })
            .catch(err => {
                console.log(err);

                response.send({
                    response: 'failed'
                })
            })

    })


    // CHECK ACCOUNT TYPE
    // ------------------------------------------------------------------------
    app.post('/api/account/type', async (request, response) => {

        console.log('Account type...');

        try {

            let res = await userDAO.checkAccountType(request.body.login, client);

            if (res.response === 'failed') {
                throw 'failed';
            } else {
                response.send({
                    response: 'success',
                    type: res.type,
                    id: res.id
                })
            }

        } catch (error) {

            console.log(error);

            response.send({
                response: 'failed'
            })


        }

    })

    // GET USER DATA
    // ------------------------------------------------------------------------
    app.post('/api/user/data', async (request, response) => {

        console.log('User data...', request.body)

        try {

            let res = await userDAO.getUserData(request.body.user_id, client);

            if (res.response === 'failed') {
                throw 'failed';
            }

            response.send({
                response: 'success',
                user: res.user
            })

        } catch (error) {

        }

    })

    // ADD NEW PHOTO
    // ------------------------------------------------------------------------
    app.post('/api/user/photo', async (request, response) => {

        let uploadFile = request.files.avatar
        const fileName = request.files.avatar.name



        try {

            let res = await userDAO.addNewPhoto(uploadFile, fileName, client);

            if (res.response === 'failed') {
                throw 'failed';
            }

            res = await userDAO.savePhotoInDB(fileName, client);

            if (res.response === 'failed') {
                throw 'failed';
            }

            response.send({
                response: 'success'
            })

        } catch (error) {

            console.log(error);

            response.send({
                reponse: 'failed'
            })

        }

    })

    // DELETE AVATAR
    // ------------------------------------------------------------------------
    app.post('/api/user/photo/delete', async (request, response) => {

        try {

            let res = userDAO.deleteAvatar(request.body.login, client);

            if (res.response === 'failed') {
                throw 'failed'
            }

            response.send({
                response: 'success'
            })

        } catch (error) {
            console.log(error);

            response.send({
                reponse: 'failed'
            })
        }

    });

    // GENERATE RESET CODE
    // ------------------------------------------------------------------------
    app.post('/api/user/reset-code', async (request, response) => {

        // console.log('Resetowanie hasła...', request.body)

        try {

            let data = request.body;

            // Find user
            let res = await userDAO.getUserByMail(data.mail, client);

            if (res.response === 'failed') {

                throw {
                    errorCode: -1
                }

            }

            let userData = {
                id: res.type === 'user' ? res.data.user_id : res.data.trainer_id,
                login: res.data.login,
                mail: data.mail,
                type: res.type
            }

            // Generate code
           if(userData.type === 'user'){
                res = await userDAO.generatePasswordCode(userData.id, client);
           } else {
                res = await trainerDAO.generatePasswordCode(userData.id, client);
           }

            console.log(res);

            if (res.response === 'failed') {
                throw {
                    errorCode: 0
                }
            }

            // Send mail
            const mailData = Object.assign({}, userData, {
                code: res.code
            })

            res = await sendMail.passwordResetCode(mailData);

            if (res === 'failed') {
                throw {
                    errorCode: 0
                }
            }

            response.send({
                response: 'success'
            })



        } catch (error) {

            console.log('Błąd endpoint : ', error);

            response.send({
                response: 'failed',
                errorCode: error.errorCode
            })

        }

    })

    // FIND USER BY PASSWORD RESET CODE
    // ------------------------------------------------------------------------
    app.post('/api/user/check-code', async (request, response) => {

        try {

            console.log('Endpoint check Code',request.body);
            let res = await userDAO.findUserByPswCode(request.body.code, client);

            console.log('Endpoint response',res);

            if(res.response === 'failed'){
                throw {
                    errorCode : res.errorCode
                }
            }

            console.log('Zwracam sukces :D');

            response.send({
                response : 'success',
                id : res.id,
                type : res.type
            });


        } catch (error) {

            console.log(error);

            response.send({
                response: 'failed',
                errorCode : error.errorCode ? error.errorCode : 0
            })

        }

    });

    // CHANGE PASSWORD
    // ------------------------------------------------------------------------
    app.post('/api/user/change-password', async (request, response) => {

        try {

            let data = request.body;

            let res = await userDAO.changePassword(data.user_id,data.password, client);

            if(res.response === 'failed'){
                throw 'failed'
            }

            response.send({
                response : 'success'
            })

        } catch (error) {

            response.send({
                response: 'failed'
            })

        }

    });


};