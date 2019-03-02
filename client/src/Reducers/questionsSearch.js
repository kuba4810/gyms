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
                
        // Czyści wyszukiwarke, kategorie i tekst ustawia na pustą wartość
        case 'CLEAR_FORUM_SEARCHING':
            var newState = Object.assign({},state,{
                text: '',
                category: '',
                type: 'input'
            });
            return newState;
        default:
            return state    
    }
}