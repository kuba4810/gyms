export const user = (state = {
    messageCount:'0',
    notificationsCount : '0'
},action) => {

    switch(action.type){
        case 'LOGED_IN':
        console.log("Dane przysłane do magazynu: ",action.data);
        
            return { ...state , messageCount: action.data.messageCount , notificationsCount: action.data.notificationsCount }
        default:
            return state;
    }

}