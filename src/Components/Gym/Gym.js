import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom';

import GymListContainer from './GymList/GymListContainer'
import GymDetailsContainer from './GymView/GymDetailsContainer'
import NewGym from './NewGym/NewGym'

// import styles  from '../../styles/gymStyle.css'

class Gym extends React.Component{
    constructor(){
        super();
    }
   
    render(){
        return(
            <div className="gymContainer">
                    <Route exact path={this.props.match.path} component={GymListContainer} />  
                    <Route path={`${this.props.match.path}/view/:gym_id/:gym_name`} component={GymDetailsContainer} />
                    <Route path={`${this.props.match.path}/new-gym`} component={NewGym} />             
            </div>
        );
    }
}

export default Gym;