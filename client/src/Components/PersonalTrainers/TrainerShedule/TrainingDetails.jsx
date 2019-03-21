import React, { Component } from 'react';
import history from '../../../history'
import axios from 'axios'
import { Link } from 'react-router-dom'
import {connect} from 'react-redux';
import {editModeActive,trainingChoosen} from '../../../Actions/trainings';


class Details extends Component {
    state = {
        isLoading: true,
        training: {}
    }

    

    // Jeśli komponent dostanie nowy id treningu pobierze dane nowego treningu
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.training_id !== this.props.training_id) {
            // Jeśli id różni się od obecnego
            if (this.props.training_id != 0) {
                console.log('Pobieram dane treningu o id: ', this.props.training_id);

                // Ustaw flagę, ładuje dane
                this.setState({
                    isLoading: true
                })
                // Pobieranie danych
                fetch(`http://localhost:8080/api/trainer/training/${this.props.training_id}`)
                    .then(res => res.json())
                    .then(res => {
                        console.log('Dane treningu: ', res);

                        if (res.response === 'failed') {
                            Promise.reject();
                        }
                        else {
                            // Zaktualizuj state
                            this.setState({
                                isLoading: false,
                                training: res.response_data
                            })
                            console.log(res);

                        }
                    })
                    .catch(err => {
                        console.log(err);
                        alert('Wystąpił błąd ! Spróbuj ponownie później');

                    })
            }
        }



    }
    componentDidMount() {
        console.log('Montuje details');
        console.log('Nowy id w details(Mount): ', this.props.training_id);

    }

    // Ukrywa panel szczegółów treningu
    hide = () => {
        document.querySelector('.trainingDetails').classList.remove('zoomIn');
        document.querySelector('.trainingDetails').classList.add('zoomOut');
        this.props.clear();


        setTimeout(() => {
            document.querySelector('.trainingDetails').classList.add('invisible');
        }, 400)

    }

    showNewTrainingForm = () => {
        let container = document.querySelector('.newTrainingContainer');
        container.classList.remove('zoomOut');
        container.classList.remove('invisible');
        container.classList.add('zoomIn');
    }

    deleteTraining = async () => {

        try {
            
            let res = await this.props.deleteTraining(this.state.training.training_id);
            if(res === 'success'){
                this.hide();
            } else {
                throw 'failed'
            }

        } catch (error) {
            console.log(error);
            
            alert('Wystąpił błąd, spróbuj ponownie później !')
        }

    }

    editTraining = () => {

        console.log('Wysyłam z details taki trening : ',this.state.training);
        

        // #1 Store update
        this.props.trainingChoosen(this.state.training)
        this.props.editModeActive();
        this.hide();
        this.showNewTrainingForm();


    }

    // Render
    render() {

        // Deklaracje zmiennych potrzebnych do renderowania
        let data = ''
        let primaryData = ''
        let mainData = ''
        let userData = ''
        let gymData = ''
        let user_type = localStorage.getItem('type');
        let buttons = '';

        // Po załadowaniu danych
        if (!this.state.isLoading) {
            data = this.state.training;
            console.log('State ', this.state);

            // Podstawowe dane wyświetlane w nagłówku
            // Nazwa treningu i pełna data z godziną
            primaryData = <div className="trainingContentTitle">
                <div className="trainingPrimaryData">
                    <b>{data.name}</b>, {data.date}
                </div>
            </div>

            // Szczegółowe dane dotyczące treningu
            // Notatka, czas trwania, cena, nazwa siłowni
            // Jeśli siłownia znajduje się w bazie, utworzony zostanie do niej
            // link przekierowujący do widoku siłowni
            mainData = <div>
                <div className="trainingSheduleContentMain">

                    <div className="sheduleMainDescription">

                        {/* Notatka */}
                        <div className="trainingDescription">
                            <h3>Notatka</h3>
                            <hr />
                            <div className="note">
                                {data.note}
                            </div>
                        </div>
                    </div>

                    <div className="trainingSheduleDetails">
                        <ul className="trainingDetailsList">
                            <li>
                                {/* Siłownia, jeśli znane jest id to utwórz Link */}
                                <b>Siłownia</b> :
                                    {data.gym_id !== null ?
                                    <Link to={`/silownie/view/${data.gym_id}/${data.gym_name.split(' ').join('-')}`} >
                                        {data.gym_name}
                                    </Link> :
                                    data.gym_name
                                }
                            </li>
                            {/* Czas trwania oraz zapłata do odebrania */}
                            <li><b>Czas trwania:</b> {data.duration}</li>
                            <li><b>Kwota do odebrania:</b>  {data.prize}</li>
                        </ul>
                    </div>
                </div>
            </div>

            // W zależności jaki typ użytkownika wyświetla trening, takie dane są
            // wyświetlane. Są to dane klienta bądż=ź trenera 
            userData =
                <div className="sheduleUserData">
                    <div>
                        <h3>
                            {
                                user_type === 'trainer' ? 'Klient' : 'Trener'
                            }
                        </h3>
                        <hr />
                    </div>

                    <b>
                        {
                            user_type === 'trainer' ? 'Klient' : 'Trener'
                        }
                    </b>:
                {data.user_id !== null ?
                        <Link to={`/uzytkownik/profil/${user_type === 'trainer' ? data.login : data.trainer_login}`}>
                            {user_type === 'trainer' ? data.user_name :
                                `${data.trainer_f_name} ${data.trainer_l_name}`}
                        </Link> :
                        user_type === 'trainer' ? data.user_name :
                            `${data.trainer_f_name} ${data.trainer_l_name}`
                    }
                    <br />
                    <b>Tel:</b> {data.phone_number}
                </div>

            buttons = <div className="trainingDetailsButtons  d-flex justify-content-end">

                        <div className="btn btn-warning w-25"
                             onClick={this.editTraining}>
                             Edytuj
                        </div>

                        <div className="btn btn-danger w-25"
                        onClick={this.deleteTraining}>
                            Usuń
                        </div>
                      </div>

        }


        return (
            <div className="trainingDetails invisible animated">

                <div className="">
                    {/* Wyświetl spinne gdy dane są ładowane */}
                    {this.state.isLoading && <div className="littleSpinner" ></div>}
                    {/* Nagłówek treningu */}
                    <div className="trainingDetailsHeader">
                        <div className="hideTrainingDetails" onClick={this.hide} ><i class="fas fa-times"></i></div>
                    </div>
                    {primaryData}
                    {mainData}
                    {gymData}
                </div>
                {userData}

                { localStorage.getItem('type') === 'trainer' && buttons}

            </div>);
    }
}


const mapStateToProps = (state) => {
    return {
        editMode : state.trainings.editMode
    }
}

const mapDispatchToProps = {trainingChoosen,editModeActive}

const TrainingDetails = connect(null,mapDispatchToProps)(Details);

export default TrainingDetails;