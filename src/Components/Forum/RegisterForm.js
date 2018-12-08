import React from 'react'

class RegisterForm extends React.Component{
    constructor(){
        super();
        this.state = {
            message : ''
        }
    }

    hideRegisterForm(){
        var registerForm = document.getElementById("registerForm");
        var registerContent = document.querySelector('.registerContent');
      
        registerContent.classList.remove('zoomIn');
        registerContent.classList.add('fadeOutDown')

        setTimeout(()=>{
            registerForm.classList.add("invisible");
        },500);

      

    }

    handleSubmit=(e)=>{
        e.preventDefault();
        /* console.log("Działam !")
        console.log(e.target.uname.value)
        console.log(e.target.psw.value)
        console.log(e.target.email.value) */

        var data = {
            login : e.target.uname.value,
            email : e.target.email.value,
            password : e.target.psw.value
        }

        fetch("http://localhost:8080/register", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin", //
         
            body: JSON.stringify(data), // body data type must match "Content-Type" header
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res=>res.json())
            .then(res=>{
                if(res.response === 'failed'){
                    alert(res.message);
                    console.log(res);
                }
                else{
                    this.setState({
                        message : res.message
                    })
                    this.hideRegisterForm();
                }
            })
    }
    render(){
        return(
            <div className="register invisible" id="registerForm">

                <div className="registerContent animated">
                    <div className="close transition" onClick={this.hideRegisterForm}><i className="fas fa-times"></i></div>
                    <div className="imgcontainer">
                        REJESTRACJA
                    </div>

                    <div className="container">
                        <form onSubmit={this.handleSubmit}>
                            <label htmlFor="uname"><b>Login*</b></label>
                            <input type="text" placeholder="Wprowadź login" name="uname" className="registerLogin"
                                   required/>

                                <label htmlFor="psw"><b>Hasło*</b></label>
                                <input type="password" placeholder="Wprowadź hasło" name="psw"
                                       className="registerPassword" required/>

                                    <label htmlFor="email"><b>Email*</b></label>
                                    <input type="email" placeholder="Wprowadź email" name="email"
                                           className="registerEmail" required/>


                                        <span className="registerWarning">{this.state.message}</span>
                                        <button type="submit"  className="registerButton">Zarejestruj</button>
                                       
                        </form>

                    </div>

                </div>
            </div>
        );
    }

}

export default RegisterForm;