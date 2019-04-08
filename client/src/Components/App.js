import React, { Component } from 'react';

import { Router , Route } from 'react-router-dom';
import history from '../history'
import MainPage from './MainPage'
import Gym from './Gym/Gym'
import Trainers from './PersonalTrainers/PersonalTrainer'
import Forum from './Forum/Forum.js'
import UserContainer from './User/UserContainer'
import TrainerRegister from './TrainerRegister';
import ResetPasswordContainer from './User/ResetPassword/ResetPaswordContainer';
import ChangePassword from './User/ResetPassword/ChangePassword';
import VerifyEmail from './User/VerifyEmail/VerifyEmail'

import AlertPrimary from './Alerts/AlertPrimary';



class App extends Component {
    render() {
        return (
        <Router history={history}>
                <div>
                    <AlertPrimary />
                    <Route exact path="/" component={MainPage}/>
                    <Route  path="/silownie" component={Gym}/>
                    <Route  path="/trenerzy" component={Trainers}/>
                    <Route  path="/forum" component={Forum}/>
                    <Route  path="/uzytkownik" component={UserContainer}/>
                    <Route path="/trener-rejestracja" component={TrainerRegister} />
                    <Route path="/rejestracja" component={TrainerRegister} />
                    <Route path="/resetowanie-hasla" component = {ResetPasswordContainer} />
                    <Route path="/nowe-haslo/:code" component = {ChangePassword} />
                    <Route path="/verify-email/:code" component = {VerifyEmail} />
                </div>
            </Router>
        );
    }
}

export default App;