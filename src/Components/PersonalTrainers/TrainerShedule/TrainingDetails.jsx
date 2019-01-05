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
        }, 400)

    }
    render() {

        let data = this.state.training;
        let primaryData = ''
        let mainData =''
        let clientData =''

        if (!this.state.isLoading) {
            primaryData = <div className="trainingContentTitle">
                <div className="trainingPrimaryData">
                    <b>{data.name}</b>, {data.date}
                </div>
                {/* <div className="sheduleUserData">
                    Klient: {data.first_name} {data.last_name} {data.login}
                </div> */}
            </div>

            mainData = <div>
                          <div className="trainingSheduleContentMain">

                             <div className="sheduleMainDescription">
                                <div className="trainingDescription">
                                   <h3>Notatka</h3>
                                   <hr/>
                                   <div className="note">
                                      {data.note}
                                   </div>
                                </div>
                             </div>

                             <div className="trainingSheduleDetails">
                                <ul className="trainingDetailsList">
                                   <li><b>Czas trwania:</b> {data.duration}</li>
                                   <li><b>Cena:</b>  {data.prize}zł</li>
                                </ul>
                             </div>
                          </div>
                       </div>

       clientData = <div className="sheduleUserData">
                        <div>
                           <h3>Klient</h3>
                           <hr/>
                        </div> 
                        {data.first_name} {data.last_name} {data.login}
                    </div>
           
        }


        return (
            <div className="trainingDetails invisible animated">
                <div className="trainingContent">
                    {/* <div className="sheduleLittleTitle"><h3>Szczegóły treningu</h3></div> */}
                    {this.state.isLoading && <div className="littleSpinner" ></div>}
                    <div className="trainingDetailsHeader">
                        <div className="hideTrainingDetails" onClick={this.hide} ><i class="fas fa-times"></i></div> 
                     </div>

                    {primaryData}
                    
                    {mainData}
                   {/*  <div className="sheduleLittleTitle">Dane klienta</div> */}

                  
                </div>

              {clientData}

            </div>);
    }
}



export default TrainingDetails;