export const answers =(state={
    answerList:[],
    isLoading: true
},action) => {
   
    switch(action.type){

        // Wczytano odpowiedzi
        case 'ANSWERS_FETCHED':
            var newState = Object.assign({},state,{answerList: [...action.answers], isLoading:false})
            return newState;
            

        // Dodano nową odpowiedź
        case 'ANSWER_ADDED':
        console.log('Nowa odpowiedź', action.answer);
        
            let answers = [...state.answerList];
            answers.push(action.answer);
            var  newState = Object.assign({},state,
                {
                    answerList: [...answers] 
                })
            return newState;

        default :       
            return state;
    }
}