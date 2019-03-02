import axios from 'axios';
const URL = 'http://localhost:8080/api/';


// EDIT TRAINING
// ----------------------------------------------------------------------------
export const editTraining = async (training) =>{

    try {
        
        let res = await axios.post(URL + 'training/edit',training);

        if(res.data.response === 'success'){
            return 'success'
        } else{
            throw 'failed'
        }

    } catch (error) {

        console.log(error);
        return {
            response : 'failed'
        }
        
        
    }

}

// DELETE TRAINING
// ----------------------------------------------------------------------------
export const deleteTraining = async (training_id) =>{

    try {
        
        let res = await axios.post(URL + 'training/delete',
        {
            training_id : training_id
        });

        console.log('Odpowiedź z serwera :', res);
        
        if(res.data.response === 'success'){
            return 'success'
        } else{
            throw 'failed'
        }

    } catch (error) {

        console.log(error);
        return {
            response : 'failed'
        }
        
        
    }

}
