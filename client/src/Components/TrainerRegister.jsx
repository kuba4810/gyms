import React, { Component } from 'react';
import { createTrainer } from '../services/API/trainers';
import { TSExportAssignment } from 'babel-types';
import {Link} from 'react-router-dom'

import { connect } from 'react-redux'
import { checkIfLoggedIn, getLoggedUserData } from '../services/localStorage'
import { logedIn, updateMsgNtf } from '../Actions/index'
import { fetch_msg_ntf_count } from '../services/API/user';

import ForumHeader from './ForumHeader'
import { LoginForm } from './Forum/LoginForm'
import RegisterForm from './Forum/RegisterForm'
import { UserMenu } from './User/UserMenu'
class Register extends Component {

    state = {
        login: '',
        passw: '',
        mail: '',
        firstName: '',
        lastName: '',
        description: '',
        package_name: '',
        package_price: '',
        package_duration: '',
        skill_name: '',
        skill_description: '',
        packages: [],
        skills: [],
        validateMessages: {
            login: '',
            mail: '',
            password: '',
            description: '',
            first_name: '',
            last_name: '',
            p_name: '',
            price: '',
            p_duration: '',
            s_name: '',
            s_description: ''
        }
    }

    componentDidMount = async () => {


        let isLoggedIn = checkIfLoggedIn();

        console.log('W magazynie mówią że zalogowany to : ', this.props.user.isLogedIn);


        if (isLoggedIn !== this.props.user.isLogedIn) {
            if (isLoggedIn) {
                let userData = getLoggedUserData();
                console.log('Dane użytkownika: ', userData);


                let msgCount = fetch(`http://localhost:8080/api/user/${userData.id}/${userData.type}/msgCount`)
                    .then(res => res.json());

                let ntfCount = fetch(`http://localhost:8080/api/user/${userData.id}/${userData.type}/ntfCount`)
                    .then(res => res.json());

                Promise.all([msgCount, ntfCount])
                    .then(values => {
                        console.log("Pobrane dane: ", values);
                        let data

                        if (values[0].response !== 'failed' && values[1].response !== 'failed') {
                            data = {
                                loggedId: userData.id,
                                emailConfirmed: userData.isEmailConfirmed,
                                logedNick: userData.nick,
                                messageCount: values[0].data,
                                notificationsCount: values[1].data
                            }
                        }
                        else {
                            data = {
                                loggedId: userData.id,
                                emailConfirmed: userData.isEmailConfirmed,
                                logedNick: userData.nick,
                                messageCount: '',
                                notificationsCount: ''
                            }
                        }

                        this.props.logedIn(data);


                    })
                    .catch(err => {
                        console.log("Wystąpił błąd !", err);
                    })
            }

        }
        else if (isLoggedIn === this.props.user.isLogedIn && isLoggedIn) {

            let id = localStorage.getItem('loggedId');
            let type = localStorage.getItem('type');

            let data = await fetch_msg_ntf_count(id, type);

            if (data.response === 'success') {

                this.props.updateMsgNtf({
                    msg: data.msg,
                    ntf: data.ntf
                })
            }
        }


    }

    // HANDLE CHANGE
    // ------------------------------------------------------------------------
    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    // ADD PACKAGE
    // ------------------------------------------------------------------------
    addPackage = () => {

        let packages = this.state.packages;

        let state = this.state;
        let messages = this.state.validateMessages;

        let text;
        let valid = true;

        // #1 Name
        text = this.checkText(3, 35, true, this.state.package_name);

        if (!text.valid) {
            valid = false;
            messages.p_name = text.message;
        } else {
            messages.p_name = '';
        }

        // #2 Duration
        text = this.checkText(3, 35, true, this.state.package_duration);

        if (!text.valid) {
            valid = false;
            messages.p_duration = text.message;
        } else {
            messages.p_duration = '';
        }

        // #3 Price
        if (this.state.package_price <= 0) {
            valid = false;
            messages.p_price = 'Cena musi byc większa niż zero !';
        } else {
            messages.p_price = '';
        }

        if (valid) {
            let p = {
                name: this.state.package_name,
                price: this.state.package_price,
                duration: this.state.package_duration
            }

            packages.push(p);

            this.setState({
                packages: [...packages],
                package_name: '',
                package_price: '',
                package_duration: ''

            })
        } else {
            Object.assign({}, state, {
                validateMessages: messages
            });

            this.setState(state);
        }
    }

    // ADD SKILL 
    // ------------------------------------------------------------------------

