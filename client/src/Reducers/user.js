export const user = (state = {
    isLogedIn: false,
    loggedId: 0,
    logedNick: '',
    emailConfirmed: false,
    messageCount: '',
    notificationsCount: '',
    type: '',
    image : null
}, action) => {

    switch (action.type) {
        // Użytkownik został zalogowany
        case 'LOGED_IN':
            var newState = Object.assign({}, state, {
                isLogedIn: true,
                loggedId: action.data.id,
                emailConfirmed: action.data.emailConfirmed,
                logedNick: action.data.logedNick,
                messageCount: action.data.messageCount,
                notificationsCount: action.data.notificationsCount,
                image : action.data.image
            })

            return newState;
            // Wylogowywanie
        case 'LOGGED_OUT':
            var newState = Object.assign({}, state, {
                isLogedIn: false,
                loggedId: 0,
                logedNick: '',
                emailConfirmed: false,
                messageCount: '',
                notificationsCount: '',
                image : null
            })
            return newState;


            // Update msg and ntf count
        case 'UPDATE_MSG_NTF':
            return Object.assign({}, state, {
                messageCount: action.data.msg,
                notificationsCount: action.data.ntf,
            })

        default:
            return state;
    }

}