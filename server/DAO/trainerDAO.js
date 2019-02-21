const randomstring = require('randomstring');


// CREATE NEW TRAINER
// ----------------------------------------------------------------------------
async function createTrainer(data, connection,verificationCode) {

    try {

        // Prepare query
        // --------------------------------------------------------------------
        let query = `INSERT INTO trainers.trainer(
            first_name, last_name, city, voivodeship, login, passw, mail,
            verification_code, is_email_confirmed)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,false) returning *;`
        
        // Prepare values
        // --------------------------------------------------------------------
        let values = [
            data.first_name, data.last_name, data.city, data.voivodeship, 
            data.login, data.passw, data.mail, verificationCode
        ]

        // Execute query
        // --------------------------------------------------------------------
        let res = await  connection.query(query,values);        
        
        // Return data
        // --------------------------------------------------------------------
        return {
            response : 'success',
            trainer : res.rows[0]
        }
    }
    // Handle error 
    // ------------------------------------------------------------------------
    catch (error) {

        console.log(error);
        return {
            response: 'failed'
        }
    }

}

// CREATE PACKAGES
// ----------------------------------------------------------------------------
async function createPackages(packages, trainerId, connection) {

    // Takes every object in array packages and creates rows in table
    try {
        for (let index = 0; index < packages.length; index++) {
            const el = packages[index];

            // Execute query
            // ----------------------------------------------------------------
            let res = await connection.query(
                `INSERT INTO trainers.trainer_package(
                trainer_id, name, duration, price)
                VALUES ( $1,$2,$3,$4);`, 
                [trainerId, el.name, el.duration, el.price]);

            if (res) {
                continue;
            } else {
                throw 'failed'
                break;
            }
        }

        return {
            response: 'success'
        }

    } catch (error) {

        console.log(error);
        return {
            response: 'failed'
        }

    }

}

// CREATE SKILLS
// ----------------------------------------------------------------------------

async function createSkills(skills,id,connection){
 
    try {

        for (let index = 0; index < skills.length; index++) {
            const el = skills[index];

           // If skill exists in database
           if(el.skill_id){
               let res = await connection.query(`INSERT INTO trainers.trainer_skill(
                skill_id, trainer_id, description)
                VALUES ($1,$2,$3);`,[el.skill_id,id,el.description]);

           // If not
           } else{
              let res = await connection.query(`INSERT INTO trainers.skill(name)
                VALUES ($1) returning *;`,[el.name]); 
            
              res = await connection.query(`INSERT INTO trainers.trainer_skill(
                skill_id, trainer_id, description)
                VALUES ($1,$2,$3);`,[res.rows[0].skill_id,id,el.description]); 
           }       
            
        }tam 
        return {
            response : 'success'
        }
    
    } catch (error) {
        console.log(error);
        return {
            response : 'failed'
        }
        
    }
    
}


// GENERATE VERIFICATION CODE
// ----------------------------------------------------------------------------
async function generateVerificationCode(connection){
 
        let shouldContinue = true;
        let code;
       
        // Generate code until it is unique
        // --------------------------------------------------------------------
        while (shouldContinue) {

            // Generate code
            code = await randomstring.generate(20);   

            // Check table users
            let users = await connection.query(`select * from kuba.users
            where verification_code =  $1 `,[code]);

            // Check table trainers
            let trainers = await connection.query(`select * from trainers.trainer
            where verification_code =  $1 `,[code]);
            
            if(users.rows.length === 0 && trainers.rows.length === 0){
                shouldContinue = false;
            }

        }

        return code;
}

// CHECK LOGIN AVAILABILITY
// ----------------------------------------------------------------------------
async function checkLogin(login,connection){

    // Prepare query
    let query = `SELECT login from trainers.trainer
                 WHERE login = $1`;
    // Prepare values
    let values = [login];

    // Execute query
    let res = await connection.query(query,values);

    if(res.rows.length > 0) {
        return 'failed'
    } else {
        return 'success'
    }
}

// CHECK E-MAIL AVAILABILITY
// ----------------------------------------------------------------------------
async function checkMail(mail,connection){

    // Prepare query
    let query = `SELECT mail from trainers.trainer
                 WHERE mail = $1`;
    // Prepare values
    let values = [mail];

    // Execute query
    let res = await connection.query(query,values);

    if(res.rows.length > 0) {
        return 'failed'
    } else {
        return 'success'
    }

}


module.exports = {
    createTrainer: createTrainer,
    createPackages: createPackages,
    createSkills : createSkills,
    generateVerificationCode : generateVerificationCode,
    checkLogin : checkLogin,
    checkMail : checkMail,

}