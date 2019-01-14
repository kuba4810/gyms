import React from 'react'
import { booleanLiteral } from 'babel-types';
import {Link} from 'react-router-dom'


class User extends React.Component{
    constructor(){
        super(...arguments);

        this.state = {
            userData : null,
            type: ''
        }
 
    }

    componentDidMount(){
        /* document.querySelector(".forumNav").classList.add("invisible");
        document.querySelector(".forumContent").style.width="100%"; */
        console.log('Zamontowano komponent USER');
        

        fetch("http://localhost:8080/getUserData/" +  this.props.match.params.user_login, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin", //
            headers: {
                "Content-Type": "application/json;",
            },
            redirect: "follow",
            referrer: "no-referrer", // no-referrer, *client
        }).then(response => response.json())
            .then((response) => {
                 this.setState({userData: response.data,type:response.type})
             });
                                    
    }

    compareNick(){
        console.log("Zalogowany nick: ",localStorage.getItem("loggedNick"))
         if(localStorage.getItem("loggedNick") === this.props.match.params.user_login){
             return "SAME";

         }
         else if(localStorage.getItem("loggedNick")===""){
             return "NONE";
         }
         else if(localStorage.getItem("loggedNick") !== this.props.match.params.userId){
             return "DIFFERENT";
         }
        
    }
    render(){
        var data = this.state.userData;
        var type = this.state.type;

        
        if(data!== null){
            var button;
        switch( this.compareNick() ){
            case "SAME":
                button = <div className="editProfile transition " id="editProfile" ><Link to="/uzytkownik/edytuj-profil">Edytuj profil</Link></div>
            break;
            case "DIFFERENT":
                button = <div className="editProfile transition " id="sendMessage"> 
                <Link to={"/uzytkownik/nowa-wiadomosc/" + this.props.match.params.user_login}>Wiadomość</Link>
                </div>
            break;
            case "NONE":
                button = ""
            break;
        }
            return(

                <div>
        
                   <div className="topicsGroupTitle">Użytkownik {this.props.match.params.user_login}</div>
                    <div className="topicsContent" id="topicsContent">
                        <div className="user">
    
                    <div className="userPersonalData animated fadeIn">
                        <div className="profileImage">
                            
                            <i className="fas fa-user"></i>
                        </div>
    
    
                        <ul className="userDataList ">
                            {type === 'user' ? <li><span className="title">Zarejestrowany od:</span> <span className="value" id="joinDate"> {data.join_date.substring(0,10)} </span></li>:null}
    
                            <li><span className="title">Imię:</span> <span className="value" id="firstName"> {data.first_name} </span></li>
                            <li><span className="title">Nazwisko:</span> <span className="value" id="lastName"> {data.last_name} </span>
                            </li>
                            {type === 'user'?  <div>
                            <li><span className="title">Wzrost:</span> <span className="value" id="height">  {data.height} cm </span></li>
                            <li><span className="title">Masa:</span> <span className="value" id="mass">  {data.mass} kg  </span></li>
                            <li><span className="title">Ulubione Ćwiczenie:</span> <span className="value"
                                                                                         id="favExc">  {data.favourite_exercise} </span></li>
                            </div>:null}
    
                        </ul>
    
        
                        {  localStorage.getItem('isLoggedIn') === 'true' && button }
                       
                       
                    </div>
    
    
    
                   {type==='user' ? 
                   <div className="userForumData  animated fadeIn">
                        <p className="userForumDataTitle"> Aktywność użytkownika:</p>
    
                        <ul className="userForumDataList">
                            <li><span className="title">Zadane pytania:</span> <span className="value"
                                                                                     id="usrQuestions"> {data.questions} </span></li>
                            <li><span className="title">Udzielone odpowiedzi:</span> <span className="value"
                                                                                           id="usrAnswers"> {data.answers} </span></li>
                            <li><span className="title">Napisane komentarze:</span> <span className="value"
                                                                                          id="usrVotesUp"> 0 </span></li>
                            <li><span className="title">Oddanych głosów:</span> <span className="value"
                                                                                      id="usrVotesDown"> {data.voted_down + data.votes_up} </span></li>
    
    
                        </ul>
                    </div>
                  :null}
    
                </div>
                    </div>
                </div>
    
            );
        }
        else{
            return(
                <div>
                <div className="topicsGroupTitle">

                </div>
                <div className="topicsContent" id="topicsContent">
                        
                <div class="loaderContainer">
                    <div class="loader">
                    </div>
                    <div class="loaderInner">
        
                    </div>
        
                    <div class="loaderInnerSmall">
        
                    </div>
        
                </div>
                </div>
            </div>
            );
        }
        
    }
}

export default User;