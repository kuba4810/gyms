import axios from 'axios';

const URL = 'http://localhost:8080/api/'

// Pobiera z serwera liczbę wiadomości i powiadomień danego użytkownika
// Wysyła dwa asynchroniczne żądania
// Po odebraniu danych z obu żądań zwraca jeden obiekt 
// ----------------------------------------------------------------------------
export const fetch_msg_ntf_count = async (userId, type) => {

    let data = {
        response: 'success',
        msg: '',
        ntf: ''
    }

    try {
        // Ntf count
        console.log('Pobieram liczbę powiadomień');

        let response = await axios.get(URL + `user/${userId}/${type}/ntfCount`);
        console.log(response);


        // Update data object
        if (response.data.response === 'success') {
            data = Object.assign({}, data, {
                ntf: response.data.data
            })

            // Or throw error
        } else {
            throw 'failed';
        }

        // Msg count
        console.log('Pobieram liczbę wiadomości');
        response = await axios.get(URL + `user/${userId}/${type}/msgCount`);
        console.log(response);

        // Update data object
        if (response.data.response === 'success') {
            data = Object.assign({}, data, {
                msg: response.data.data
            })

            // Or throw error
        } else {
            throw 'failed';
        }

        return data;

    } catch (error) {
        // Log error
        console.log(error);

        // Return failed
        return {
            response: 'failed'
        }
    }

}

// IS QUESTION VOTED
// ----------------------------------------------------------------------------
export const is_question_voted = async (question_id, user_id) => {

    try {
        let res = await axios.post(URL + 'question/vote/check', {
            user_id: user_id,
            question_id: question_id
        })

        console.log(res.data);

        return res.data;

    } catch (error) {

        return {
            response: 'failed'
        }

    }

}

// Check if answer is voted by loggedIn user
// ----------------------------------------------------------------------------
export const is_answer_voted = async (answer_id, user_id) => {

    try {
        let res = await axios.post(URL + 'answer/vote/check', {
            user_id: user_id,
            answer_id: answer_id
        })

        return res.data;

    } catch (error) {

        return {
            response: 'failed'
        }

    }

}


// VOTING FOR QUESTIONS
// ----------------------------------------------------------------------------
export const question_vote = async (data) => {

    try {

        let res = await axios.post(URL + 'question/vote/change', data);

        return res.data;


    } catch (error) {

        console.log(error);
        return {
            response: 'failed'
        }

    }

}

// VOTING FOR ANSWERS
// ----------------------------------------------------------------------------
export const answer_vote = async (data) => {

    try {

        let res = await axios.post(URL + 'answer/vote/change', data);

        return res.data;


    } catch (error) {

        console.log(error);
        return {
            response: 'failed'
        }

    }

}

// GET USER DATA
// ----------------------------------------------------------------------------

export const getUserData = async (user_id) => {

    console.log('Get User Data ...');


    try {

        let res = await axios.post(URL + 'user/data', {
            user_id: user_id
        })

        if (res.data.response === 'failed') {
            throw 'failed'
        }

        console.log('API ', res.data);


        return {
            response: 'success',
            data: res.data.user
        }

    } catch (error) {

        return {
            response: 'failed'
        }
        console.log('API ', error);


    }

}

// CHECK ACCOUNT TYPE
// ----------------------------------------------------------------------------
export const checkAccountType = async (login) => {

    try {

        let res = await axios.post(URL + 'account/type', {
            login: login
        })

        if (res.data.response === 'failed') {
            throw 'failed'
        }

        return {
            response: 'success',
            type: res.data.type,
            id: res.data.id
        }

    } catch (error) {

        return {
            response: 'failed'
        }
        console.log('API ', error);

    }

}

// NEW IMAGE
// ----------------------------------------------------------------------------
export const newImage = async (image) => {

    try {

        console.log('API : ',image);     
       

        let res = await axios.post(URL + 'user/photo',image,{
            headers: {
                'Content-Type': 'multipart/form-data'
              }
        });


    } catch (error) {
        console.log(error);        
    }

}

// DELETE IMAGE
// ----------------------------------------------------------------------------
export const deleteAvatar = async (login) => {

    try {

        let res = await axios.post(URL + 'user/photo/delete',{
            login : login
        })

        if (res.data.response === 'failed') {
            throw 'failed'
        }

        return {
            response: 'success'
        }
        
    } catch (error) {
        
        console.log(error);

        return {
            response : 'failed'
        }

    }

}


// RESET PASSWORD
// ----------------------------------------------------------------------------
export const reserPassword = async (userData) => {

    try {

        let res = await axios.post(`${URL}user/reset-code`,userData);
        
        console.log('API : ',res.data);

        if (res.data.response === 'failed') {
            throw {
                errorCode : res.data.errorCode
            }
        }

        return {
            response: 'success'
        }
        
    } catch (error) {
        console.log(error);

        return {
            response : 'failed',
            errorCode : error.errorCode
        }
    }

}

// CHECK RESET PASSWORD CODE
// ----------------------------------------------------------------------------
export const checkCode = async (code) =>{

    try {
        console.log('API checkCode')

        let res = await axios.post(`${URL}user/check-code`,{
            code : code
        });

        console.log('API response : ',res.data)

        if(res.data.response === 'failed'){
            throw {
                errorCode : res.data.errorCode
            }
        }

        console.log('Zwracam sukces !')

        return {
            response : 'success',
            id : res.data.id,
            type : res.data.type
        }


        
    } catch (error) {
        console.log(error);

        return {
            response : 'failed',
            errorCode : error.errorCode ? error.errorCode : 0
        }
    }
    

}

// CHANGE PASSWORD
// ------------------------------------------------------------------------
export const changePassword = async (user_id,password) => {

    try {

        let res = await axios.post(`${URL}user/change-password`,{
            user_id : user_id,
            password : password
        })

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

// CHANGE PASSWORD
// ------------------------------------------------------------------------
export const verifyEmail = async (code) => {

    try {

        let res = await axios.post(`${URL}user/verify-email`,{
            code : code
        })

        if(res.data.response === 'failed'){
            throw {
                errorCode : res.data.errorCode
            }
        }

        return {
            response : 'success'
        }
        
    } catch (error) {
        console.log(error);

        return {
            response : 'failed',
            errorCode : error.errorCode ? error.errorCode : 0
        }
    }

}