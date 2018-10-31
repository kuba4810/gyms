export  const questionsSearch = (state = {
    text:'',
    category:'',
    sort:'newest',
    type:'input'
},action) => {
    switch(action.type){
        case 'SEARCH_QUESTIONS':
        if(action.newState.type == 'sort'){
            return { ...state, sort :action.newState.sort}
        }
            return {...state, ...action.newState}
        default:
            return state    
    }
}