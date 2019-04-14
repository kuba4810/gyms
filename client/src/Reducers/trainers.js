export const trainers = (state = {
    trainerList: [],
    length: 0,
    city: '',
    trainerDetails: null
}, action) => {
    switch (action.type) {

        case 'TRAINER_LIST_FETCHED':

            var newState = Object.assign({}, state, {
                trainerList: [...action.trainerList],
                length: action.trainerList.length
            });

            console.log('Trainer list fetched',state);
            return newState;

        case 'TRAINER_SEARCH_CHANGED':
            console.log('Zmieniono unput : ', action.input)
            var newState = Object.assign({}, state, {
                city: action.input
            });
            return newState;

        case 'TRAINER_DETAILS_FETCHED':

            console.log('TRAINER_DETAILS_FETCHED',action);

            let newState = Object.assign({},state,{
                trainerDetails : action.trainer
            })
            
            return  newState;


        default:
            return state;

    }
}