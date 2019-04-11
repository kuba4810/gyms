import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { verifyEmail } from '../../../services/API/user';

class VerifyEmail extends Component {
    state = {
        message: '',
        alertType: '',
        displayAlert: false,
        verifyResult : '',
        verifyingFinished : false
    }

    componentDidMount = async () => {

        let code = this.props.match.params.code;
        let message = ''

        let res = await verifyEmail(code);

        console.log('Odpowiedź z serwera : ',res)

        if(res.response === 'failed'){
            if(res.errorCode === -1){
                message = 'Kod aktywacyjny jest niepoprawny !'
            }

            else {
                message = 'Wystąpił błąd, spróbuj ponownie później !'
            }

            this.setState({
                message,
                alertType : 'danger',
                displayAlert : true,
                verifyingFinished : true,
                verifyResult : 'failed'
            })
        } else {

            this.setState({
                message : 'Aktywacja przebiegła pomyślnie, możesz w pełni korzystać z konta !',
                alertType : 'success',
                displayAlert : true ,
                verifyingFinished : true,
                verifyResult : 'success'
            })
        }


    }

    render() {
        return (
            <div className="verifyEmailContainer">

                <header className="animated forumHeader d-flex justify-content-start">
                    <div className="logo">

                        <Link
                            to={'/'}>
                            <i className="fas fa-dumbbell"></i> SIŁOWNIE.INFO <i className="fas fa-dumbbell"></i>
                        </Link>
                    </div>

                </header>


                <div className="col-lg-6 col-md-8 col-sm-10 mr-auto ml-auto verifyEmailContent">

                    <h3 className="text-dark">
                        Aktywacja konta
                    </h3>

                    {
                        this.state.displayAlert &&
                        <div class={`alert alert-${this.state.alertType}`} role="alert">
                            {this.state.message}
                        </div>

                       
                    }
                    
                    
                    {/* <div className="d-flex">
                        <Link to={'/silownie'}>Siłownie</Link>
                        <Link to={'/trenerzy'}>Trenerzy</Link>
                        <Link to={'/forum'}>Forum</Link>
                    </div> */}

                </div>

            </div>
        );
    }
}

export default VerifyEmail;