export const questions = (state = {
    isLoading: true,
    questionsList: [],
    category: 'WSZYSTKIE',
    currentQuestion : {},
    isFiltering: false,
    sort : 'newest'
}, action) => {
    switch (action.type) {

        // Questions fetched
        case 'FETCH_QUESTIONS_SUCCESS':
            var newState = Object.assign({}, state, {questionsList: [...action.questions],isLoading:false});
            console.log(newState);
            return newState

        // Category changed
        case 'CHANGE_CATEGORY':
            return { ...state,
                category: action.category
            }
        
        // Question selected 
        case 'SELECT_CURRENT_QUESTION':
            console.log(state);

            var newState = Object.assign({},state,{currentQuestion:state.questionsList[0]});
            return newState

        // Filtering finished
        case 'FILTERING_FINISHED':
            var newState = Object.assign({},state,{isFiltering: !state.isFiltering});
            return newState;
        
        // Sort type changed
        case 'SORT_TYPE_CHANGED':
            return Object.assign({},state,{
                sort : action.sort
            })
        default:
            return state
    }
}