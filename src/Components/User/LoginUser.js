import React from 'react'
import {connect} from 'react-redux'


class User extends React.Component{

    /* showUserMenu = () =>{
       var userMenu = document.getElementById("userMenu");
        if(userMenu.classList.contains("invisible")){
            userMenu.classList.remove("invisible");
        }
        else{
            userMenu.classList.add("invisible");
        }

    }
 */
    moveUserList = () =>{
        let list = document.querySelector('.userOptionsList');
        list.classList.toggle('slideInDown');
        list.classList.toggle('slideOutUp');
    }


   render(){
       let msg = this.props.user.messageCount;
       let ntf = this.props.user.notificationsCount;
       let condition = (msg !== '0' && msg !== '') || (ntf !== '0' && ntf !== '');

       return(
           <div className="loginUser"
                data-toggle="collapse" 
                data-target="#userMenu" 
                onClick={this.moveUserList}>
                { condition && <span class="badge badge-primary">!</span>}
               <div className="loginUserDiv"  /* onClick={this.showUserMenu} */>
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