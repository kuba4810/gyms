import axios from 'axios';
const URL = 'http://localhost:8080/api/'

export const createGym = async (data) => {

    try {

        let res = await axios.post(URL + 'gym',data);

        console.log('API odpowiedź : ',res.data);

        if(res.data.response === 'failed'){
            if(res.data.message){
                throw {
                    myMessage : res.data.message
                }
            } else {
                throw 'failed'
            }
        }

        return{
            response : 'success',
            gym_id: res.data.gym_id,
            gym_name: res.data.gym_name
        }
        
    } catch (error) {
        
        console.log('API błąd: ',error);
        if(error.myMessage){
            return {
                response : 'failed',
                message : error.myMessage
            }
        } else {
            return {
                response : 'failed'
            }
        }

    }

}

export const savePhotos = async (photos) => {

    try {

        console.log('API : ',photos);     
       

        let res = await axios.post(URL + 'gym/images',photos,{
            headers: {
                'Content-Type': 'multipart/form-data'
              }
        });

        if(res.data.response === 'failed'){
            throw 'failed'
        }

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