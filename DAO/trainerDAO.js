const randomstring = require('randomstring');
const fs = require('fs');

// CREATE NEW TRAINER
// ----------------------------------------------------------------------------
async function createTrainer(data, connection, verificationCode) {

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
        let res = await connection.query(query, values);

        // Return data
        // --------------------------------------------------------------------
        return {
            response: 'success',
            trainer: res.rows[0]
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

async function createSkills(skills, id, connection) {

    try {

        for (let index = 0; index < skills.length; index++) {
            const el = skills[index];

            // If skill exists in database
            if (el.skill_id) {
                let res = await connection.query(`INSERT INTO trainers.trainer_skill(
                skill_id, trainer_id, description)
                VALUES ($1,$2,$3);`, [el.skill_id, id, el.description]);

                // If not
            } else {
                let res = await connection.query(`INSERT INTO trainers.skill(name)
                VALUES ($1) returning *;`, [el.name]);

                res = await connection.query(`INSERT INTO trainers.trainer_skill(
                skill_id, trainer_id, description)
                VALUES ($1,$2,$3);`, [res.rows[0].skill_id, id, el.description]);
            }

        }
        tam
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


// GENERATE VERIFICATION CODE
// ----------------------------------------------------------------------------
async function generateVerificationCode(connection) {

    let shouldContinue = true;
    let code;

    // Generate code until it is unique
    // --------------------------------------------------------------------
    while (shouldContinue) {

        // Generate code
        code = await randomstring.generate(20);

        // Check table users
        let users = await connection.query(`select * from kuba.users
            where verification_code =  $1 `, [code]);

        // Check table trainers
        let trainers = await connection.query(`select * from trainers.trainer
            where verification_code =  $1 `, [code]);

        if (users.rows.length === 0 && trainers.rows.length === 0) {
            shouldContinue = false;
        }

    }

    return code;
}

// CHECK LOGIN AVAILABILITY
// ----------------------------------------------------------------------------
async function checkLogin(login, connection) {

    // Prepare query
    let query = `SELECT login from trainers.trainer
                 WHERE login = $1`;
    // Prepare values
    let values = [login];

    // Execute query
    let res = await connection.query(query, values);

    if (res.rows.length > 0) {
        return 'failed'
    } else {
        return 'success'
    }
}

// CHECK E-MAIL AVAILABILITY
// ----------------------------------------------------------------------------
async function checkMail(mail, connection) {

    // Prepare query
    let query = `SELECT mail from trainers.trainer
                 WHERE mail = $1`;
    // Prepare values
    let values = [mail];

    // Execute query
    let res = await connection.query(query, values);

    if (res.rows.length > 0) {
        return 'failed'
    } else {
        return 'success'
    }

}


// GET TRAINER DATA
// ----------------------------------------------------------------------------

async function getTrainerData(trainer_id, connection) {

    // This object will hold whole trainer data
    // Trainer + Skills + Packages
    let responseData = {
        trainer: null,
        packages: [],
        skills: [],
        photos: []
    }

    try {

        // Trainer data
        let res = await connection.query(`SELECT * FROM trainers.trainer
        WHERE trainer_id = $1`, [trainer_id])

        responseData = Object.assign({}, responseData, {
            trainer: res.rows[0]
        })

        // Skills data
        res = await connection.query(`SELECT * FROM trainers.trainer_skill NATURAL JOIN 
                                trainers.skill  WHERE trainer_id = $1`, [trainer_id])

        responseData = Object.assign({}, responseData, {
            skills: [...res.rows]
        })

        // Packages data
        res = await connection.query(`SELECT * FROM trainers.trainer_package 
                     WHERE trainer_id = $1`, [trainer_id])

        responseData = Object.assign({}, responseData, {
            packages: [...res.rows]
        })

        // Photos
        res = await connection.query(`SELECT * FROM trainers.trainer_photo
        WHERE trainer_id = $1`, [trainer_id]);

        responseData = Object.assign({}, responseData, {
            photos: [...res.rows]
        })

        return {
            response: 'success',
            data: responseData
        }


    } catch (error) {

        console.log(error);


        return {
            response: 'failed'
        }
    }

}


// UPDATE TRAINER PROFILE
// ----------------------------------------------------------------------------

async function updateProfile(trainer, connection) {

    try {

        // Prepare query
        let query = `UPDATE trainers.trainer SET
                     first_name = $1,
                     last_name =  $2,
                     city = $3,
                     voivodeship = $4,
                     mail = $5,
                     passw = $6,
                     login = $7
                     WHERE trainer_id = $8 returning *`

        let values = [trainer.first_name, trainer.last_name, trainer.city, trainer.voivodeship,
            trainer.mail, trainer.passw, trainer.login, trainer.trainer_id
        ]

        // Execute query
        let res = await connection.query(query, values);

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


// ADD PACKAGE
// ----------------------------------------------------------------------------

async function addPackage(package, connection) {

    try {

        // Prepare query
        let query = `INSERT INTO trainers.trainer_package(
            trainer_id, name, duration, price)
           VALUES ( $1,$2,$3,$4) returning *;`

        //  Prepare values
        let values = [package.trainer_id, package.name, package.duration, package.price]

        // Execute query
        let res = await connection.query(query, values);

        return {
            response: 'success',
            package_id: res.rows[0].package_id
        }

    } catch (error) {

        console.log(error);
        return {
            response: 'failed'
        }

    }

}

// EDIT PACKAGE
// ----------------------------------------------------------------------------
async function editPackage(package, connection) {

    try {

        // Prepare query
        let query = `UPDATE trainers.trainer_package
       SET  name=$1, duration=$2, price=$3
       WHERE package_id = $4;`

        //  Prepare values
        let values = [package.name, package.duration, package.price, package.package_id, ]

        // Execute query
        let res = await connection.query(query, values);

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


// DELETE PACKAGE
// ----------------------------------------------------------------------------
async function deletePackage(id, connection) {

    try {

        let res = await connection.query(`DELETE FROM trainers.trainer_package
                                    WHERE package_id = $1`, [id]);

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

// ADD SKILL
// ----------------------------------------------------------------------------
async function addSkill(skill, connection) {

    try {

        let res;
        let skill_id;

        if (skill.id) {

            res = await connection.query(`INSERT INTO trainers.trainer_skill(
                skill_id, trainer_id, description)
                VALUES ($1,$2,$3);`, [skill.skill_id, skill.triner_id, skill.description]);
        } else {
            res = await connection.query(`INSERT INTO trainers.skill (name) 
            VALUES($1) returning *`, [skill.name])

            skill_id = res.rows[0].skill_id;

            res = await connection.query(`INSERT INTO trainers.trainer_skill(
                skill_id, trainer_id, description)
                VALUES ($1,$2,$3);`, [res.rows[0].skill_id, skill.trainer_id, skill.description]);

        }

        return {
            response: 'success',
            skill_id: skill_id
        }

    } catch (error) {

        console.log(error)
        return {
            response: 'failed'
        };


    }

}

// EDIT SKILL
// ----------------------------------------------------------------------------
async function editSkill(skill, connection) {

    console.log('DAO : ', skill);


    try {

        let res = await connection.query(`UPDATE trainers.trainer_skill
        SET  description=$1
        WHERE skill_id = $2 ;`, [skill.description, skill.skill_id]);

        return {
            response: 'success'
        }

    } catch (error) {



        console.log(error)
        return {
            response: 'failed'
        };


    }

}

// DELETE SKILL
// ----------------------------------------------------------------------------
async function deleteSkill(id, connection) {

    console.log(id);


    try {


        let res = await connection.query(`DELETE FROM trainers.trainer_skill
        WHERE skill_id = $1`, [id]);

        return {
            response: 'success'
        }
    } catch (error) {

        console.log(error)
        return {
            response: 'failed'
        };


    }

}

// CHANGE PHOTO
// ----------------------------------------------------------------------------
async function changePhoto(photo, login, connection) {

    try {

        // Move image to images folder
        await photo.mv(`./public/images/${login}.jpg`,
            (err) => {
                if (err) {
                    throw err;
                }
            });

        // Update table trainer
        let res = await connection.query(`UPDATE trainers.trainer
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

// ADD PHOTO
// ----------------------------------------------------------------------------
async function addPhoto(photo, name, id, connection) {

    try {

        // Update table trainer
        let res = await connection.query(`SELECT  photo_name
         FROM trainers.trainer_photo  where trainer_id = $1  
         order by photo_id DESC LIMIT 1 `,[id]);


        let photo_count = 0;
        if(res.rows.length === 0){
            photo_count = 0;
        } else {
            photo_count = parseInt(res.rows[0].photo_name.split('_')[1]);

        }

        const photo_name = `${name.split('_')[0]}_${photo_count+1}`

        res = await connection.query(`INSERT INTO trainers.trainer_photo(
            trainer_id, photo_name)
            VALUES ($1, $2) returning *;`, [id, photo_name])

        // Move photo to folder public/images
        await photo.mv(`./public/images/${photo_name}.jpg`,
            (err) => {
                if (err) {
                    throw err;
                }
            });



        return {
            response: 'success',
            photo_id: res.rows[0].photo_id
        }

    } catch (error) {

        console.log(error);

        return {
            response: 'failed'
        }

    }

}

// GET TRAINER ID
// ----------------------------------------------------------------------------
async function getTrainerId(login, connection) {

    try {

        let res = await connection.query(`SELECT trainer_id FROM trainers.trainer
        WHERE login = $1`, [login]);

        return {
            response: 'success',
            trainer_id: res.rows[0].trainer_id
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
        let query = `UPDATE trainers.trainer SET image = $1 WHERE login = $2`;
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

// DELETE PHOTO
// ----------------------------------------------------------------------------
async function deletePhoto(photo_name, connection) {

    try {

        // Delete from database
        let query = `DELETE FROM trainers.trainer_photo WHERE photo_name = $1`;
        let values = [photo_name];

        let res = connection.query(query, values);

        // Delete file from server
        const filePath = `./public/images/${photo_name}.jpg`;

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





module.exports = {
    createTrainer: createTrainer,
    createPackages: createPackages,
    createSkills: createSkills,
    generateVerificationCode: generateVerificationCode,
    checkLogin: checkLogin,
    checkMail: checkMail,
    getTrainerData: getTrainerData,
    updateProfile: updateProfile,
    addPackage: addPackage,
    editPackage: editPackage,
    deletePackage: deletePackage,
    addSKill: addSkill,
    editSkill: editSkill,
    deleteSkill: deleteSkill,
    changePhoto: changePhoto,
    addPhoto: addPhoto,
    deleteAvatar: deleteAvatar,
    getTrainerId: getTrainerId,
    deletePhoto: deletePhoto

}