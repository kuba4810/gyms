import React from 'react'
import LoginUser from './User/LoginUser'
import {Link} from 'react-router-dom'





class ForumHeader extends React.Component{
    constructor() {
        super(...arguments);
        }
        
        showLoginForm = ()=>{
            var loginForm = document.getElementById("loginForm");
            var loginContent = document.querySelector('.loginContent');

            loginForm.classList.remove("invisible");
            
            loginContent.classList.remove('fadeOutDown');
            loginContent.classList.add('zoomIn');

        }

        showRegisterForm = () => {
            var registerForm = document.getElementById("registerForm");
            var registerContent = document.querySelector('.registerContent');
            
            registerForm.classList.remove('invisible');
            
            registerContent.classList.remove("fadeOutDown");
            registerContent.classList.add('zoomIn')
        }
        render(){

            return(
                <header className="animated forumHeader">
                    <div className="logo">
                    
                        <Link to="/forum"> <i className="fas fa-dumbbell"></i> FORUM <i className="fas fa-dumbbell"></i></Link>
                    </div>

                    <div className="menu">
                        <div className="menuItem animated">
                            <Link to="/"><i className="fas fa-home"></i></Link> 
                        </div>
                        <div className="menuItem animated"><Link to="/silownie">Siłownie</Link></div>
                        <div className="menuItem animated"><Link to="/trenerzy">Trenerzy</Link></div>
                        { !this.props.isLogedIn&& <div className="menuItem animated" id="login" onClick={this.showLoginForm}>Logowanie</div>}
                        { !this.props.isLogedIn &&<div className="menuItem animated" id="registration" onClick={this.showRegisterForm}>Rejestracja</div>}
                    </div>


                    {this.props.isLogedIn && <LoginUser/> }


                    <div className="clear" style={{clear: "both"}}></div>

                </header>
            );
        }

}

export default ForumHeader;