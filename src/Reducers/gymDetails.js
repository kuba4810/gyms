export const gymDetails = (state={
    gym : {},
    isLoading: true,

},action) =>{
    switch(action.type){
      
        // Załadowano detale siłowi
        case 'GYM_DETAILS_FETCHED':
             console.log("Wpisuje dane do magazynu: ",action.gymDetails)
            var newState = Object.assign({},state,{gym:action.gymDetails},{isLoading: false});
            return newState;

        // Dodano nowy komentarz
        case 'NEW_COMMENT':
            let comments = state.gym.comments;
            comments.unshift(action.data);
            let newState = Object.assign({},state,
                {
                    comments: [...comments] 
                })
            return newState;

        // Zaktualizowano ocene siłowni
        case 'EVALUATION_UPDATE':
           let whichStar;
           var newState;
           console.log(action.data);
           switch(action.data){
               case 1:
                newState = Object.assign({},state,
                    {
                        one_star_count: state.gym.one_star_count+1
                    });
               break;
               case 2:
                newState = Object.assign({},state,
                    {
                        two_star_count: state.gym.two_star_count+1
                    });
               break;
               case 3:
                newState = Object.assign({},state,
                    {
                        three_star_count: state.gym.three_star_count+1
                    });
               break;
               case 4:
                newState = Object.assign({},state,
                    {
                        four_star_count: state.gym.four_star_count+1
                    });
               break;
               case 5:
                newState = Object.assign({},state,
                    {
                        five_star_count: state.gym.five_star_count+1
                    });
               break;
           }
           let count  = parseInt +
                state.gym.two_star_count*2 + 
                state.gym.three_star_count*3 +
                state.gym.four_star_count*4 + 
                state.gym.five_star_count*5

            let vote_count = state.gym.one_star_count +
            state.gym.two_star_count + 
            state.gym.three_star_count +
            state.gym.four_star_count + 
            state.gym.five_star_count

          let newAverage = count / vote_count
           newState = Object.assign({},state,{
                evaluation: newAverage
            }) 
            console.log('Nowa średnia ',count)
            return newState;          
        default:
            return state 

    }
}