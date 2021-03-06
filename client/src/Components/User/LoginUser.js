import React from 'react'
import {connect} from 'react-redux'


class User extends React.Component{

    moveUserList = () =>{
        let list = document.querySelector('.userOptionsList');
        list.classList.toggle('slideInDown');
        list.classList.toggle('slideOutUp');
    }


   render(){
       let msg = this.props.user.messageCount;
       let ntf = this.props.user.notificationsCount;
       let condition = (msg !== '0' && msg !== '') || (ntf !== '0' && ntf !== '');
       let badge = localStorage.getItem('type') === 'user' ?
                   <span class="loggedType badge badge-primary">U</span>:
                   <span class="loggedType badge badge-success">T</span>
        let login  = localStorage.getItem('loggedNick');

        console.log('Image w state : ', this.props);

       return(
           <div className="loginUser"
                data-toggle="collapse" 
                data-target="#userMenu" 
                onClick={this.moveUserList}>
                { condition && <span class="userInfo badge badge-success">!</span>}
               <div className="loginUserDiv">
                 {
                     (this.props.user.image !== null && typeof(this.props.user.image) !== "undefined") ?
                     <img src={`http://localhost:8080/public/images/${login}.jpg`} />:
                     <i className="fas fa-user"></i>
                    
                 }
                    
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