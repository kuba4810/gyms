export const showPrimaryAlert = ()=>{

    let alert = document.querySelector('.myAlertPrimary');
    alert.classList.remove('invisible')
    alert.classList.remove('fadeOut')
    alert.classList.add('fadeIn');

    setTimeout(()=>{

        alert.classList.remove('fadeIn');
        alert.classList.add('fadeOut');
       
    },1700)

    setTimeout(()=>{
        alert.classList.add('invisible');
    },2400)

}