import axios from 'axios';
const URL = 'http://localhost:8080/api/'

// CREATE NEW TRAINER
// ----------------------------------------------------------------------------
export const createTrainer = async (data) => {

    try {

        // Request to server
        // -------------------------------------------------------------------
        let res = await axios.post(URL + 'trainer/register',data);

        // Response
        // ------------------------------------------------------------------
        if(res.data.response === 'success'){
            return 'success'
        } else{
            throw 'failed'
        }
        
    } catch (error) {
        
        console.log(error);
        return 'failed';
        

    }

}