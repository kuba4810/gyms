import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { reserPassword } from '../../../services/API/user';


class ResetPasswordContainer extends Component {
    state = {
        mail: '',
        alertType : '',
        displayAlert : false,
        alertMessage : ''
    }

    // HANDLE CHANGE
    // ------------------------------------------------------------------------
    handleChange = (e) => {

        this.setState({
            [e.target.name]: e.target.value
        })

    }

    // RESET PASSWORD
    // ------------------------------------------------------------------------
    handleResetPassword = async () => {

        const data = {
            mail: this.state.mail
        }

        let res = await reserPassword(data);

        console.log('Client res : ',res)

        if (res.response === 'success') {
            this.setState({
                alertType : 'success',
                displayAlert : true,
                alertMessage : 'Link z kodem do zmiany hasła wysłano na podany adres mail !'
            })
        } else {
            let message = ''

            if(res.errorCode === -1){
                message = 'Nie znaleziono użytkownika !';
            } else {
                message = 'Coś poszło nie tak, spróbuj ponownie później !';
            }

            this.setState({
                alertType : 'danger',
                displayAlert : true,
                alertMessage : message
            })

        }

    }




    render() {
        return (
            <div className="resetPasswordContainer">

                <header className="animated forumHeader d-flex justify-content-start">
                    <div className="logo">

                        <Link
                            to={'/'}>
                            <i className="fas fa-dumbbell"></i> SIŁOWNIE.INFO <i className="fas fa-dumbbell"></i>
                        </Link>
                    </div>

                </header>

                <div className="row">

                    <div className="col-lg-6 col-md-8 col-sm-10 mr-auto ml-auto">

                        <form action="javascript:void(0);" className="bg-light">

                            <h3>RESETUJ HASŁO</h3>


                            <div className="form-group">

                                <label htmlFor="mail"> Adres e-mail: </label>
                                <input type="text" name="mail" className="form-control" value={this.state.mail}
                                    onChange = {this.handleChange} />

                            </div>

                            <div className="form-group d-flex justify-content-center">

                                <div className="btn btn-danger" onClick={this.handleResetPassword}>
                                    Resetuj hasło
                                 </div>

                            </div>

                            {
                                this.state.displayAlert &&
                                <div class={`alert alert-${this.state.alertType}`} role="alert">
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

export default ResetPasswordContainer;