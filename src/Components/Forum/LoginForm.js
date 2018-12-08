import React from 'react'
import {connect} from 'react-redux'
import {logedIn} from '../../Actions'

class Login extends React.Component{

    constructor(){
        super();

        this.state = {
            loginState : ""
        }
        
    }


    hideLoginForm = () =>{
        var loginForm = document.getElementById("loginForm");
        var loginContent = document.querySelector('.loginContent');
        loginContent.classList.remove('zoomIn');
        loginContent.classList.add('fadeOutDown');
        
        setTimeout(()=>{
            loginForm.classList.add("invisible");
        },500)
      
    }

    handleLogin = (event) =>{

        var login = event.target.uname.value;
        var password = event.target.psw.value;

        var data = {
            Login: login,
            Password: password
        };

        fetch("http://localhost:8080/logIn", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin", //
         
            body: JSON.stringify(data), // body data type must match "Content-Type" header
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json())
            .then( (response) => {
                console.log("Odpowiedź z serwera po zalogowaniu:" , response);
                if(response.type === "loginFailed" || response.type === 'serverError'){
                    this.setState({
                        loginState: response.message
                    });
                }
                else{
                    this.setState({
                        loginState: "Logowanie przebiegło pomyślnie !"
                    });

                    localStorage.setItem("logedIn",response.data.userData.user_id);
                    localStorage.setItem("loggedNick",response.data.userData.login);
                    localStorage.setItem("emailConfirmed",response.data.userData.isEmailConfirmed);

                    var data = {
                        messageCount: response.data.messageCount,
                        notificationsCount: response.data.notificationsCount
                    }

                    console.log("Dane do magazynu",data);

                     localStorage.setItem("messageCount",response.data.messageCount);
                    localStorage.setItem("notificationsCount",response.data.notificationsCount); 

                    this.props.logedIn({
                        messageCount: "14",
                        notificationsCount: "5"
                    });
                    
                    console.log("Dane z localStorage: " , "Id:" + localStorage.getItem("logedIn") , " Nick" + localStorage.getItem("loggedNick"));

                    window.location.reload();
                }
            })
        event.preventDefault();


    }

    render(){
        return(
            <div className="login invisible" id={"loginForm"}>
                <div className="loginContent animated">
                    <div className="close transition" onClick={this.hideLoginForm}><i className="fas fa-times"></i></div>
                    <div className="imgcontainer">
                        ZALOGUJ SIĘ
                    </div>

                    <div className="container">
                        <form onSubmit={this.handleLogin}>
                            <label htmlFor="uname"><b>Login</b></label>
                            <input type="text" placeholder="Wprowadź login" name="uname" className="loginLogin"
                                   required/>

                                <label htmlFor="psw"><b>Hasło</b></label>
                                <input type="password" placeholder="Wprowadź hasło" name="psw" className="loginPassword"
                                       required/>

                                <button type="submit" className="loginButton">Login</button>
                                <label> <br/>
                                    <span className="loginWarning">{this.state.loginState}</span> <br/>
                                    
                                </label>


                                <span className="psw">Nie pamiętam <a href="#">hasła</a> </span>
                        </form>
                    </div>

                </div>
            </div>
        );
    }
}

const mapDispatchToProps = {logedIn};
const mapStateToProps = state => {
    return{
        user:state.user
    };
}


export const LoginForm = connect(mapStateToProps,mapDispatchToProps)(Login);