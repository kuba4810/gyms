import React from "react"

import {TopicsMenu} from "./TopicsMenu";
import {ForumNavContainer} from "./ForumNav";
import ForumHeader from './ForumHeader'
import User from './User/User'
import {NewQuestion} from './Questions/NewQuestion'
import NewMessage from './Messages/NewMessage'
import {QuestionListContainer} from './Questions/QuestionList'
import {QuestionView} from './Questions/QuestionView'
import {LoginForm} from './LoginForm'
import RegisterForm from './RegisterForm'
import {UserMenu} from './User/UserMenu'
import MessageContainer from './Messages/MessageContainer'
import EditProfile from './User/EditProfile'
import NotificationsContainer from './Notifications/NotificationsContainer'

import { BrowserRouter as Router, Route } from 'react-router-dom';

function AppHeader() {
    return (
        <header className="animated forumHeader">
            <div className="logo">
                <a href="http://localhost:3000/forum"> <i className="fas fa-dumbbell"></i> FORUM <i className="fas fa-dumbbell"></i></a>
            </div>


            <div className="menu">
                <div className="menuItem animated">
                    <a href="http://localhost:3000"><i className="fas fa-home"></i></a>
                </div>
                <div className="menuItem animated"><a href="http://localhost:3000/silownie">Siłownie</a></div>
                <div className="menuItem animated"><a href="http://localhost:3000/trenerzy">Trenerzy</a></div>
                <div className="menuItem animated" id="login">Logowanie</div>
                <div className="menuItem animated" id="registration">Rejestracja</div>
            </div>


            <div className="loginUser">
                <div className="loginUserDiv"><i className="fas fa-user"></i></div>
            </div>


            <div className="clear" style={{clear: "both"}}></div>

        </header>
    );
}
function AppArrow() {
        return (

            <div className="arrow">
                <i className="fas fa-arrow-up"></i>
            </div>
        );
    }


    class Forum extends React.Component{

    constructor(){
        super();

        this.state = {
            isLogedIn: false,
            isEmailConfirmed: false
        }
    }

    componentDidMount(){
        console.log("Stan localStorage w Forum : " , "Zalogowany: " + localStorage.getItem("logedIn") , "EmailPotwierdzony: " + localStorage.getItem("emailConfirmed"));
        if(localStorage.getItem("logedIn") != "false"){
            this.setState({
                isLogedIn:true
            });

            if(localStorage.getItem("emailConfirmed") == "true"){
                this.setState({
                    isEmailConfirmed: true
                });
            }
        }


    }
    render(){

        return(
            <div>
                <LoginForm/>
                <RegisterForm/>
                <UserMenu/>

                <ForumHeader isLogedIn={this.state.isLogedIn} isEmailConfirmed={this.state.isEmailConfirmed}/>

                <main className="animated forumMain">
                    <div className="forumContent">

                            <TopicsMenu/>

                            <Route exact path={this.props.match.path} component={QuestionListContainer} />
                            <Route path={`${this.props.match.path}/uzytkownik/:userId`} component={User} />
                            <Route path={`${this.props.match.path}/pytanie/:questionId`} component={QuestionView} />
                            <Route path={`${this.props.match.path}/zadaj-pytanie`} component={NewQuestion} />
                            <Route path={`${this.props.match.path}/nowa-wiadomosc/:userId/:userNick`} component={NewMessage} />
                            <Route path={`${this.props.match.path}/wiadomosci`} component={MessageContainer}/>
                            <Route path={`${this.props.match.path}/edytuj-profil`} component={EditProfile}/>
                            <Route path={`${this.props.match.path}/powiadomienia`} component={NotificationsContainer}/>


                    </div>

                    <ForumNavContainer/>

                </main>
                <AppArrow/>
            </div>
        );
    };


    }



export default Forum;