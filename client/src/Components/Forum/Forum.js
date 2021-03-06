import React from "react"
import {connect} from 'react-redux'
import {checkIfLoggedIn,getLoggedUserData} from '../../services/localStorage'
import {logedIn,updateMsgNtf} from '../../Actions/index'
import {fetch_msg_ntf_count} from '../../services/API/user';
import {getUserData} from '../../services/API/user';
import {getTrainerData} from '../../services/API/trainers';

import {TopicsMenu} from "./TopicsMenu";
import {ForumNavContainer} from "./ForumNav";
import ForumHeader from '../ForumHeader'

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

    componentDidMount = async ()=>{
        
        const forumNav = document.querySelector('.forumNav');

        forumNav.classList.remove('forumNavVisible');

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

    // SHOW FORUM NAV
    // ------------------------------------------------------------------------
    showForumNav = () => {

        const forumNav = document.querySelector('.forumNav');

        forumNav.classList.add('forumNavVisible');

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
                    page={'FORUM'}
                    image = {this.props.user.image}/>

                <main className="animated forumMain pt-5">
                    <div className="forumContent">

                    
                            {/* Hamburger button */}
                            <div className="showForumNav text-light" onClick={this.showForumNav}>
                               <div></div>
                               <div></div>
                               <div></div>
                            </div>

                            <TopicsMenu/>


                            <Route exact path={this.props.match.path} component={QuestionListContainer} />
                            <Route path={`${this.props.match.path}/pytanie/:questionId`} component={QuestionView} />
                            <Route path={`${this.props.match.path}/zadaj-pytanie`} component={NewQuestion} />


                    </div>

                    <ForumNavContainer/>

                </main>
                <AppArrow/>
            </div>
        );
    };


    }

const mapDispatchToProps = { logedIn ,updateMsgNtf};
const mapStateToProps = state => {
    return {
        user: state.user
    };
}

const Forum = connect(mapStateToProps,mapDispatchToProps)(ForumContainer);

export default Forum;