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

// GET TRAINER DATA
// ----------------------------------------------------------------------------
export const getTrainerData = async(id) => {

    try {

        let res = await axios.get( URL + `trainer/data/${id}` );

        if(res.data.response === 'success') {

            return {
                response : 'success',
                data : res.data.data
            } 
        }else {
            throw 'failed'
        }
        
    } catch (error) {
        
        console.log(error);
        
        return {
            response : 'failed'
        }

    }

}

// UPDATE TRAINER PROFILE
// ----------------------------------------------------------------------------
export const updateTrainerProfile = async(data) => {

    try {

        let res = await axios.get( URL + `trainer/update` , data );

        return {
            response : res.data.response
        }
        
    } catch (error) {
        
        console.log(error);
        
        return {
            response : 'failed'
        }

    }

}

// ADD PACKAGE
// ----------------------------------------------------------------------------
export const addPackage = async (data) => {

    try {

        let res = await axios.post( URL + `package` , data );

        if(res.data.response === 'success'){
            return {
                response : res.data.response,
                package_id : res.data.package_id
            }
        } else {
            throw 'failed'
        }
        
    } catch (error) {
        
        console.log(error);
        
        return {
            response : 'failed'
        }

    }

}


// EDIT PACKAGE
// ----------------------------------------------------------------------------
export const editPackage = async (data) => {

    try {

        let res = await axios.post( URL + `package/edit` , data );

        return {
            response : res.data.response
        }
        
    } catch (error) {
        
        console.log(error);
        
        return {
            response : 'failed'
        }

    }

}

// DELETE PACKAGE
// ----------------------------------------------------------------------------
export const deletePackage = async (id) => {

    try {

        let res = await axios.post( URL + `package/delete` , {
            package_id : id
        });

        return {
            response : res.data.response
        }
        
    } catch (error) {
        
        console.log(error);
        
        return {
            response : 'failed'
        }

    }

}


// ADD SKILL
// ----------------------------------------------------------------------------
export const addSkill = async (skill) => {

    try {

        let res = await axios.post( URL + `skill` , skill);

        if(res.data.response === 'success') { 
            return {
                response : res.data.response,
                skill_id : res.data.skill_id
            }
        } else {
            throw 'failed'
        }
        
    } catch (error) {
        
        console.log(error);
        
        return {
            response : 'failed'
        }

    }

}

// EDIT SKILL
// ----------------------------------------------------------------------------
export const editSkill = async (skill) => {

    try {

        let res = await axios.post( URL + `skill/edit` , skill);

        return {
            response : res.data.response
        }
        
    } catch (error) {
        
        console.log(error);
        
        return {
            response : 'failed'
        }

    }

}

// DELETE SKILL
// ----------------------------------------------------------------------------
export const deleteSkill = async (skill) => {

    try {

        let res = await axios.post( URL + `skill/delete` , {
            skill_id : skill
        });

        return {
            response : res.data.response
        }
        
    } catch (error) {
        
        console.log(error);
        
        return {
            response : 'failed'
        }

    }

}


// CHANGE AVATAR
// ----------------------------------------------------------------------------
export const changeAvatar = async (image) => {

    try {

        console.log('API : ',image);     
       

        let res = await axios.post(URL + 'trainer/avatar',image,{
            headers: {
                'Content-Type': 'multipart/form-data'
              }
        });

        if(res.response === 'failed'){
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