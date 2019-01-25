import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom';

import GymListContainer from './GymList/GymListContainer'
import GymDetailsContainer from './GymView/GymDetailsContainer'
import NewGym from './NewGym/NewGym'


import {connect} from 'react-redux'

import {checkIfLoggedIn,getLoggedUserData} from '../../services/localStorage'
import {logedIn} from '../../Actions'
import ForumHeader from '../ForumHeader'
import {LoginForm} from '../Forum/LoginForm'
import RegisterForm from '../Forum/RegisterForm'
import {UserMenu} from '../User/UserMenu'

class GymContainer extends React.Component{
    constructor(){
        super();
    }

    componentDidMount(){
        let isLoggedIn = checkIfLoggedIn();
       
        console.log('W magazynie mówią że zalogowany to : ', this.props.user.isLogedIn);
        

        if(isLoggedIn !== this.props.user.isLogedIn){
            if(isLoggedIn){
                let userData = getLoggedUserData();
                console.log('Dane użytkownika: ',userData);
                

                let msgCount = fetch(`http://localhost:8080/api/user/${userData.id}/${userData.type}/msgCount`)
                              .then(res=> res.json());

                let ntfCount = fetch(`http://localhost:8080/api/user/${userData.id}/${userData.type}/ntfCount`)
                              .then(res=> res.json());

                Promise.all([msgCount,ntfCount])
                .then( values =>{
                    console.log("Pobrane dane: ",values);
                    let data

                    if( values[0].response !== 'failed' && values[1].response !== 'failed' ){
                         data = {
                            loggedId: userData.id,
                            emailConfirmed: userData.isEmailConfirmed,
                            logedNick: userData.nick,
                            messageCount: values[0].data,
                            notificationsCount: values[1].data
                        }
                    }
                    else{
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
                .catch(err=>{
                    console.log("Wystąpił błąd !",err);
                })
            }
           
        } 
        else{
            console.log('Nikt nie jest zalogowany !')
        }
    }
   
    render(){
        return(
            <div className="gymContainer">

            <ForumHeader 
                 isLogedIn={this.props.user.isLogedIn} 
                 isEmailConfirmed={this.props.user.emailConfirmed}
                 page={'SIŁOWNIE'}/>
                 
                    <Route exact path={this.props.match.path} component={GymListContainer} />  
                    <Route path={`${this.props.match.path}/view/:gym_id/:gym_name`} component={GymDetailsContainer} />
                    <Route path={`${this.props.match.path}/new-gym`} component={NewGym} />             
            </div>
        );
    }
}

const mapDispatchToProps = { logedIn };
const mapStateToProps = state => {
    return {
        user: state.user
    };
}

const Gym = connect(mapStateToProps,mapDispatchToProps)(GymContainer);

export default Gym;