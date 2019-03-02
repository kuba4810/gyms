import axios from 'axios';
const URL = 'http://localhost:8080/api/'

// Funkcja do usuwania wiadomości z bazy danych
export const deleteAnswer = async (answer_id) => {
    
    
    try {
        let res = await axios.post(URL + 'answer' , {
            answer_id : answer_id
        })
    
        console.log('Odpowiedź z serwera :  ',res);
        
        if(res.data.response === 'success'){
            return 'success'
        }
    } catch (error) {
        return 'failed'
    }
}