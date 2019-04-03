const mkdir = require('make-dir');
const path = require('path');
const fs = require('fs');
const randomstring = require('randomstring');
const dateService = require('../Services/date');

// GET USER DATA
// ----------------------------------------------------------------------------
async function getUserData(user_id, connection) {

    try {


        // Table USERS
        let query = `SELECT * FROM kuba.users NATURAL JOIN kuba.user_statistics
                     WHERE user_id = $1`;
        let values = [user_id];
        let res = await connection.query(query, values);
        res = res.rows[0];

        return {
            response: 'success',
            user: res
        }


    } catch (error) {

        console.log(error);
        return {
            response: 'failed'
        }


    }

}

// GET USER BY MAIL
// ----------------------------------------------------------------------------
async function getUserByMail(mail, connection) {

    try {

        let res = await connection.query(`SELECT * from kuba.users WHERE email = $1`, [mail]);

        if (res.rows.length > 0) {
            return {
                response: 'success',
                type: 'user',
                data: res.rows[0]
            }
        }

        res = await connection.query(`SELECT * from trainers.trainer WHERE mail = $1`, [mail]);

        if (res.rows.length > 0) {
            return {
                response: 'success',
                type: 'trainer',
                data: res.rows[0]
            }
        }

        return {
            response: 'failed'
        }



    } catch (error) {
        console.log(error);
        return {
            response: 'failed'
        }
    }

}


// CHECK ACCOUNT TYPE
// ----------------------------------------------------------------------------
async function checkAccountType(login, connection) {

    try {

        // Check table USERS  
        let query = `SELECT user_id,login FROM kuba.users WHERE login = $1;`
        let values = [login];
        let res = await connection.query(query, values);

        if (res.rows.length > 0) {
            return {
                response: 'success',
                type: 'user',
                id: res.rows[0].user_id
            }
        }

        //  Check table TRAINERS
        query = `SELECT trainer_id, login FROM trainers.trainer WHERE login = $1;`
        res = await connection.query(query, values);

        if (res.rows.length > 0) {
            return {
                response: 'success',
                type: 'trainer',
                id: res.rows[0].trainer_id
            }
        }

        return {
            response: 'success',
            type: 'not-found'
        }

    } catch (error) {

        console.log(error);

        return {
            response: 'failed'
        }


    }

}

// SAVE PHOTO ON SERVER
// ----------------------------------------------------------------------------
async function addNewPhoto(uploadFile, fileName, connection) {

    try {

        await uploadFile.mv(`./public/images/${fileName}.jpg`,
            (err) => {
                if (err) {
                    throw err;
                }
            });

        return {
            response: 'success',
        }

    } catch (error) {

        console.log(error);

        return {
            response: 'failed'
        }

    }

}

// UPDATE PHOTO IN DATABASE
// ----------------------------------------------------------------------------
async function savePhotoInDB(login, connection) {

    try {
        console.log('Saving photo in db...', login);


        let res = await connection.query(`UPDATE kuba.users
                         SET image = $1
                         WHERE login = $2`,
            [login, login]);

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

// DELETE AVATAR
// ----------------------------------------------------------------------------
async function deleteAvatar(login, connection) {

    try {

        // Delete from database
        let query = `UPDATE kuba.users SET image = $1 WHERE login = $2`;
        let values = [null, login];

        let res = connection.query(query, values);

        // Delete file from server
        const filePath = `./public/images/${login}.jpg`;

        fs.access(filePath, async error => {
            if (!error) {
                await fs.unlink(filePath, function (error) {
                    console.log(error);
                });
            } else {
                console.log(error);
                return {
                    response: 'failed'
                }
            }
        });

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

// GENERATE CHANGE PASWORD CODE
// ----------------------------------------------------------------------------
async function generatePasswordCode(user_id, connection) {

    try {

        let isValid = true;
        let code;
        let ifExists = false;

        // Check if code already exists
        let res = await connection.query(`SELECT * FROM kuba.change_password_code WHERE
            user_id = $1`, [user_id]);

        if (res.rows.length > 0) {
            ifExists = true;
        }

        // Generate unique code
        do {

            code = randomstring.generate(20);

            // Check user codes
            res = await connection.query(`SELECT code FROM kuba.change_password_code
        WHERE code = $1`, [code])

            if (res.rows.length > 0) {
                isValid = false;
            } else {
                isValid = true;
            }

            // Check trainer codes
            res = await connection.query(`SELECT code FROM trainers.change_password_code
         WHERE code = $1`, [code])

            if (res.rows.length > 0) {
                isValid = false;
            } else {
                isValid = true;
            }

        } while (isValid = false)

        // Prepare propert query
        let query;
        let values;
        if (!ifExists) {
            query = `INSERT INTO kuba.change_password_code(
            user_id, code, lapse_date)
            VALUES ($1,$2,$3)`
            values = [user_id, code, await dateService.addXDays(7)];
        } else {

            query = `UPDATE kuba.change_password_code
                 SET code = $1,
                     lapse_date = $2
                 WHERE user_id = $3`;
            values = [code, await dateService.addXDays(7), user_id];
        }

        // Execute query
        res = await connection.query(query, values);

        return {
            response: 'success',
            code: code
        }

    } catch (error) {
        console.log(error);
        return {
            response: 'failed'
        }
    }

}


// FIND USER BY RESET PASSWORD CODE
// ----------------------------------------------------------------------------
async function findUserByPswCode(code, connection) {

    try {


        let res = await connection.query(`SELECT user_id FROM kuba.change_password_code WHERE
            code = $1`,[code]);

        if(res.rows.length > 0){
            return {
                response : 'success',
                id : res.rows[0].user_id,
                type : 'user'
            }
        }

        res = await connection.query(`SELECT trainer_id FROM trainers.change_password_code WHERE
        code = $1`,[code]);

        if(res.rows.length >  0){
            return {
                response : 'success',
                id : res.rows[0].trainer_id,
                type : 'trainer'
            }
        }

        throw {
            errorCode : -1
        }

    } catch (error) {
        console.log(error);

        return {
            response: 'failed',
            errorCode : error.errorCode ? error.errorCode : 0
        }
    }

}



// CHANGE PASSWORD
// ----------------------------------------------------------------------------
async function changePassword(user_id, password, connection) {

    try {

        let res = await connection.query(`UPDATE kuba.users SET passw = $1 
            WHERE user_id = $2`,[password,user_id]);

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



module.exports = {
    checkAccountType: checkAccountType,
    getUserData: getUserData,
    addNewPhoto: addNewPhoto,
    savePhotoInDB: savePhotoInDB,
    deleteAvatar: deleteAvatar,
    generatePasswordCode: generatePasswordCode,
    getUserByMail: getUserByMail,
    findUserByPswCode : findUserByPswCode,
    changePassword : changePassword
}