import React, { Component } from 'react';

import { Router , Route } from 'react-router-dom';
import history from '../history'
import MainPage from './MainPage'
import Gym from './Gym/Gym'
import Trainers from './PersonalTrainers/PersonalTrainer'
import Forum from './Forum/Forum'
import UserContainer from './User/UserContainer'
import TrainerRegister from './TrainerRegister';



class App extends Component {
    render() {
        return (
        <Router history={history}>
                <div>
                    <Route exact path="/" component={MainPage}/>
                    <Route  path="/silownie" component={Gym}/>
                    <Route  path="/trenerzy" component={Trainers}/>
                    <Route  path="/forum" component={Forum}/>
                    <Route  path="/uzytkownik" component={UserContainer}/>
                    <Route path="/trener-rejestracja" component={TrainerRegister} />
                </div>
            </Router>
        );
    }
}

export default App;