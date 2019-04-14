import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { trainerSearchChanged } from '../../../Actions/trainers.js';

import { getTrainerList } from '../../../services/API/trainers'
import { connect } from 'react-redux';

import { trainersFetched } from '../../../Actions/trainers'

import TrainerList from './TrainersList';

class Trainers extends Component {
    state = {
        processing: true
    }

    componentDidMount = async () => {

        let res = await getTrainerList();
        console.log('Trenrzy: ', res)
        if (res.response === 'success') {
            console.log('Pobrani trenerzy : ', res)
            this.props.trainersFetched(res.trainers);
            this.setState({
                processing: false
            })
        }

    }

    handleChange = (e) => {

        this.props.trainerSearchChanged(e.target.value)

    }

    render() {
        return (
            <div>

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
                                    <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"
                                        onChange={this.handleChange} />
                                </div>
                            </div>
                        </div>
                        <Link to="/trener-rejestracja"><button type="button" class="btn btn-outline-warning">Zarejestruj sie jako trener</button></Link>
                    </div>
                </div>

                {
                    this.state.processing ?
                        <div className="dataLoadingMessage">

                            <h3>Ładowanie danych</h3>
                            <div className="littleSpinner" ></div>

                        </div> :
                    <TrainerList />
                }
            </div>
        );
    }
}


const mapDispatchToProps = { trainersFetched, trainerSearchChanged };


const TrainersListContainer = connect(null, mapDispatchToProps)(Trainers);

export default TrainersListContainer;

