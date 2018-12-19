import React, { Component } from 'react';

import { Router , Route } from 'react-router-dom';
import history from './history'
import MainPage from './Components/MainPage'
import Gym from './Components/Gym/Gym'
import Trainers from './Components/PersonalTrainers/PersonalTrainer'
import Forum from './Components/Forum/Forum'
import UserContainer from './Components/User/UserContainer'



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
                </div>
            </Router>
        );
    }
}

export default App;