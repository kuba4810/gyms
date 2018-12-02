export const questions = (state = {
    isLoading: false,
    questionsList: [],
    category: 'WSZYSTKIE',
    currentQuestion : {},
    isFiltering: false
}, action) => {
    switch (action.type) {
        case 'FETCH_QUESTIONS_SUCCESS':
            var newState = Object.assign({}, state, {questionsList: [...action.questions],isLoading:false});
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
        case 'FILTERING_FINISHED':
            var newState = Object.assign({},state,{isFiltering: !state.isFiltering});
            return newState;
        default:
            return state
    }
}