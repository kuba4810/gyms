import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'


class Menu extends React.Component{

    componentDidMount(){
      
       if(localStorage.getItem("logedIn")!=="false"){
        var user_id = localStorage.getItem("logedIn");
        fetch("http://localhost:8080/updateMsgNot/" + user_id)
            .then(response => response.json())
                .then(response => {
                    sessionStorage.setItem("messageCount",response.messageCount);
                    sessionStorage.setItem("notificationsCount",response.notificationsCount);
                });
       }
       
    }


    logOut = ()=>{
        localStorage.setItem("logedIn","false");
        localStorage.setItem("loggedNick","");
        //localStorage.removeItem("emailConformed");

        console.log("Stan localStorage po wylogowaniu:" , localStorage.getItem("logedId"));

        window.location = "http://localhost:3000/forum";
    }

    render(){

        var userNick = localStorage.getItem("loggedNick");
        var msg = sessionStorage.getItem("messageCount");
        var ntf = sessionStorage.getItem("notificationsCount");
        return(
            <div className=" userMenu" >
                <div className="collapse userMenuContainer" id="userMenu">

                    <ul className="userOptionsList">
                        <li className="usr"><Link id="userNick" to={"/forum/uzytkownik/"+userNick}>Witaj  {localStorage.getItem("loggedNick")}</Link></li>
        <li className="msg"><Link to="/forum/wiadomosci">Wiadomości  {msg !="0" ? <span class="badge badge-light">{msg}</span> : ""}</Link></li>
                        <li className="ntf"><Link to="/forum/powiadomienia">Powiadomienia   {ntf !="0" ? <span class="badge badge-light">{ntf}</span> : ""} </Link></li>
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


export const UserMenu = connect(mapStateToProps)(Menu);
