import React from 'react'
import {connect} from 'react-redux'
import {logedIn} from '../../Actions'
import {changeStorageState} from '../../services/localStorage'

class Login extends React.Component{

    constructor(){
        super();

        this.state = {
            loginState : "",
            isLoading : false,
            loggInAsTrainer : false
        }
        
    }


    hideLoginForm = () =>{
        var loginForm = document.getElementById("loginForm");
        var loginContent = document.querySelector('.loginContent');
        loginContent.classList.remove('zoomIn');
        loginContent.classList.add('fadeOutDown');
        
        loginForm.classList.remove('fadeIn');
        loginForm.classList.add('fadeOut');
        
        setTimeout(()=>{
            loginForm.classList.add("invisible");
        },500)
      
    }

    handleCheck = (e)=>{
        console.log(e.target.checked); 
        this.setState({
            loggInAsTrainer : e.target.checked
        })       
    }

    handleLogin = (event) =>{

        this.setState({
            isLoading: true,
            loginState : ''
        })

        var login = event.target.uname.value;
        var password = event.target.psw.value;
        var type = this.state.loggInAsTrainer ? 'trainer' : 'user';
        var data = {
            Login: login,
            Password: password,
            type : type
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
        })
        .then(response => response.json())
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

                // Aktualizuj localStorage
                let uData = response.data.userData;
                console.log('Do storage wysyłam takie dane: ', uData);
                
                changeStorageState(true,uData.user_id,uData.login,uData.isEmailConfirmed,type)

                // Aktualizuj magazyn
                var data = {
                    messageCount: response.data.messageCount,
                    notificationsCount: response.data.notificationsCount
                }        
                
                this.props.logedIn({
                    loggedId: uData.user_id,
                    logedNick: uData.login,
                    emailConfirmed: uData.isEmailConfirmed,
                    messageCount: response.data.messageCount,
                    notificationsCount: response.data.notificationsCount,
                    type: type,
                    image : response.data.image

                })
                
                setTimeout(()=>{
                    this.hideLoginForm();
                },500);
                }
            })
            .catch(err=>{
                alert('Wystąpił błąd, spróbuj ponownie później !')
            })
            .finally(()=>{
                this.setState({
                    isLoading: false
                })
            })
        event.preventDefault();


    }

    render(){
        return(
            <div className="login invisible animated" id={"loginForm"}>
                <div className="loginContent animated">
                    <div className="close transition" onClick={this.hideLoginForm}><i className="fas fa-times"></i></div>
                    <div className="imgcontainer">
                        ZALOGUJ SIĘ
                    </div>

                    <div className="container">
                        <form className="loginForm" onSubmit={this.handleLogin}>
                            <label htmlFor="uname"><b>Login</b></label>
                            <input type="text" placeholder="Wprowadź login" name="uname" className="loginLogin"
                                   required/>

                                <label htmlFor="psw"><b>Hasło</b></label>
                                <input type="password" placeholder="Wprowadź hasło" name="psw" className="loginPassword"
                                       required/>

                                <button type="submit" className="loginButton">Login</button>
                                <label class="loginMessages"> <br/>

                                   {this.state.isLoading &&  <div className="littleSpinner" ></div>}
                                    <span className="loginWarning">{this.state.loginState}</span> <br/>
                                    
                                </label> <br/>

                                <label class="loginFormCheckContainer">Jestem trenerem
                                <input type="checkbox" onChange={this.handleCheck}/>
                                <span class="checkmark"></span>
                                </label>
                               
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