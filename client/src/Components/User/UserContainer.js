import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import ForumHeader from '../ForumHeader'

import {connect} from 'react-redux'
import {checkIfLoggedIn,getLoggedUserData} from '../../services/localStorage'
import {logedIn,updateMsgNtf} from '../../Actions/index'
import {fetch_msg_ntf_count} from '../../services/API/user';

import {getUserData} from '../../services/API/user';
import {getTrainerData} from '../../services/API/trainers';

import {LoginForm} from '../Forum/LoginForm'
import RegisterForm from '../Forum/RegisterForm'
import {UserMenu} from './UserMenu'
import MessageContainer from './Messages/MessageContainer'
import EditProfile from './EditProfile'
import NotificationsContainer from './Notifications/NotificationsContainer'
import NewMessage from './Messages/NewMessage'
import User from './User'
import SheduleContainer from '../PersonalTrainers/TrainerShedule/SheduleContainer'

import {NavLink} from 'react-router-dom'

class UserCont extends Component {
    state = {  }

    componentDidMount = async () => {

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

    // RENDER
    // --------------------------------------------------------------------------------------------
    render() { 
        let user_nick = localStorage.getItem('loggedNick');
        return ( <div className="userContent pt-5">
                <LoginForm/>
                <RegisterForm/>
                <UserMenu/>
                <ForumHeader 
                
                     isLogedIn={this.props.user.isLogedIn}
                     isEmailConfirmed={this.props.user.emailConfirmed}
                     page={'UZYTKOWNIK'}/>

                     
            <div className="userContentData">
               { localStorage.getItem('isLoggedIn') === 'true' && <div className="topicsMenu">
                    <NavLink to={ `/uzytkownik/profil/${user_nick}` } activeClassName ="topicActive" className="topic">
                       Profil
                    </NavLink>

                    <NavLink to={ `/uzytkownik/wiadomosci` } activeClassName ="topicActive" className="topic">
                       Wiadomości
                    </NavLink>

                    <NavLink to={ `/uzytkownik/powiadomienia` } activeClassName ="topicActive" className="topic">
                       Powiadomienia
                    </NavLink>

                    <NavLink to={ `/uzytkownik/harmonogram` } activeClassName ="topicActive" className="topic">
                       Harmonogram
                    </NavLink>

                    <NavLink to={ `/uzytkownik/edytuj-profil` } activeClassName ="topicActive" className="topic">
                       Edytuj profil
                    </NavLink>

                    {/* <div className="topic  topicActive" style={{padding: "23px 0px"}} onClick={this.handleSort}> NAJNOWSZE </div>
                    <div className="topic" style={{padding: "23px 0px"}}>NAJSTARSZE</div>
                    <div className="topic">NAJWIĘCEJ ODPOWIEDZI</div>
                    <div className="topic">BEZ ODPOWIEDZI</div>
                    <div className="topic" style={{padding: "23px 0px"}}>CZĘSTO ODWIEDZANE</div> */}
                </div>}
                
                            {/* <Route exact path={this.props.match.path} component={QuestionListContainer} /> */}
                            <Route path={`${this.props.match.path}/profil/:user_login`} component={User} />
                            <Route path={`${this.props.match.path}/nowa-wiadomosc/:user_login`} component={NewMessage} />
                            <Route path={`${this.props.match.path}/wiadomosci`} component={MessageContainer}/>
                            <Route path={`${this.props.match.path}/edytuj-profil`} component={EditProfile}/>
                            <Route path={`${this.props.match.path}/powiadomienia`} component={NotificationsContainer}/>
                            <Route path={`${this.props.match.path}/harmonogram`} component={SheduleContainer}/>
            </div>
        </div>);
    }
}

const mapDispatchToProps = { logedIn ,updateMsgNtf};
const mapStateToProps = state => {
    return {
        user: state.user
    };
}

const UserContainer = connect(mapStateToProps,mapDispatchToProps)(UserCont);

 
export default UserContainer;