import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom';

import GymListContainer from './GymList/GymListContainer'


class Gym extends React.Component{
    constructor(){
        super();
    }
   
    render(){
        return(
            <div>
                    <Route exact path={this.props.match.path} component={GymListContainer} />               
            </div>
        );
    }
}

export default Gym;