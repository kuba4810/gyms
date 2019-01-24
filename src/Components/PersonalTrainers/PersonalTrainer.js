import React, { Component } from 'react';
import { directive } from 'babel-types';
import {connect} from 'react-redux'
import {checkIfLoggedIn,getLoggedUserData} from '../../services/localStorage'
import {logedIn} from '../../Actions'
import { BrowserRouter as Router, Route } from 'react-router-dom';

import ForumHeader from '../ForumHeader'
import {LoginForm} from '../Forum/LoginForm'
import RegisterForm from '../Forum/RegisterForm'
import {UserMenu} from '../User/UserMenu'
import TrainersListContainer from './TrainersList/TrainersListContainer'
import SheduleContainer from './TrainerShedule/SheduleContainer'
import '../../styles/trainerStyle.css'

class Trainer extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
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

                      <div className="jumbotron text-center bg-secondary" style={{marginBottom:0}}>
                        <h3>Znajdz Profesjonalnych trenerow w twoim rejonie</h3>
                        <h5>Pełne plany trenerow wraz z opiniami i cennikiem</h5>

                        <div className="container-fluid mt-4 ">
                          <div className="row">
                            <div className="input-group col-lg-3  mb-3 mx-auto">
                              <div className="input-group-prepend">
                                <span className="input-group-text" id="inputGroup-sizing-default">Wyszukaj</span>
                              </div>
                              <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                            </div>
                          </div>
                          </div>
                          <button type="button" class="btn btn-outline-warning">Dodaj trenera</button>
                      </div>  

                      <h2 className="text-center p-4">Dostępni Trenerzy:</h2> 
                      <div className="row container-fluid">
                    

                          <div className="col-md-6 col-xl-3 p-4">
                          <div className="card">
                          <img className="card-img-top" src="https://cdn1us.denofgeek.com/sites/denofgeekus/files/styles/main_wide/public/2016/07/arnold-schwarzenegger-pumping-iron.jpg?itok=ovqXmA3Y" alt="Card image cap"/>
                              <div className="card-body">
                              <h5 className="card-title">Arnold Schwarzenegger</h5>
                              <p className="card-text">Najlepszy trener ever</p>
                              <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                              </div>
                          </div>
                          </div>

                      </div>

                
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