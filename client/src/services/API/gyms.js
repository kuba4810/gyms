import axios from 'axios';
const URL = 'http://localhost:8080/api/'

export const createGym = async (data) => {

    try {

        let res = await axios.post(URL + 'gym',data);

        if(res.data.response === 'failed'){
            throw 'failed'
        }

        return{
            response : 'success',
            gym_id: res.data.gym_id,
            gym_name: res.data.gym_name
        }
        
    } catch (error) {
        
        console.log(error);

        return {
            response : 'failed'
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