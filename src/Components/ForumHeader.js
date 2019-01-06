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
            loginForm.classList.remove("fadeOut");
            loginForm.classList.add('fadeIn');
            
            loginContent.classList.remove('fadeOutDown');
            loginContent.classList.add('zoomIn');

        }

        showRegisterForm = () => {
            var registerForm = document.getElementById("registerForm");
            var registerContent = document.querySelector('.registerContent');
            
            registerForm.classList.remove('invisible');
            registerForm.classList.remove("fadeOut");
            registerForm.classList.add('fadeIn');
            
            registerContent.classList.remove("fadeOutDown");
            registerContent.classList.add('zoomIn')
        }
        render(){
            let page = this.props.page.toLowerCase();
            let userNick =localStorage.getItem('loggedNick');
        
            
            return(
                
                <header className="animated forumHeader">
                    <div className="logo">
                       
                        <Link 
                        to={ page === 'uzytkownik' ? `/${page}/profil/${userNick}` : `/${page}` }> 
                        <i className="fas fa-dumbbell"></i> {this.props.page} <i className="fas fa-dumbbell"></i>
                        </Link>
                    </div>

                    <div className="menu">
                        <div className="menuItem animated">
                            <Link to="/"><i className="fas fa-home"></i></Link> 
                        </div>
                        {this.props.page !== 'SIŁOWNIE' &&  <div className="menuItem animated"><Link to="/silownie">Siłownie</Link></div>}
                        {this.props.page !== 'TRENERZY' && <div className="menuItem animated"><Link to="/trenerzy">Trenerzy</Link></div>}
                        {this.props.page !== 'FORUM' && <div className="menuItem animated"><Link to="/forum">Forum</Link></div>}
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