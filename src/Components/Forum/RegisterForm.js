import React from 'react'

class RegisterForm extends React.Component{

    hideRegisterForm(){
        var registerForm = document.getElementById("registerForm");
        registerForm.classList.add("invisible");

    }
    render(){
        return(
            <div className="register invisible" id="registerForm">

                <div className="registerContent animate">
                    <div className="close transition" onClick={this.hideRegisterForm}><i className="fas fa-times"></i></div>
                    <div className="imgcontainer">
                        REJESTRACJA
                    </div>

                    <div className="container">
                        <form action="javascript:void(0);">
                            <label htmlFor="uname"><b>Login*</b></label>
                            <input type="text" placeholder="Wprowadź login" name="uname" className="registerLogin"
                                   required/>

                                <label htmlFor="psw"><b>Hasło*</b></label>
                                <input type="password" placeholder="Wprowadź hasło" name="psw"
                                       className="registerPassword" required/>

                                    <label htmlFor="email"><b>Email*</b></label>
                                    <input type="email" placeholder="Wprowadź email" name="email"
                                           className="registerEmail" required/>


                                        <span className="registerWarning"></span>
                                        <button type="submit" className="registerButton">Zarejestruj</button>
                                       
                        </form>

                    </div>

                </div>
            </div>
        );
    }

}

export default RegisterForm;