export const user = (state = {
    isLogedIn: false,
    loggedId: 0,
    logedNick: '',
    emailConfirmed: false,
    messageCount:'',
    notificationsCount : '',
    type: ''
},action) => {

    switch(action.type){
        // Użytkownik został zalogowany
        case 'LOGED_IN':        
            var newState = Object.assign({},state,
            {
                isLogedIn: true, 
                loggedId: action.data.id,
                emailConfirmed: action.data.emailConfirmed,
                logedNick: action.data.logedNick,
                messageCount: action.data.messageCount,
                notificationsCount: action.data.notificationsCount
                })
            
            return newState;
        // Wylogowywanie
        case 'LOGGED_OUT':
             var newState = Object.assign({},state,
                {
                    isLogedIn: false,
                    loggedId : 0,
                    logedNick: '',
                    emailConfirmed : false,
                    messageCount: '',
                    notificationsCount: ''
                })
             return newState;

        default:
            return state;
    }

}