    addSkill = () => {

        console.log(this.state);

        let state = this.state;
        let messages = this.state.validateMessages;

        let text;
        let valid = true;

        // #1 Name
        text = this.checkText(3, 35, true, this.state.skill_name);

        if (!text.valid) {
            valid = false;
            messages.skill_name = text.message;
        } else {
            messages.skill_name = '';
        }

        // #2 Description
        text = this.checkText(3, 35, true, this.state.skill_description);

        if (!text.valid) {
            valid = false;
            messages.skill_description = text.message;
        } else {
            messages.skill_description = '';
        }


        if (valid) {

            let skills = this.state.skills;

            let skill = {
                name: this.state.skill_name,
                description: this.state.skill_description
            }

            skills.push(skill);

            this.setState({
                skills: [...skills],
                skill_name: '',
                skill_description: ''
            })
        } else {

            Object.assign({}, state, {
                validateMessages: messages
            });

            this.setState(state);
        }
    }

    // CHECK TEXT
    // ------------------------------------------------------------------------
    checkText = (min, max, isRequired, text) => {

        if (text.length === 0 && isRequired) {
            return {
                valid: false,
                message: 'To pole jest wymagane !'
            }
        }

        else if (text.length < min && text.length > 0) {
            return {
                valid: false,
                message: `Minimum ${min} znaki !`

            }

        } else if (text.length > max) {
            return {
                valid: false,
                message: `Maksimum ${max} znaków !`

            }
        } else {
            return {
                valid: true,
                message: ''
            }
        }

    }

    // CLEAR VALIDATE MESSAGEs
    // ------------------------------------------------------------------------
    clearValidateMessages = () => {
        let s = this.state;
        let messages = this.state.validateMessages;

        messages = Object.assign({}, messages, {
            login: '',
            mail: '',
            password: '',
            description: '',
            p_name: '',
            price: '',
            p_duration: '',
            s_name: '',
            s_description: ''
        });

        s = Object.assign({}, s, {
            messages: messages
        });

        this.setState(s);
    }


    // VALIDATE
    // ------------------------------------------------------------------------

    validate = async () => {

        let valid = true;
        let s = this.state;
        let msg = this.state.validateMessages;



        return Promise.resolve().then(() => {
            let text;

            // #1 Login
            text = this.checkText(3, 50, true, s.login);

            if (!text.valid) {
                valid = false;
                msg = Object.assign({}, msg, {
                    login: text.message
                })
            } else {
                msg = Object.assign({}, msg, {
                    login: ''
                })
            }

            // #2 Password
            text = this.checkText(3, 50, true, s.passw);

            if (!text.valid) {
                valid = false;
                msg = Object.assign({}, msg, {
                    password: text.message
                })
            } else {
                msg = Object.assign({}, msg, {
                    password: ''
                })
            }

            // #3 Mail

            let regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (s.mail.length === 0) {
                valid = false;
                msg = Object.assign({}, msg, {
                    mail: 'To pole jest wymagane  !'
                })
            }
            else if (!regEx.test(String(s.mail).toLowerCase())) {

                valid = false;
                msg = Object.assign({}, msg, {
                    mail: 'Podany mail jest nie prawidłowy !'
                })

            } else {
                msg = Object.assign({}, msg, {
                    mail: ''
                })
            }

            // #4 Description
            text = this.checkText(3, 300, false, s.description);

            if (!text.valid) {
                valid = false;
                msg = Object.assign({}, msg, {
                    description: text.message
                })
            } else {
                msg = Object.assign({}, msg, {
                    description: ''
                })
            }

            // #5 FirstName
            text = this.checkText(3, 300, false, s.firstName);

            if (!text.valid) {
                valid = false;
                msg = Object.assign({}, msg, {
                    first_name: text.message
                })
            } else {
                msg = Object.assign({}, msg, {
                    first_name: ''
                })
            }

            // #5 LastName
            text = this.checkText(3, 300, false, s.lastName);

            if (!text.valid) {
                valid = false;
                msg = Object.assign({}, msg, {
                    last_name: text.message
                })
            } else {
                msg = Object.assign({}, msg, {
                    last_name: ''
                })
            }


            s = Object.assign({}, s, {
                validateMessages: msg
            });

            this.setState(s, () => {
                console.log(this.state);
            });

            return valid;

        })


    }

    // REGISTER
    // ------------------------------------------------------------------------

