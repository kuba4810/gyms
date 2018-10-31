import React from 'react'


class LoginUser extends React.Component{

    showUserMenu = () =>{
      /*  var userMenu = document.getElementById("userMenu");
        if(userMenu.classList.contains("invisible")){
            userMenu.classList.remove("invisible");
        }
        else{
            userMenu.classList.add("invisible");
        }
*/
    }


   render(){
       return(
           <div className="loginUser" data-toggle="collapse" data-target="#userMenu">
                { (sessionStorage.getItem("messageCount") != "0" ||
                    sessionStorage.getItem("notificationsCount") != "0") &&  
                    <span class="badge badge-success">!</span>}
               <div className="loginUserDiv"  onClick={this.showUserMenu}><i className="fas fa-user"></i></div>
           </div>
       );
   }
}

export default LoginUser;