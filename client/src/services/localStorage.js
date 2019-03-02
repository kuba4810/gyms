
// Zmienia stan localStorage, jeśli isLogedIn = true ustawia pozostałe paremetry w localStorage
// które nie będą puste oraz wywołuje akcje zmieniającą stan w magazynie
// Jeśli isLogedIn = false usuwa wpisy w localStorage i aktualizuje magazyn
export const changeStorageState = (isLogedIn,id='',nick='',isEmailConfirmed='',type='') =>{
    console.log('Do storage wpisuje takie oto ID: ',id);
    
    if(isLogedIn){
        localStorage.setItem('isLoggedIn','true');
        localStorage.setItem('loggedId',id);
        localStorage.setItem('loggedNick',nick)
        localStorage.setItem('isEmailConfirmed',isEmailConfirmed);
        localStorage.setItem('type',type);
    }
    else{
        localStorage.setItem('isLoggedIn',"false");
        localStorage.removeItem('loggedId');
        localStorage.removeItem('loggedNick')
        localStorage.removeItem('isEmailConfirmed');
        localStorage.removeItem('type');
    }
}

// Sprawdza stan localStorage pod względem stanu zalogowania
// Zwraca false gdy nikt nie jest zalogowany bądź flaga w localStorage jest nie ustawiona
// Zwraca true gdy wykryło zalogowanego użytkownika
export const checkIfLoggedIn = () =>{
    let isLogedIn;
    let storageItem = localStorage.getItem('isLoggedIn');

    // console.log('Typ flagi zalogowania : ',typeof(storageItem));

    if (storageItem === null ){
        localStorage.setItem('isLoggedIn','false');
        isLogedIn = false;
    }
    else if( storageItem === 'false' ){
        isLogedIn = false;
    }
    else{
        isLogedIn = true;
    }

    console.log('Czy ktoś jest zalogowany ? : ', isLogedIn);
    
    return isLogedIn;
}

// Pobiera z localStorage dane zalogowanego użytkownika:
//  Id, nick, isEmailConfirmed
export  const  getLoggedUserData =  () => {
    let userData ={
        isLoggedIn,
        id,
        nick,
        isEmailConfirmed 
    }

    let isLoggedIn = localStorage.getItem('isLoggedIn');
    let id = localStorage.getItem('loggedId');
    let nick = localStorage.getItem('loggedNick');
    let isEmailConfirmed = localStorage.getItem('isEmailConfirmed');
    let type = localStorage.getItem('type');

    userData = Object.assign({},userData,
        { 
            isLoggedIn: isLoggedIn,
            id: id,
            nick: nick, 
            isEmailConfirmed: isEmailConfirmed ,
            type : type
        });

    return userData;

}