    register = async () => {

        let valid = await this.validate();

        if (!valid) {
            alert('Proszę poprawnie wypełnić formularz !')
        } else {
            let confirRes = true;

            if (this.state.packages.length === 0) {
                confirRes = window.confirm(`
                Nie dodałeś żadnego pakietu. 
                Jesteś pewien czy chcesz kontynuować ?
                Swoje pakiety możesz później edytować w widoku profilu`)
            }

            if (!confirRes) {
                return 0;
            }

            if (this.state.skills.length === 0) {
                confirRes = window.confirm(`
                Nie dodałeś żadnych umiejętniści. 
                Jesteś pewien czy chcesz kontynuować ?
                Swoje umiejętności możesz później edytować w widoku profilu`)
            }


            if (!confirRes) {
                return 0;
            }

            console.log('Przygotowuje obiekt');


            let data = {
                trainer: {
                    "city": "",
                    "voivodeship": "brak",
                    "login": this.state.login,
                    "passw": this.state.passw,
                    "mail": this.state.mail,
                    "first_name": this.state.firstName,
                    "last_name": this.state.lastName
                },
                packages: [...this.state.packages],
                skills: [...this.state.skills]
            }

            console.log('Dane do wysłania : ', data);


            // Execute function from API
            let res = await createTrainer(data);

            if (res === 'success') {
                alert(`Rejestracja przebiegła pomyślnie !
                       Możesz się zalogować`);
            } else {
                alert(`Wystąpił błąd, spróbuj ponownie później !`);
            }
        }



    }

    // RENDER
    // ------------------------------------------------------------------------


