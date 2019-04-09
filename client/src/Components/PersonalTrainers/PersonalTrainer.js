import React, { Component } from 'react';
import { directive } from 'babel-types';
import { connect } from 'react-redux'
import { checkIfLoggedIn, getLoggedUserData } from '../../services/localStorage'
import { logedIn, updateMsgNtf } from '../../Actions/index'
import { fetch_msg_ntf_count } from '../../services/API/user';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import axios from 'axios';

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


    componentDidMount = async () => {
        let isLoggedIn = checkIfLoggedIn();

        console.log('W magazynie mówią że zalogowany to : ', this.props.user.isLogedIn);


        if (isLoggedIn !== this.props.user.isLogedIn) {
            if (isLoggedIn) {
                let userData = getLoggedUserData();
                console.log('Dane użytkownika: ', userData);


                let msgCount = fetch(`http://localhost:8080/api/user/${userData.id}/${userData.type}/msgCount`)
                    .then(res => res.json());

                let ntfCount = fetch(`http://localhost:8080/api/user/${userData.id}/${userData.type}/ntfCount`)
                    .then(res => res.json());

                Promise.all([msgCount, ntfCount])
                    .then(values => {
                        console.log("Pobrane dane: ", values);
                        let data

                        if (values[0].response !== 'failed' && values[1].response !== 'failed') {
                            data = {
                                loggedId: userData.id,
                                emailConfirmed: userData.isEmailConfirmed,
                                logedNick: userData.nick,
                                messageCount: values[0].data,
                                notificationsCount: values[1].data
                            }
                        }
                        else {
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
                    .catch(err => {
                        console.log("Wystąpił błąd !", err);
                    })
            }

        }
        else if (isLoggedIn === this.props.user.isLogedIn && isLoggedIn) {

            let id = localStorage.getItem('loggedId');
            let type = localStorage.getItem('type');

            let data = await fetch_msg_ntf_count(id, type);

            if (data.response === 'success') {

                this.props.updateMsgNtf({
                    msg: data.msg,
                    ntf: data.ntf
                })
            }
        }

        let API = 'http://localhost:8080/api/trainers';

        axios.get(API)
            .then(res => {
                console.log(res);
                this.setState({
                    trainers: res.data
                })
            })


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

                <div className="trainerSearch jumbotron text-center text-light p-0 " style={{ marginBottom: 0 }}>
                   <div className="trainerSearchContent m-0">
                   <h1>Znajdz Profesjonalnych trenerow w twoim rejonie</h1>
                    <h5>Pełne plany trenerow wraz z opiniami i cennikiem</h5>

                    <div className="container-fluid mt-4 ">
                        <div className="row">
                            <div className="input-group col-lg-3  mb-3 mx-auto">
                                <div className="input-group-prepend">
                                    {/* <span className="input-group-text" id="inputGroup-sizing-default">Wyszukaj</span> */}
                                </div>
                                <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                            </div>
                        </div>
                    </div>
                    <Link to="/trener-rejestracja"><button type="button" class="btn btn-outline-warning">Zarejestruj sie jako trener</button></Link>
                   </div>
                </div>

                <h2 className="text-center p-4 bg-light text-dark mb-0 ">Dostępni Trenerzy:</h2>
                <div className="row container-fluid bg-light text-dark w-100 m-0">


                    {/* <div className="col-md-6 col-xl-3 p-4">
                          <div className="card">
                          <img className="card-img-top" src="https://cdn1us.denofgeek.com/sites/denofgeekus/files/styles/main_wide/public/2016/07/arnold-schwarzenegger-pumping-iron.jpg?itok=ovqXmA3Y" alt="Card image cap"/>
                              <div className="card-body">
                              <h5 className="card-title">Arnold Schwarzenegger</h5>
                              <p className="card-text">Najlepszy trener ever</p>
                              </div>
                          </div>
                        </div>
                    */}

                    {/* src="http://colegioclassea.com.br/wp-content/themes/PageLand/assets/img/avatar/avatar.jpg" */}
                    <div className="row  ">
                    {this.state.trainers.map(trainer =>

                        //Standardowe
                        // <div className="col-md-6 col-xl-3">
                        //     <div className="card mt-4 text-white bg-dark">
                        //         <div className=" card-header d-flex justify-content-between">
                        //             <img className="card-img-top h-25 w-25" src={trainer.photo_link} alt=""/>
                        //             <div className="mt-4 text-center">{`${trainer.first_name} ${trainer.last_name}, ${trainer.city}`}</div>
                        //         <div></div>
                        //     </div>
                        //         <div  className="card-body">
                        //             <p style={{minHeight: "5vw"}} className="card-text">{`${trainer.description}...`}</p>
                        //             <p className="card-title text-center">*****</p>
                        //         </div>
                        //         <div className="card-footer text-center">
                        //             <button type="button" class="btn btn-outline-secondary">Wiecej o mnie</button>
                        //         </div>
                        //     </div>
                        // </div>


                        //Nowe do testu 
                            
                                <div className="col-md-3 col-sm-6 p-4 ">
                                    <div class="card trainerCard text-white bg-dark" >
                                        {/* <img class="card-img-top" src="http://www.dzielnicewroclawia.pl/wp-content/uploads/2018/11/Gladiator-1.jpg" alt="Card image cap" /> */}
                                       {
                                           trainer.image === null ?
                                           <div><h1 clasName="text-center"> <i className="fas fa-user"></i> </h1></div> :
                                           <img class="card-img-top" 
                                           src={`http://localhost:8080/public/images/${trainer.image}.jpg`} 
                                           alt="Card image cap" 
                                           style={{height : '13vw'}}/>
                                       }
                                        <div class="card-body animated">
                                            <h5 class="card-title">{trainer.first_name} {trainer.last_name}, {trainer.city}</h5>
                                            <p style={{minHeight: "5vw"}} class="card-text">{trainer.description}</p>
                                        </div>
                                        <div className="card-footer text-center">
                                        <button type="button" class="btn btn-outline-secondary">Wiecej o mnie</button>
                                        </div>
                                    </div>
                                </div>
                            
                        

                        // <div className="col-md-6 col-xl-4 p-4">
                        //     <div className="card text-white bg-dark h-100">
                        //         <div className="card-header d-flex justify-content-around">
                        //             <div><img src="" className="rounded-circle" /></div>
                        //             <div>{`${trainer.first_name} ${trainer.last_name}, ${trainer.city}`}</div>
                        //         </div>
                        //         <div className="card-body">
                        //             <h5 className="card-title">Opis:</h5>
                        //             <p className="card-text ">{trainer.description} desctiption trenera</p>
                        //         </div>
                        //         <div className="card-footer d-flex justify-content-center">
                        //             <p className="card-text ">Gwiazdki</p>
                        //         </div>
                        //     </div>
                        // </div>
                    )}
                </div>

                </div>

                
                <Route exact path={this.props.match.path} component={TrainersListContainer} />
                <Route path={`${this.props.match.path}/harmonogram/:training_id?`} component={SheduleContainer} />

                <div className="footer-copyright text-center py-2 text-white">Kozioł && Koczaski 2018</div>
            </div>
        );
    }

}



const mapDispatchToProps = { logedIn, updateMsgNtf };
const mapStateToProps = state => {
    return {
        user: state.user

    };
}

const PersonalTrainer = connect(mapStateToProps, mapDispatchToProps)(Trainer);

export default PersonalTrainer;