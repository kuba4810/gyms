import React, { Component } from "react";
import {Link} from 'react-router-dom';
import {connect} from 'react-redux'

import {checkIfLoggedIn,getLoggedUserData} from '../../../services/localStorage'
import {logedIn} from '../../../Actions'
import ForumHeader from '../../ForumHeader'
import {LoginForm} from '../../Forum/LoginForm'
import RegisterForm from '../../Forum/RegisterForm'
import {UserMenu} from '../../User/UserMenu'

import '../../../styles/userStyles.css'

class HeaderGym extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = {  }
    }

   /*  componentDidMount(){
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
    } */

    render() {
    return (
      <React.Fragment>
        <LoginForm/>
        <RegisterForm/>
        <UserMenu/>
        
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = { logedIn };
const mapStateToProps = state => {
    return {
        user: state.user
    };
}

const Header = connect(mapStateToProps,mapDispatchToProps)(HeaderGym);

export default Header;
