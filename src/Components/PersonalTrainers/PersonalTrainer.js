import React, { Component } from 'react';
import { directive } from 'babel-types';
import {connect} from 'react-redux'
import {checkIfLoggedIn,getLoggedUserData} from '../../services/localStorage'
import {logedIn} from '../../Actions'
import { BrowserRouter as Router, Route } from 'react-router-dom';

import ForumHeader from '../ForumHeader'
import {LoginForm} from '../Forum/LoginForm'
import RegisterForm from '../Forum/RegisterForm'
import {UserMenu} from '../Forum/User/UserMenu'
import TrainersListContainer from './TrainersList/TrainersListContainer'
import SheduleContainer from './TrainerShedule/SheduleContainer'
import '../../styles/trainerStyle.css'

class Trainer extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    componentDidMount(){
        // console.log('Rok : ',(new Date()).getFullYear() );
        // console.log('Miesiąc : ',(new Date()).getMonth() );
        // console.log('Dzień miesiąca : ',(new Date()).getDate() );
        // console.log('Dzień tygodnia: ',(new Date()).getDay())
        let isLoggedIn = checkIfLoggedIn();
       
        console.log('W magazynie mówią że zalogowany to : ', this.props.user.isLogedIn);
        

        if(isLoggedIn !== this.props.user.isLogedIn){
            if(isLoggedIn){
                let userData = getLoggedUserData();
                console.log('Dane użytkownika: ',userData);
                

                let msgCount = fetch(`http://localhost:8080/api/user/${userData.id}/msgCount`)
                              .then(res=> res.json());

                let ntfCount = fetch(`http://localhost:8080/api/user/${userData.id}/ntfCount`)
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
    render() { 
        return ( 
            <div>
                <LoginForm/>
                <RegisterForm/>
                <UserMenu/>
                <ForumHeader 
                    isLogedIn={this.props.user.isLogedIn} 
                    isEmailConfirmed={this.props.user.emailConfirmed}
                    page={'TRENERZY'}/>

                
                <Route exact path={this.props.match.path} component={TrainersListContainer} />
                <Route exact path={`${this.props.match.path}/harmonogram/:training_id?`} component={SheduleContainer} />
              
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

const PersonalTrainer = connect(mapStateToProps,mapDispatchToProps)(Trainer);

export default PersonalTrainer;