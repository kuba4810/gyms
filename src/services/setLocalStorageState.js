
// Zmienia stan localStorage, jeśli isLogedIn = true ustawia pozostałe paremetry w localStorage
// które nie będą puste oraz wywołuje akcje zmieniającą stan w magazynie
// Jeśli isLogedIn = false usuwa wpisy w localStorage i aktualizuje magazyn
export const changeStorageState = (isLogedIn,id='',nick='',isEmailConfirmed='') =>{
    if(isLogedIn){
        localStorage.setItem('isLogedIn',"true");
        localStorage.setItem('logedIn',id);
        localStorage.setItem('logedNick',nick)
        localStorage.setItem('isEmailConfirmed',isEmailConfirmed);
    }
    else{
        localStorage.setItem('isLogedIn',"false");
        localStorage.removeItem('logedIn');
        localStorage.removeItem('logedNick')
        localStorage.removeItem('isEmailConfirmed');
    }
}