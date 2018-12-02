export const gymDetails = (state={
    gym : {},
    isLoading: true,

},action) =>{
    switch(action.type){
      
        case 'GYM_DETAILS_FETCHED':
        console.log("Wpisuje dane do magazynu: ",action.gymDetails)
            var newState = Object.assign({},state,{gym:action.gymDetails},{isLoading: false});
            return newState;
        default:
            return state

    }
}