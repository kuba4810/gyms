import React from 'react'
import {connect} from 'react-redux'


class User extends React.Component{

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
       let msg = this.props.user.messageCount;
       let ntf = this.props.user.notificationsCount;
       console.log('Liczba wiadomości: ',msg,' Liczba powiadomień: ',ntf);
       let condition = (msg !== 0 && msg !== '') && (ntf !== 0 && ntf !== '')
       console.log('Powinno pokazać badge: ',condition)

       return(
           <div className="loginUser" data-toggle="collapse" data-target="#userMenu">
                { condition && <span class="badge badge-success">!</span>}
               <div className="loginUserDiv"  onClick={this.showUserMenu}>
                  <i className="fas fa-user"></i>
                </div>
           </div>
       );
   }
}

const mapStateToProps = state => {
    return{
        user: state.user
    };
}
const LoginUser = connect(mapStateToProps)(User);

export default LoginUser;