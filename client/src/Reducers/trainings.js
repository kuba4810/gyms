export const trainings = (state = {

    editMode: false,
    currentTraining: null

}, action) => {


    switch (action.type) {

        // EDIT MODE ACTIVE
        // --------------------------------------------------------------------
        case 'EDIT_MODE_ACTIVE':

            return Object.assign({}, state, {
                editMode: true
            });

        // EDIT MODE DISABLED
        // --------------------------------------------------------------------
        case 'EDIT_MODE_DISABLED':

            return Object.assign({}, state, {
                editMode: false
            });

        // CHANGE EDIT MODE
        // --------------------------------------------------------------------
        case 'TRAINING_CHOOSEN':

            return Object.assign({},state,{
                currentTraining : action.training
            });


        default:
            return state;
    }

}