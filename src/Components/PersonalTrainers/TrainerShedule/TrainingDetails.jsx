import React, { Component } from 'react';
import history from '../../../history'
import axios from 'axios'

class TrainingDetails extends Component {
    state = {
        isLoading: true,
        training: {}
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.training_id !== this.props.training_id) {
            if (this.props.training_id != 0) {
                console.log('Pobieram dane treningu o id: ',this.props.training_id);

                this.setState({
                    isLoading: true
                })
                fetch(`http://localhost:8080/api/trainer/training/${this.props.training_id}`)
                    .then(res => res.json())
                    .then(res => {
                        if (res.response === 'failed') {
                            Promise.reject();
                        }
                        else {
                            this.setState({
                                isLoading: false,
                                training: res.training
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

    hide = () => {
        document.querySelector('.trainingDetails').classList.remove('zoomIn');
        document.querySelector('.trainingDetails').classList.add('zoomOut');


        setTimeout(() => {
            document.querySelector('.trainingDetails').classList.add('invisible');
            history.push('/trenerzy/harmonogram')
        }, 400)

    }
    render() {

        let data = this.state.training;
        let primaryData = ''
        let mainData =''

        if (!this.state.isLoading) {
            primaryData = <div className="trainingContentTitle">
                <div className="trainingPrimaryData">
                    <b>{data.name}</b>, {data.date}
                </div>
                <div className="sheduleUserData">
                    Klient: {data.first_name} {data.last_name} {data.login}
                </div>
            </div>

            mainData = <div className="trainingSheduleContentMain">
                            <div className="sheduleMainDescription">
                                 <div className="trainingDescription">
                                 <div>Notka:</div>
                                 <hr/>
                                 {data.note}
                                </div>
                             </div>

                            <div className="trainingSheduleDetails">
                                <div className="trainingDuration">
                                Czas trwania: {data.duration}
                                </div>
                            <div className="trainingPrice">
                             Cena:  {data.prize}zł
                            </div>
                        </div>
                    </div>
        }


        return (
            <div className="trainingDetails invisible animated">
                <div className="trainingContent">

                    {this.state.isLoading && <div className="littleSpinner" ></div>}
                    <div className="trainingDetailsHeader">
                        <div className="hideTrainingDetails" onClick={this.hide} ><i class="fas fa-times"></i></div>
                    </div>

                    {primaryData}

                    {/* <div className="trainingSheduleContentMain">
                        <div className="sheduleMainDescription">
                            <div className="trainingDescription">
                            </div>
                        </div>
                        <div className="trainingSheduleDetails">
                            <div className="trainingDuration">
                            </div>
                            <div className="trainingPrice">
                            </div>
                        </div>
                    </div> */}

                    {mainData}
                </div>

              

            </div>);
    }
}



export default TrainingDetails;