export const getGymDetails = (gymId) =>{
    console.log("Pobieram dane z serwera...");
    fetch(`https://localhost:8080/api/gym/${gymId}`)
        .then( response => response.json())
            .then( response => {

                console.log("Odpowiedź z serwera :" ,response);
                if(response.response === 'failed'){
                    Promise.reject();
                }
                else{
                    return {
                        response: 'success',
                        gymDetails: response.data
    
                    };
                }
               
            }).catch( err=>{
                return {
                    response: 'failed'
                }
            }); 
        }
