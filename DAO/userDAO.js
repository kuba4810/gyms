const mkdir = require('make-dir');
const path = require('path');


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
                response : 'success',
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
async function savePhotoInDB(login,connection){

    try {
        console.log('Saving photo in db...',login);
        

        let res = await connection.query(`UPDATE kuba.users
                         SET image = $1
                         WHERE login = $2`,
                         [login,login]);
        
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

module.exports = {
    checkAccountType: checkAccountType,
    getUserData: getUserData,
    addNewPhoto: addNewPhoto,
    savePhotoInDB : savePhotoInDB
}