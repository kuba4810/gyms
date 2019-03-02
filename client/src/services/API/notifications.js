import axios from 'axios';
const URL = 'http://localhost:8080/api/';


// Notification read
// ----------------------------------------------------------------------------
export const notification_read = async (ntf_id) => {

    try {

        let res = await axios.put(URL + 'notification',{
            ntf_id : ntf_id
        })

        if(res.response === 'success'){
            return 'success'
        } else {
            throw 'failed'
        }


    } catch (error) {

        console.log(error);        
        return 'failed'
    }

}