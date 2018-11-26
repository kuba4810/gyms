export const gym = (state = {
    gymList : [], 
    isLoading:true, 
    length: 0,
    city: '' 
}, action) => {
    switch(action.type){
        case 'GYM_LIST_FETCHED':
            console.log("Odebrałem liste siłowni: ",action.gymList);
            var newState= Object.assign({},state,
                {
                    gymList: [...action.gymList],
                    isLoading:false,
                    length: action.gymList.length
                });
                return newState;
        case 'GYM_SEARCH_CHANGED':
                var newState = Object.assign({},state,
                    {
                       city: action.input 
                    });
                return newState;
        default :
        return state;

    }
}