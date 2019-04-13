export const trainers = (state = {
    trainerList : [], 
    length: 0,
    city: '' 
}, action) => {
    switch(action.type){
        case 'TRAINER_LIST_FETCHED':

            var newState= Object.assign({},state,
                {
                    trainerList: [...action.trainerList],
                    length: action.trainerList.length
                });
                return newState;
        case 'TRAINER_SEARCH_CHANGED':
        console.log('Zmieniono unput : ',action.input)
                var newState = Object.assign({},state,
                    {
                       city: action.input 
                    });
                return newState;
        default :
        return state;

    }
}