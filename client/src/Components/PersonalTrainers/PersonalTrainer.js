import React, { Component } from 'react';
import { directive } from 'babel-types';
import { connect } from 'react-redux'
import { checkIfLoggedIn, getLoggedUserData } from '../../services/localStorage'
import { logedIn, updateMsgNtf } from '../../Actions/index';
import {trainerSearchChanged} from '../../Actions/trainers';
import { fetch_msg_ntf_count } from '../../services/API/user';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import TrainerView from './TrainerDetails/TrainerView';
import {getUserData} from '../../services/API/user';
import {getTrainerData} from '../../services/API/trainers';


import ForumHeader from '../ForumHeader'
import { LoginForm } from '../Forum/LoginForm'
import RegisterForm from '../Forum/RegisterForm'
import { UserMenu } from '../User/UserMenu'
import TrainersListContainer from './TrainersList/TrainersListContainer'
import SheduleContainer from './TrainerShedule/SheduleContainer'
import '../../styles/trainerStyle.css'

class Trainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trainers: [],
        }
    }


    componentDidMount = async ()=>{
        
        let isLoggedIn = checkIfLoggedIn();
       
        console.log('W magazynie mówią że zalogowany to : ', this.props.user.isLogedIn);
        

        if(isLoggedIn !== this.props.user.isLogedIn){
            if(isLoggedIn){
                let userData = getLoggedUserData();
                console.log('Dane użytkownika: ',userData);
                let image = null;

                if (localStorage.getItem('type') === 'user') {

                    let res = await getUserData(localStorage.getItem('loggedId'));
                    console.log('Dane użytkownika z bazy: ',res)
                    image = res.data.image;

                } else {

                    let res = await getTrainerData(localStorage.getItem('loggedId'));
                    console.log('Dane użytkownika z bazy : ',res)
                    image = res.data.trainer.image;

                }
                

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
                            notificationsCount: values[1].data,
                            image : image
                        }
                    }
                    else{
                        data = {
                            loggedId: userData.id,
                            emailConfirmed: userData.isEmailConfirmed,
                            logedNick: userData.nick,
                            messageCount: '',
                            notificationsCount: '',
                            image : image
                        }
                    }

                    this.props.logedIn(data);

                    
                })
                .catch(err=>{
                    console.log("Wystąpił błąd !",err);
                })
            }
           
        } 
        else if(isLoggedIn === this.props.user.isLogedIn && isLoggedIn){

            let id = localStorage.getItem('loggedId');
            let type = localStorage.getItem('type');

            let data = await fetch_msg_ntf_count(id,type);

            if(data.response === 'success'){
                
                this.props.updateMsgNtf({
                    msg : data.msg,
                    ntf : data.ntf
                })
            }
        }


    }

    handleChange = (e) =>{

        this.props.trainerSearchChanged(e.target.value)

    }

    render() {

        return (
            <div>
                <LoginForm />
                <RegisterForm />
                <UserMenu />
                <ForumHeader
                    isLogedIn={this.props.user.isLogedIn}
                    isEmailConfirmed={this.props.user.emailConfirmed}
                    page={'TRENERZY'}
                />

               

               

                
                <Route exact path={this.props.match.path} component={TrainersListContainer} />
                <Route path={`${this.props.match.path}/widok/:id`} component={TrainerView} />

                <div className="footer-copyright text-center py-2 text-white">Kozioł && Koczaski 2018</div>
            </div>
        );
    }

}



const mapDispatchToProps = { logedIn, updateMsgNtf,trainerSearchChanged };
const mapStateToProps = state => {
    return {
        user: state.user

    };
}

const PersonalTrainer = connect(mapStateToProps, mapDispatchToProps)(Trainer);

export default PersonalTrainer;