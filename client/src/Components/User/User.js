import React from 'react'
import {booleanLiteral} from 'babel-types';
import {Link} from 'react-router-dom';
import {getUserData,checkAccountType} from '../../services/API/user';
import {getTrainerData} from '../../services/API/trainers';

import UserProfile from './Profile/UserProfile';
import TrainerProfile from './Profile/TrainerProfile';

class User extends React.Component {
        constructor() {
            super(...arguments);

            this.state = {
                userData: null,
                type: ''
            }

        }

 // FETCH DATA
 // ---------------------------------------------------------------------------  
 fetchData = async () => {

     let res = await checkAccountType(this.props.match.params.user_login);
     let type;
     let data;

     if(res.response === 'failed'){
         throw 'failed'
     }

     type = res.type;
     console.log('Sprawdzony typ : ', res);
     

     if(res.type === 'user'){
         res = await getUserData(res.id);
         

     } else {
         res = await getTrainerData(res.id);
     }

     if(res.response === 'failed'){
         throw 'failed'
     }

     console.log('Pobrane dane : ', res);
   
     

    this.setState({
        type : type,
        userData : res.data
    })

 }

        componentDidMount = async () => {

            await this.fetchData();

        }

        componentDidUpdate = async (prev) => {
            if (prev.match.params.user_login !== this.props.match.params.user_login) {
                this.setState({
                    data : null
                })
                await this.fetchData();
            }
        }

        compareNick() {
            console.log("Zalogowany nick: ", localStorage.getItem("loggedNick"))
            if (localStorage.getItem("loggedNick") === this.props.match.params.user_login) {
                return "SAME";

            } else if (localStorage.getItem("loggedNick") === "") {
                return "NONE";
            } else if (localStorage.getItem("loggedNick") !== this.props.match.params.userId) {
                return "DIFFERENT";
            }

        }
        render() {
            var data = this.state.userData;
            var type = this.state.type;

            let container;

            if(type === 'user'){
                container = <UserProfile 
                             data = {this.state.userData} 
                             loggedNick = {this.props.match.params.user_login}
                            />
            } else {
                container = <TrainerProfile 
                             data = {this.state.userData} 
                             loggedNick = {this.props.match.params.user_login}
                            />
            }


            if (data !== null) {
                var button;
                switch (this.compareNick()) {
                    case "SAME":
                        button = <div className = "editProfile transition " id="editProfile" >
                         <Link to = "/uzytkownik/edytuj-profil" > Edytuj profil</Link> </div>
                            break;
                    case "DIFFERENT":
                        button = <div className = "editProfile transition" id = "sendMessage">
                            <Link to = {"/uzytkownik/nowa-wiadomosc/" + this.props.match.params.user_login} > Wiadomość </Link> </div >
                            break;
                    case "NONE":
                        button = ""
                        break;
                }

                let title;

                if(type === 'user') {
                    title = `Użytkownik ${this.props.match.params.user_login}`
                } else {
                    title = `Trener ${this.props.match.params.user_login}`
                }
                return (

                    <div>

                         <div className = "topicsGroupTitle" > {title} </div>
                         <div className = "topicsContent" id = "topicsContent"> 
                    
                         <div className="user">
                             {container}
                        </div> 
                    </div>
                    </div>
                 );
                }
                else {
                    return ( 
                        <div>

                            <div className = "topicsGroupTitle">

                            </div> 

                            <div className = "topicsContent" id = "topicsContent">

                            <div class = "loaderContainer">

                                <div class = "loader"> </div>

                                <div class = "loaderInner"></div>

                                <div class = "loaderInnerSmall"></div>

                            </div> 

                        </div > 
                    </div>
                    );
                }

            }
        }

        export default User;