    render() {

        // Create packages list
        let packages = this.state.packages.map((p, index) => (
            <li key={index} className="animated fadeInLeft" >
                <i class="fas fa-check mr-2"></i>
                <b> {p.name}</b>,
                {p.price} zł,
                {p.duration}
            </li>
        ))


        // Create packages list
        let skills = this.state.skills.map((skill, index) => (
            <li key={index} className="animated fadeInLeft" >
                <i class="fas fa-check mr-2"></i>
                <b>{skill.name}</b>,
                {skill.description.slice(0, 50)} {skill.description.length > 50 && '...'}
            </li>
        ))



        return (
            <div className="trainerRegister  mt-5">


                <LoginForm />
                <RegisterForm />
                <UserMenu />

                {/* <ForumHeader
                    isLogedIn={this.props.user.isLogedIn}
                    isEmailConfirmed={this.props.user.emailConfirmed}
                    page={'REJESTRACJA'} /> */}

                <header className="forumHeader">

                    <div className="logo">
                            <Link to={'/trener-rejestracja'} >
                            <i className="fas fa-dumbbell"></i> REJESTRACJA <i className="fas fa-dumbbell"></i>
                            </Link>
                    </div> 

                    <div className="menu">
                        <div className="menuItem animated">
                            <Link to="/"><i className="fas fa-home"></i></Link> 
                        </div>
                        {this.props.page !== 'SILOWNIE' &&  <div className="menuItem animated"><Link to="/silownie">Siłownie</Link></div>}
                        {this.props.page !== 'TRENERZY' && <div className="menuItem animated"><Link to="/trenerzy">Trenerzy</Link></div>}
                        {this.props.page !== 'FORUM' && <div className="menuItem animated"><Link to="/forum">Forum</Link></div>}
                        
                    </div>

                    {/* <h1>REJESTRACJA TRENERA</h1> */}

                </header>

                {/* Row */}
                <div className="row">

                    {/* Col */}
                    <div className="col-lg-6 col-md-8 col-sm-10 ml-auto mr-auto pt-5 pb-5">

                        {/* Form */}
                        <form action="javascript:void(0)"
                            className="bg-light text-dark p-3 animated fadeIn">

                            {/* Legend */}
                            <legend>
                                <h3 className="text-danger">Rejestracja trenera</h3>
                                <hr />
                            </legend>


                            {/* Login */}
                            <div className="form-group">
                                <label htmlFor="login"> Login *

                                <span className="text-danger ml-2">
                                        {this.state.validateMessages.login}
                                    </span>

                                </label>
                                <input name="login" type="text" className="form-control"
                                    autoComplete="off"
                                    value={this.state.login}
                                    onChange={this.handleChange} />
                            </div>

                            {/* E-mal */}
                            <div className="form-group">

                                <label htmlFor="mail">
                                    Adres E-mail *
                                <span className="text-danger ml-2">
                                        {this.state.validateMessages.mail}
                                    </span>
                                </label>

                                <input name="mail" type="mail" className="form-control"
                                    autoComplete="new-mail"
                                    value={this.state.mail}
                                    onChange={this.handleChange} />
                            </div>

                            {/* Password */}
                            <div className="form-group">

                                <label htmlFor="passw">
                                    Hasło *
                                    <span className="text-danger ml-2">
                                        {this.state.validateMessages.password}
                                    </span>
                                </label>

                                <input name="passw" type="password" className="form-control"
                                    autocomplete="new-password"
                                    value={this.state.passw}
                                    onChange={this.handleChange} />
                            </div>

                            {/* First Name */}
                            <div className="form-group">
                                <label htmlFor="firstName"> Imię

                                <span className="text-danger ml-2">
                                        {this.state.validateMessages.first_name}
                                    </span>

                                </label>
                                <input name="firstName" type="text" className="form-control"
                                    autoComplete="off"
                                    value={this.state.firstName}
                                    onChange={this.handleChange} />
                            </div>

                            {/* Last Name */}
                            <div className="form-group">
                                <label htmlFor="flastName"> Nazwisko

                                <span className="text-danger ml-2">
                                        {this.state.validateMessages.last_name}
                                    </span>

                                </label>
                                <input name="lastName" type="text" className="form-control"
                                    autoComplete="off"
                                    value={this.state.lastName}
                                    onChange={this.handleChange} />
                            </div>


                            {/* Description */}
                            <div className="form-group">

                                <label htmlFor="description">
                                    O mnie
                                    <span className="text-danger ml-2">
                                        {this.state.validateMessages.description}
                                    </span>
                                </label>
                                <textarea className="form-control text-dark"
                                    name="description" cols="30" rows="5"
                                    value={this.state.description}
                                    onChange={this.handleChange}>
                                </textarea>
                            </div>




                            {/* Packages */}
                            {/* -------------------------------------------------------------------- */}

                            <h3 className="text-danger">Oferta</h3>

                            <ul className="pt-3 pb-3">

                                {packages}

                            </ul>

                            <div
                                className="registerTrainerPackages d-flex justify-content-between">

                                <div className="form-group">

                                    {/* Name */}
                                    <label htmlFor="package_name">
                                        Nazwa pakietu <br />
                                        <span className="text-danger">
                                            {this.state.validateMessages.p_name}
                                        </span>
                                    </label>

                                    <input name="package_name" type="text" className="form-control"
                                        value={this.state.package_name} onChange={this.handleChange} />

                                </div>

                                <div className="form-group">
                                    {/* Price */}
                                    <label htmlFor="package_price">
                                        Cena <br />
                                        <span className="text-danger">
                                            {this.state.validateMessages.p_price}
                                        </span>
                                    </label>

                                    <input name="package_price" type="number" className="form-control"
                                        value={this.state.package_price} onChange={this.handleChange} />
                                </div>

                                <div className="form-group">

                                    {/* Duration */}
                                    <label htmlFor="package_duration">
                                        Czas trwania <br />
                                        <span className="text-danger">
                                            {this.state.validateMessages.p_duration}
                                        </span>
                                    </label>

                                    <input name="package_duration" type="text" className="form-control"
                                        value={this.state.package_duration} onChange={this.handleChange} />
                                </div>

                                <div className="form-group d-flex align-items-end">

                                    <button className="btn btn-success"
                                        onClick={this.addPackage}>
                                        Dodaj
                                    </button>
                                </div>
                            </div>

                            {/* Skills */}
                            {/* -------------------------------------------------------------------- */}


                            <h3 className="text-danger">Umiejętności</h3>

                            <ul className="pt-3 pb-3">

                                {skills}

                            </ul>
                            <div className="registerTrainerSkills ">

                                <div className="form-group">

                                    {/* Name */}
                                    <label htmlFor="skill_name">
                                        Nazwa
                                        <span className="text-danger ml-2">
                                            {this.state.validateMessages.skill_name}
                                        </span>
                                    </label>

                                    <input name="skill_name" type="text" className="form-control"
                                        value={this.state.skill_name}
                                        onChange={this.handleChange} />


                                    {/* Description */}
                                    <label htmlFor="skill_description">
                                        Opis
                                        <span className="text-danger ml-2">
                                            {this.state.validateMessages.skill_description}
                                        </span>
                                    </label>

                                    <textarea className="form-control text-dark"
                                        name="skill_description" cols="30" rows="5"
                                        value={this.state.skill_description}
                                        onChange={this.handleChange}>
                                    </textarea>

                                </div>


                                <div className="form-group">

                                    <div className="btn btn-success"
                                        onClick={this.addSkill}>
                                        Dodaj
                                    </div>

                                </div>

                            </div>



                            <div className="form-group">

                                <div className="btn btn-danger form-control "
                                    onClick={this.register}>
                                    Rejestracja
                                </div>

                            </div>

                        </form>
                    </div>

                </div>

            </div>
        );
    }
}


const mapDispatchToProps = { logedIn, updateMsgNtf };
const mapStateToProps = state => {
    return {
        user: state.user
    };
}

const TrainerRegister = connect(mapStateToProps, mapDispatchToProps)(Register);

export default TrainerRegister;

