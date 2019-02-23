// EDIT TRAINING
// ----------------------------------------------------------------------------
async function editTraining(training, connection) {

    try {


        // Prepare query
        // --------------------------------------------------------------------
        let query = `UPDATE trainers.training
        SET prize=$1, date=$2, duration=$3, name=$4, gym_name=$5, user_name=$6
        WHERE training_id = $7 returning *`;

        // Prepare values
        // --------------------------------------------------------------------
        let values = [training.price, training.date, training.duration,
            training.training_name, training.gym_name, training.user_name,
            training.training_id
        ]

        // Execute query
        // --------------------------------------------------------------------
        let res = await connection.query(query, values);

        res = await connection.query(`UPDATE trainers.trainer_shedule
                                      SET  note=$1
                                      WHERE training_id = $2;`,[training.description,training.training_id]);

        return {
            response: 'success',
            training: res.rows[0]
        }


        // Handle error
        // --------------------------------------------------------------------
    } catch (error) {

        console.log(error);
        return {
            response: 'failed'
        }


    }

}


// DELETE TRAINING
// ----------------------------------------------------------------------------
async function deleteTraining(training_id, connection) {

    try {

        // Delete from user_shedule
        // --------------------------------------------------------------------
        let res = await connection.query(`DELETE FROM kuba.user_shedule 
                  WHERE training_id = $1`, [training_id]);

        // Delete from gym_trainings
        // --------------------------------------------------------------------
        res = await connection.query(`DELETE FROM kuba.gym_trainngs 
                    WHERE training_id = $1`, [training_id]);

        // Delete from trainer_shedule
        // --------------------------------------------------------------------
        res = await connection.query(`DELETE FROM trainers.trainer_shedule
                    WHERE training_id = $1`, [training_id]);

        // Delete from trainings
        // --------------------------------------------------------------------
        res = await connection.query(`DELETE FROM trainers.training
                    WHERE training_id = $1`, [training_id]);


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
    editTraining: editTraining,
    deleteTraining: deleteTraining
}