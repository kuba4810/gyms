const trainerDAO = require('../DAO/trainerDAO');
const trainingDAO = require('../DAO/trainingDAO');
const mail = require('../Services/email');

module.exports = (app, client) => {

    app.get('/api/trainers', async (request,response)=>{
        try {

            let res = await client.query(`SELECT * FROM trainers.trainer`);

            response.send(res.rows)
            
        } catch (error) {
            console.log(error);
        }
    })

    // Pobiera wszystkie treningi danego trenera
    /*  Request body
        {
            id : user_id or trainer_id
            type : user type (trainer or user)
        } 
     */
    // ------------------------------------------------------------------------------------------------
    app.post('/api/trainer/shedule/', (request, response) => {
        console.log('Shedule...');

        let query;

        if (request.body.type === 'trainer') {
            query = `select training_id,name,date 
                from trainers.training NATURAL JOIN trainers.trainer_shedule
                where trainer_id = $1 ; `
        } else {
            query = `select training_id,name,date 
                from trainers.training NATURAL JOIN kuba.user_shedule
                where user_id = $1 ; `
        }


        let values = [request.body.id]

        client.query(query, values)
            .then(res => res.rows)
            .then(res => {

                response.json({
                    response: 'success',
                    trainings: res
                })
            })
            .catch(err => {
                response.json({
                    response: 'failed',
                    message: 'Wystąpił błąd ! Spróbuj ponownie później'
                })
                console.log(err);

            })



    });

    // Pobiera szczegółowe dane pojedynczego treningu
    // ------------------------------------------------------------------------------------------------
    app.get('/api/trainer/training/:training_id', (request, response) => {


        console.log('Training details...');
        let response_data = {
            gym_id: null,
            user_id: null
        }

        let query = `SELECT * from trainers.training WHERE training_id = $1`;
        let values = [request.params.training_id]

        // First, trainig data
        client.query(query, values)
            .then(res => res.rows)
            .then(res => {
                response_data = Object.assign({}, response_data, res[0]);

                query = `SELECT trainer_id, first_name as "trainer_f_name", 
                                last_name as "trainer_l_name", note,
                                login as "trainer_login"
                FROM trainers.trainer NATURAL JOIN trainers.trainer_shedule
                WHERE training_id = $1;`

                // Second, trainer data
                return client.query(query, values);

            })
            .then(res => {
                response_data = Object.assign({}, response_data, res.rows[0]);

                query = `SELECT user_id, login, phone_number FROM kuba.users NATURAL JOIN kuba.user_shedule
                WHERE training_id = $1`

                // Third, user data
                return client.query(query, values);

            })
            .then(res => {
                response_data = Object.assign({}, response_data, res.rows[0]);

                query = `SELECT gym_id, gym_name from kuba.gyms natural join kuba.gym_trainngs
                WHERE training_id = $1;`

                // Fourth, gym data
                return client.query(query, values);
            })
            .then(res => {
                response_data = Object.assign({}, response_data, res.rows[0]);
                console.log(response_data);

            })
            .then(res => {
                response.send({
                    response: 'succes',
                    response_data
                })
            })
            .catch(err => {
                console.log(err);

                response.json({
                    response: 'failed',
                    message: 'Wystąpił błąd ! Spróbuj ponownie później'
                })
            })

    })

    // Get packages of specified trainer
    app.get('/api/trainer/packages/:trainer_id', (request, response) => {
        console.log('Packages...');

        let query = `SELECT * FROM trainers.trainer_package
                     WHERE trainer_id = $1`;
        let values = [request.params.trainer_id];

        client.query(query, values)
            .then(res => {
                response.send({
                    response: 'success',
                    packages: res.rows
                })
            })
            .catch(err => {
                response.send({
                    response: 'failed'
                })
                log(err);
            })

    })

    app.post('/api/trainer/selected_gyms', (request, response) => {
        console.log('Selected gyms...');

        let query = `SELECT * FROM kuba.gyms
                    WHERE gym_name ILIKE '%${request.body.gym_name}%'`;
        let values = [request.body.gym_name];

        client.query(query)
            .then(res => {
                response.send({
                    response: 'success',
                    gyms: res.rows
                })
            })
            .catch(err => {
                response.send({
                    response: 'failed'
                })
                console.log(err);
            })
    });

    // Selected users prompt
    app.post('/api/trainer/selected_users', (request, response) => {
        console.log('Selected users...', request.body);

        let query = `SELECT user_id, first_name, last_name , login , phone_number FROM kuba.users
                    WHERE first_name ILIKE '%${request.body.first_name}%'
                    and   last_name ILIKE '%${request.body.last_name}%'`;

        client.query(query)
            .then(res => {
                response.send({
                    response: 'success',
                    users: res.rows
                })
            })
            .catch(err => {
                response.send({
                    response: 'failed'
                })
                console.log(err);
            })
    });

    // Add training
    // Add rows to tables training, user_shedule, trainer_shedule and gym_training
    // If there is more than one date in array data.dates it will add multiple trainings
    app.post('/api/trainers/new-training', (request, response) => {
        console.log('New training...', request.body);

        let data = request.body;
        let values;
        var training_id = [];


        // Queries
        // --------------------------------------------------------------------
        // Query for table training
        let training_query = `INSERT INTO trainers.training(
             prize, date, duration, name, gym_name, user_name)
            VALUES ($1,$2,$3,$4,$5,$6) returning *;`

        // Query for table trainer_shedule
        let trainer_shedule_query = `INSERT INTO trainers.trainer_shedule(
            trainer_id, training_id, note)
           VALUES ($1,$2,$3);`

        // Query for table user_shedule
        let user_shedule_query = `INSERT INTO kuba.user_shedule(
            user_id, training_id)
           VALUES ($1, $2);`

        // Query for table gym_trainings
        let gym_trainings_query = `INSERT INTO kuba.gym_trainngs(
            gym_id, training_id)
            VALUES ($1,$2);`

        // Main loop
        // In every iteration another training is added
        new Promise((resolve, reject) => {
                let response;
                for (let i = 0; i < data.dates.length; i++) {
                    const element = data.dates[i];

                    // Id of latest created training


                    var values;
                    values = [data.price, element, data.duration,
                        data.training_name, data.gym_name, data.user_name
                    ];

                    // First, table training
                    client.query(training_query, values)
                        .then(res => res.rows[0])
                        .then(res => {

                            // Assign id of created training to variable training_id
                            training_id.push(res.training_id);
                            return Promise.resolve(res.training_id);
                        })
                        .then(res => {

                            console.log('res.training_id : ', res);
                            console.log('training id var ', training_id);


                            values = [data.trainer_id, res, data.description];
                            // Second, table trainer_shedule
                            return client.query(trainer_shedule_query, values)
                        })
                        .then(res => {
                            // If user_id is in request.body
                            if (data.user_id !== null) {
                                // console.log();
                                console.log('Tworze dla usera: ', training_id);

                                values = [data.user_id, training_id[i]];
                                // Third, table user_shedule
                                return client.query(user_shedule_query, values)
                            } else {
                                // If user_id is null
                                Promise.resolve('Next');
                            }

                        })
                        .then(res => {
                            // If gym_id is in request.body
                            if (data.gym_id !== null) {
                                values = [data.gym_id, training_id[i]];

                                // Fourth and the last, table gym_trainings 
                                return client.query(gym_trainings_query, values);
                            }
                            // This is the last step, so if gym_id is null
                            // loop will start next iteration
                        })
                        .catch(err => {
                            console.log(err);
                            response = 'failed';

                        })
                }
                response = 'succes';

                if (response = 'succes') {
                    resolve(response);
                } else {
                    reject(response);
                }


            })
            .then(res => {
                console.log('Udało się ! ');

                response.send({
                    response: 'success'
                })
            })
            .catch(err => {
                response.send({
                    response: 'failed'
                })
            })


    })


    // TRAINER REGISTER
    // ------------------------------------------------------------------------
    // ------------------------------------------------------------------------
    // ------------------------------------------------------------------------
    app.post('/api/trainer/register', async (request, response) => {

        let data = request.body;
        console.log('Trainer register... ', data);


        try {

            // Check login availability
            // ---------------------------------------------------------------
            let res = await trainerDAO.checkLogin(data.trainer.login, client);

            if (res === 'failed') {
                throw {
                    message: 'Ten login jest już zajęty !'
                }
            }

            // Check mail availability
            // ---------------------------------------------------------------
            res = await trainerDAO.checkMail(data.trainer.mail, client);

            if (res === 'failed') {
                throw {
                    message: 'Ten mail jest już zajęty !'
                }
            }

            // Generate verification code
            // ---------------------------------------------------------------
            const code = await trainerDAO.generateVerificationCode(client);

            // Create trainer
            // ----------------------------------------------------------------
            res = await trainerDAO.createTrainer(data.trainer, client, code);
            if (res.response === 'failed') {
                throw {
                    response: 'failed'
                }
            }

            const id = res.trainer.trainer_id;

            // Create packages
            // ----------------------------------------------------------------
            res = await trainerDAO.createPackages(data.packages, id, client);
            if (res.response === 'failed') {
                throw {
                    response: 'failed'
                }
            }

            // Create skills
            // ----------------------------------------------------------------
            res = await trainerDAO.createSkills(data.skills, id, client);
            if (res.response === 'failed') {
                throw {
                    response: 'failed'
                }
            }

            // Send mail
            // ----------------------------------------------------------------
            const mailData = {
                trainer_id: id,
                login: data.trainer.login,
                code: code,
                mail: data.trainer.mail
            }

            console.log('Wysyłam maila !');

            res = await mail.trainerWelcomeMail(mailData);

            if (res === 'failed') {
                throw {
                    response: 'failed'
                }
            }

            response.send({
                response: 'success'
            })

        } catch (error) {

            console.log(error);

            if (error.message) {
                response.send({
                    response: 'failed',
                    messsage: error.message
                })
            } else {

                response.send({
                    response: 'failed',
                    messsage: 'server-error'
                })

            }

        }

    });


    // EDIT TRAINING
    // ------------------------------------------------------------------------
    // ------------------------------------------------------------------------    
    // ------------------------------------------------------------------------
    app.post('/api/training/edit', async (request, response) => {

        try {

            console.log('Edit training...', request.body);

            // Execute function from trainingDAO
            // ----------------------------------------------------------------
            let res = await trainingDAO.editTraining(request.body, client);

            if (res.response === 'success') {

                response.send({
                    response: 'success'
                })

            } else {
                throw 'failed';
            }
            // ----------------------------------------------------------------

        } catch (error) {

            response.send({
                response: 'failed'
            })

        }

    });

    // DELETE TRAINING
    // ------------------------------------------------------------------------
    // ------------------------------------------------------------------------    
    // ------------------------------------------------------------------------
    app.post('/api/training/delete', async (request, response) => {

        console.log('Delete training', request.body);


        try {

            // Execute function from trainingDAO
            // ----------------------------------------------------------------
            let res = await trainingDAO.deleteTraining(request.body.training_id, client);



            if (res.response === 'success') {

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


    // GET TRAINER DATA
    // ------------------------------------------------------------------------
    app.get('/api/trainer/data/:id', async (request, response) => {

        try {

            let res = await trainerDAO.getTrainerData(request.params.id, client)

            console.log('Dane trenera: ',res);
            

            if (res.response === 'success') {
                response.send({
                    response: 'success',
                    data: res.data
                })
            } else {
                throw 'failed'
            }

        } catch (error) {

            console.log(error);
            response.send({
                response: 'failed'
            })


        }

    })

    // UPDATE TRAINER PROFILE
    // ------------------------------------------------------------------------
    app.post('/api/trainer/update', async (request, response) => {

        try {

            let res = await trainerDAO.updateProfile(request.body, client);

            response.send({
                response: res.response
            })

        } catch (error) {

            console.log(error);
            response.send({
                response: 'failed'
            })

        }

    });


    // ADD PACKAGE
    // ------------------------------------------------------------------------
    app.post('/api/package', async (request, response) => {

        console.log('Endpoint : ', request.body);
        
        console.log('Add package...');
        
        try {

            let res = await trainerDAO.addPackage(request.body, client);

            
            response.send({
                response: res.response
            })


        } catch (error) {
            console.log(error);
            response.send({
                response: 'failed'
            })
        }

    })

    // EDIT PACKAGE
    // ------------------------------------------------------------------------
    app.post('/api/package/edit', async (request, response) => {

        try {

            console.log(request.body);
            

            let res = await trainerDAO.editPackage(request.body, client);

            response.send({
                response: res.response
            })


        } catch (error) {
            console.log(error);
            response.send({
                response: 'failed'
            })
        }

    })


    // DELETE PACKAGE
    // ------------------------------------------------------------------------
    app.post('/api/package/delete', async (request, response) => {

        try {

            let res = await trainerDAO.deletePackage(request.body.package_id, client);

            response.send({
                response: res.response,
                package_id : res.package_id
            })


        } catch (error) {
            console.log(error);
            response.send({
                response: 'failed'
            })
        }

    })


    // ADD SKILL
    // ------------------------------------------------------------------------
    app.post('/api/skill', async (request, response) => {

        try {

            let res = await  trainerDAO.addSKill(request.body, client);

            if (res.response = 'success') {
                response.send({
                    response: 'success',
                    skill_id: res.skill_id
                })
            } else {
                response.send({
                    response: 'failed'
                })
            }


        } catch (error) {
            console.log(error);
            response.send({
                response: 'failed'
            })
        }

    })

    // EDIT SKILL
    // ------------------------------------------------------------------------
    app.post('/api/skill/edit', async (request, response) => {

        try {

            let res = await trainerDAO.editSkill(request.body, client);

            response.send({
                response : res.response
            })


        } catch (error) {
            console.log(error);
            response.send({
                response: 'failed'
            })
        }

    })

    // DELETE SKILL
    // ------------------------------------------------------------------------
    app.post('/api/skill/delete', async (request, response) => {

        try {

            let res = await trainerDAO.deleteSkill(request.body.skill_id, client);

            response.send({
                response : res.response
            })


        } catch (error) {
            console.log(error);
            response.send({
                response: 'failed'
            })
        }

    })


    // CHANGE AVATAR
    // ------------------------------------------------------------------------
    app.post('/api/trainer/avatar', async (request,response) =>{

        try {

            console.log('Trainer change photo',request.files);
            let file = request.files.avatar;
            let fileName = request.files.avatar.name;

            let res = trainerDAO.changePhoto(file,fileName,client);

            if(res.response === 'failed'){
                throw 'failed'
            }

            response.send({
                response : 'success'
            })
            
        } catch (error) {
            
            console.log(error);
            response.send({
                response : 'failed'
            })

        }

    })


    // ADD NEW PHOTO
    // ------------------------------------------------------------------------
    app.post('/api/trainer/photo', async (request,response) =>{
        
        try {

            // console.log('Trainer add photo...',request.files);

            // Prepare data
            let file = request.files.avatar;
            let fileName = request.files.avatar.name;

            // console.log(fileName);
            // let login = fileName.split('_')[0];
            // console.log(login);

            // Get trainer id
            let res = await trainerDAO.getTrainerId(fileName,client);

            if(res.response === 'failed'){
                throw 'failed'
            }

            res = res.trainer_id;

            // Add photo
            res = await trainerDAO.addPhoto(file,fileName,res,client);

            if(res.response === 'failed'){
                throw 'failed'
            }

            response.send({
                response : 'success',
                photo_id : res.photo_id
            })
            
        } catch (error) {
            
            console.log(error);

            response.send({
                response : 'failed'
            })

        }

    })

    // DELETE AVATAR
    // ------------------------------------------------------------------------
    app.post('/api/trainer/photo/delete', async (request, response) => {

        try {

            let res = trainerDAO.deleteAvatar(request.body.login,client);

            if(res.response === 'failed'){
                throw 'failed'
            }

            response.send({
                response : 'success'
            })

        } catch (error) {
            console.log(error);

            response.send({
                reponse: 'failed'
            })
        }

    });

    // DELETE PHOTO
    // ------------------------------------------------------------------------
    app.post('/api/trainer/album/photo/delete', async (request, response) => {

        try {

            let res = trainerDAO.deletePhoto(request.body.photo_name,client);

            if(res.response === 'failed'){
                throw 'failed'
            }

            response.send({
                response : 'success'
            })

        } catch (error) {
            console.log(error);

            response.send({
                reponse: 'failed'
            })
        }

    });
};