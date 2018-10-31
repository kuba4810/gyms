import React, { Component } from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import MainPage from './Components/MainPage'
import Gym from './Components/Gym/Gym'
import Trainers from './Components/PersonalTrainers/trainersSearching'
import Forum from './Components/Forum/Forum'



class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={MainPage}/>
                    <Route  path="/silownie" component={Gym}/>
                    <Route  path="/trenerzy" component={Trainers}/>
                    <Route  path="/forum" component={Forum}/>
                </div>
            </Router>
        );
    }
}

export default App;