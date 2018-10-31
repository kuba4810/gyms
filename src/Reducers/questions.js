export const questions = (state = {
    isLoading: false,
    questionsList: [],
    category: 'WSZYSTKIE',
    currentQuestion : {}
}, action) => {
    switch (action.type) {
        case 'FETCH_QUESTIONS_SUCCESS':
            var newState = Object.assign({}, state, {
                questionsList: [...action.questions]
            });
            console.log(newState);
            return newState
        case 'CHANGE_CATEGORY':
            return { ...state,
                category: action.category
            }
        case 'SELECT_CURRENT_QUESTION':
            /* console.log("Przesłane qId: ", action.qId);
            var question = state.questionsList.filter( q => { q.question_id == action.qId } );
            console.log("Wyselektowane pytanie: ",question);*/
            console.log(state);

            var newState = Object.assign({},state,{currentQuestion:state.questionsList[0]});
            return newState
        default:
            return state
    }
}