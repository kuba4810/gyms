import React from "react"
import {connect} from 'react-redux'
import {checkIfLoggedIn,getLoggedUserData} from '../../services/localStorage'
import {logedIn} from '../../Actions/index'

import {TopicsMenu} from "./TopicsMenu";
import {ForumNavContainer} from "./ForumNav";
import ForumHeader from '../ForumHeader'
import User from './User/User'
import {NewQuestion} from './Questions/NewQuestion'
import {QuestionListContainer} from './Questions/QuestionList'
import {QuestionView} from './Questions/QuestionView'
import {LoginForm} from './LoginForm'
import RegisterForm from './RegisterForm'
import {UserMenu} from '../User/UserMenu'


import { BrowserRouter as Router, Route } from 'react-router-dom';


function AppArrow() {
        return (

            <div className="arrow">
                <i className="fas fa-arrow-up"></i>
            </div>
        );
    }


    class ForumContainer extends React.Component{

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
    render(){

        return(
            <div className="forumContainer">
                <LoginForm/>
                <RegisterForm/>
                <UserMenu/>

                <ForumHeader 
                    isLogedIn={this.props.user.isLogedIn} 
                    isEmailConfirmed={this.props.user.emailConfirmed}
                    page={'FORUM'}/>

                <main className="animated forumMain">
                    <div className="forumContent">

                            <TopicsMenu/>

                            <Route exact path={this.props.match.path} component={QuestionListContainer} />
                           {/*  <Route path={`${this.props.match.path}/uzytkownik/:userId`} component={User} /> */}
                            <Route path={`${this.props.match.path}/pytanie/:questionId`} component={QuestionView} />
                            <Route path={`${this.props.match.path}/zadaj-pytanie`} component={NewQuestion} />
                           {/*  <Route path={`${this.props.match.path}/nowa-wiadomosc/:userId/:userNick`} component={NewMessage} />
                            <Route path={`${this.props.match.path}/wiadomosci`} component={MessageContainer}/>
                            <Route path={`${this.props.match.path}/edytuj-profil`} component={EditProfile}/>
                            <Route path={`${this.props.match.path}/powiadomienia`} component={NotificationsContainer}/> */}


                    </div>

                    <ForumNavContainer/>

                </main>
                <AppArrow/>
            </div>
        );
    };


    }

const mapDispatchToProps = { logedIn };
const mapStateToProps = state => {
    return {
        user: state.user
    };
}

const Forum = connect(mapStateToProps,mapDispatchToProps)(ForumContainer);

export default Forum;