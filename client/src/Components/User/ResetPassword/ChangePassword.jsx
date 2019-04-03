import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import {
    checkCode,
    changePassword
} from '../../../services/API/user';

import {
    changeTrainerPassword
} from '../../../services/API/trainers';


class ChangePassword extends Component {
    state = {
        isChecked: false,
        alertType: '',
        alertMessage: '',
        displayAlert: false,
        id: '',
        type : '',
        displayInput: false,
        password : '',
        confirmPassword : ''
    }

    code = () => this.props.match.params.code;

    componentDidMount = async () => {

        let res = await checkCode(this.code());

        console.log('Odpowiedź z serwera : ',res);

        if (res.response === 'failed') {

            if (res.errorCode === 0) {
                this.setState({
                    alertType: 'danger',
                    alertMessage: 'Wystąpił błąd, spróbuj ponownie później !',
                    displayAlert: true
                })
            } else if (res.errorCode === -1) {
                this.setState({
                    alertType: 'danger',
                    alertMessage: 'Kod weryfikacyjny jest nieprawidłowy !',
                    displayAlert: true
                })
            } else if (res.errorCode === -2) {
                this.setState({
                    alertType: 'danger',
                    alertMessage: 'Kod weryfikacyjny stracił ważność !',
                    displayAlert: true
                })
            }

        } else {
            this.setState({
                id: res.id,
                type : res.type,
                displayInput: true
            },()=>{
                console.log(this.state)
            })
        }


    }

    // HANDLE CHANGE
    // ------------------------------------------------------------------------
    handleChange = (e) => {

        this.setState({
            [e.target.name]: e.target.value
        })

    }

    // HANDLE PASSWORD CHANGE
    // ------------------------------------------------------------------------
    handlePasswordChange = async () => {
        this.setState({
            displayAlert : false
        })

        let res;

        // If confirm password is not the same as password
        if(this.state.password !== this.state.confirmPassword){
            this.setState({
                displayAlert : true,
                alertMessage : 'Podane hasła nie są identyczne !',
                alertType : 'danger'
            })
        } else {
            if(this.state.type === 'user'){

                console.log('Wysyłam dane do API !');

                res = await changePassword(this.state.id,this.state.password);

            } else {
                res = await changeTrainerPassword(this.state.id,this.state.password);
            }

            console.log('Odpowiedź z serwera : ',res)

            if(res.response === 'failed'){
                this.setState({
                    displayAlert : true,
                    alertMessage : 'Wystąpił błąd, spróbuj ponownie później !',
                    alertType : 'danger'
                })
            } else {
                this.setState({
                    displayAlert : true,
                    alertMessage : 'Hasło zostało zmienione, możesz się zalogować !',
                    alertType : 'success'
                })
            }
        }
    }

    render() {
        return (
            <div className="changePasswordContainer">

                <header className="animated forumHeader d-flex justify-content-start">
                    <div className="logo">

                        <Link
                            to={'/'}>
                            <i className="fas fa-dumbbell"></i> SIŁOWNIE.INFO <i className="fas fa-dumbbell"></i>
                        </Link>
                    </div>


                </header>

                <div className="row">

                    <div className="col-lg-6 col-md-8 col-sm-10 mr-auto ml-auto ">

                        <form action="javascript:void(0);" className="bg-light">

                            <h3>NOWE HASŁO</h3>

                           

                            {
                                this.state.displayInput &&
                                <div className="formGroup">

                                    <label htmlFor="password">Podaj nowe hasło</label>
                                    <input type="password" value={this.state.password}
                                        name="password"
                                        className="form-control"
                                        onChange={this.handleChange} />


                                    <label htmlFor="password">Pwtórz hasło</label>
                                    <input type="password" value={this.state.confirmPassword}
                                        name="confirmPassword"
                                        className="form-control"
                                        onChange={this.handleChange} />

                                    <div className="btn btn-danger"
                                     onClick={this.handlePasswordChange}>
                                        Zmień hasło
                                    </div>

                                </div>
                            }

                            {
                                this.state.displayAlert &&
                                <div class={`mt-2 alert alert-${this.state.alertType}`} role="alert">
                                    {this.state.alertMessage}
                                </div>
                            }



                        </form>



                    </div>

                </div>

            </div>
        );
    }
}

export default ChangePassword;