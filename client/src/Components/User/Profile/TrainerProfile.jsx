import React, { Component } from 'react';
import {Link} from 'react-router-dom';
class TrainerProfile extends Component {
    state = {}


    compareNick() {
        console.log("Zalogowany nick: ", localStorage.getItem("loggedNick"))
        if (localStorage.getItem("loggedNick") === this.props.loggedNick) {
            return "SAME";

        } else if (localStorage.getItem("loggedNick") === "") {
            return "NONE";
        } else if (localStorage.getItem("loggedNick") !== this.props.loggedNick) {
            return "DIFFERENT";
        }

    }

    render() {

        let data = this.props.data.trainer;
        let skills = this.props.data.skills.map( s=>(

            <div className="col-lg-4 col-md-6 col-12">
                <i className="fas fa-check"></i>
                <b> {s.name} </b>
            </div>

        ));

        if (data !== null) {
            var button;
            switch (this.compareNick()) {
                case "SAME":
                    button = <div className="editProfile transition " id="editProfile" >
                        <Link to="/uzytkownik/edytuj-profil" > Edytuj profil</Link> </div>
                    break;
                case "DIFFERENT":
                    button = <div className="editProfile transition" id="sendMessage">
                        <Link to={"/uzytkownik/nowa-wiadomosc/" + this.props.loggedNick} > Wiadomość </Link> </div >
                    break;
                case "NONE":
                    button = ""
                    break;
            }
        }



            return (
                <div className="w-100" > 


                    <div className="userPersonalData animated fadeIn">
                        <div className="profileImage">

                        {
                            data.image === null &&
                            <i className="fas fa-user"> </i>
                        }

                        {
                            data.image !== null &&
                            <img src={`http://localhost:8080/public/images/${data.login}.jpg`} />
                        }
                            
                            
                        </div>


                        <ul className="userDataList">
                            <li>
                                <span className="title" > Zarejestrowany od : </span>
                                <span className="value" id="joinDate">
                                    {data.join_date.substring(0, 10)}
                                </span>
                            </li>

                            <li>
                                <span className="title" > Imię: </span>
                                <span className="value" id="firstName"> {data.first_name} </span >
                            </li>

                            <li>
                                <span className="title" > Nazwisko: </span>
                                <span className="value" id="lastName"> {data.last_name} </span>
                            </li>

                            <li>
                                <span className="title" > Miasto: </span>
                                <span className="value" > {data.city} </span>
                            </li>

                            
                            <li>
                                <span className="title" > Województwo: </span>
                                <span className="value" > {data.voivodeship} </span>
                            </li>

                            {/* <div>

                                <li> <span className="title" > Wzrost : </span>
                                    <span className="value" id="height">
                                        {data.height} cm
                                    </span >
                                </li>

                                <li>
                                    <span className="title" > Masa: </span>
                                    <span className="value" id="mass">
                                        {data.mass} kg
                                          </span >
                                </li>

                                <li>
                                    <span className="title" > Ulubione Ćwiczenie: </span>
                                    <span className="value" id="favExc" >
                                        {data.favourite_exercise}
                                    </span>
                                </li>

                            </div> */}

                        </ul>


                        {
                            localStorage.getItem('isLoggedIn') === 'true' && button
                        }


                    </div>

                    <div className="userForumData  animated fadeIn">
                        <p className="userForumDataTitle" > Umiejętności : </p>

                        <div className="row">
                             {skills}
                        </div>

                        <p className="userForumDataTitle" > Aktywność na forum : </p>
                        <ul className="userForumDataList">
                            <li>
                                <span className="title">
                                    Udzielone odpowiedzi:
                                </span>
                                <span className="value">
                                    12
                                </span>
                            </li>
                        </ul>


                        {/* <ul className="userForumDataList">
                            <li>
                                <span className="title" >
                                    Zadane pytania:
                                </span>
                                <span className="value" id="usrQuestions" >
                                    {data.questions}
                                </span>
                            </li>

                            <li>
                                <span className="title">
                                    Udzielone odpowiedzi:
                                </span>
                                <span className="value" id="usrAnswers" >
                                    {data.answers}
                                </span>
                            </li>

                            <li>
                                <span className="title" >
                                    Napisane komentarze:
                                </span>
                                <span className="value" id="usrVotesUp" >
                                    0
                                </span>
                            </li>

                            <li>
                                <span className="title" >
                                    Oddanych głosów:
                                    </span>
                                <span className="value" id="usrVotesDown" >
                                    {data.voted_down + data.votes_u}
                                </span>
                            </li >

                        </ul> */}
                    </div>
                    
    
            </div>
            );
        }
    }

    export default TrainerProfile;
