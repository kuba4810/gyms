import React, { Component } from 'react';
class TrainerRegister extends Component {

    state = {
        login : '',
        passw : '',
        mail : '',
        package_name : '',
        package_price : '',
        package_duration : '',
        skill_name : '',
        skill_description : ''
    }

    // Handle change
    // ------------------------------------------------------------------------
    handleChange = e => {

        this.setState({
            [e.target.name] : e.target.value
        })

    }

    render() {
        return (
            <div className="trainerRegister m-0">


                {/* Row */}
                <div className="row">

                    {/* Col */}
                    <div className="col-lg-6 col-md-8 col-sm-10 ml-auto mr-auto pt-5">

                        {/* Form */}
                        <form action="javascript:(void);"
                            className="bg-light text-dark p-3">

                            {/* Legend */}
                            <legend>
                                <h1 className="text-danger">Rejestracja trenera</h1>
                                <hr />
                            </legend>


                            {/* Login */}
                            <div className="form-group">
                                <label htmlFor="login"> Login </label>
                                <input name="login" type="text" className="form-control"
                                 autoComplete="off" value={this.state.login}
                                 onCa/>
                            </div>

                            {/* E-mal */}
                            <div className="form-group">
                                <label htmlFor="mail"> Adres E-mail </label>
                                <input name="mail" type="mail" className="form-control"
                                        autoComplete="off"/>
                            </div>

                            {/* Password */}
                            <div className="form-group">
                                <label htmlFor="passw"> Hasło </label>
                                <input name="passw" type="password" className="form-control"
                                       autoComplete="off"/>
                            </div>

                            {/* Packages */}
                            <div className="form-group">

                                {/* Name */}
                                <label htmlFor="package_name">Nazwa pakietu</label>
                                <input  name="package_name" type="text" className="form-control"
                                        value={this.state.package_name} onChange={this.handleChange}/>

                                {/* Name */}
                                <label htmlFor="package_price">Cena</label>
                                <input  name="package_name" type="text" className="form-control"
                                        value={this.state.package_name} onChange={this.handleChange}/>
                            </div>

                        </form>
                    </div>

                </div>

            </div>
        );
    }
}

export default TrainerRegister;