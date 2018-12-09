import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import history from '../../../history'
import {changeStorageState} from '../../../services/localStorage'
import {loggedOut} from '../../../Actions/index'


class Menu extends React.Component{

    componentDidMount(){
      
       if(localStorage.getItem("logedIn")!=="false"){
        var user_id = localStorage.getItem("logedIn");
  
       }
       
    }

    logOut = ()=>{
        // Wyczyść localStorage i ustaw isLoggedIn na false
            changeStorageState(false);
        
        // Zaktualizuj magazyn
            this.props.loggedOut();
        history.push('/');
    }

    render(){
        return(
            <div className=" userMenu" >
                <div className="collapse userMenuContainer" id="userMenu">

                    <ul className="userOptionsList">
                        <li className="usr">
                           <Link id="userNick" to={"/forum/uzytkownik/"+this.props.user.logedNick}>
                              Witaj  {this.props.user.logedNick}
                           </Link>
                        </li>

                        <li className="msg">
                           <Link to="/forum/wiadomosci">
                              Wiadomości  
                              {(this.props.user.messageCount !="0" && this.props.user.messageCount !="") ? 
                              <span class="badge badge-light">{this.props.user.messageCount}</span> : ""}
                            </Link>
                        </li>

                        <li className="ntf">
                           <Link to="/forum/powiadomienia">
                              Powiadomienia   
                               {(this.props.user.notificationsCount !="0" && this.props.user.notificationsCount !="") ? 
                              <span class="badge badge-light">{this.props.user.notificationsCount}</span> : ""}
                           </Link>
                        </li>

                        <li className="logOut" onClick={this.logOut}>Wyloguj</li>
                    </ul>

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
const mapDispatchToProps = {loggedOut};


export const UserMenu = connect(mapStateToProps,mapDispatchToProps)(Menu);
