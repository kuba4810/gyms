import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom'
import {filterTrainer} from '../../../Selectors/filterTrainers';

class List extends Component {
    state = {}
    render() {

        console.log('Trenerzy (List): ', this.props.trainers );
        return (
            <React.Fragment>

                 <h2 className="text-center p-4 bg-light text-dark mb-0 ">Dostępni Trenerzy:</h2>
                <div className="row container-fluid bg-light text-dark w-100 m-0">



                    <div className="row  trainerList">
                        {this.props.trainers.map(trainer =>

                            //Nowe do testu 

                            <div className="col-md-6 col-lg-4 col-xl-3 p-4">
                                <div class="card h-100 text-white bg-dark imgTrainer" >

                                    {
                                        trainer.image ?
                                            <img className="main-card-img-top" src={`http://localhost:8080/public/images/${trainer.image}.jpg`} alt="Card image cap" /> :
                                            <img className="main-card-img-top" src={require('../../../images/user.jpg')} />
                                    }

                                    <div class="card-body animated">
                                        <h5 class="card-title">{trainer.first_name} {trainer.last_name}</h5>
                                        <h6 class="card-title">{trainer.city}</h6>
                                        <p class="card-text">
                                            {
                                                trainer.description.length < 100 ? trainer.description : <div>{trainer.description.slice(0, 100)}...</div>
                                            }
                                        </p>
                                    </div>
                                    <div className="card-footer text-center">
                                        <Link to={`trenerzy/widok/${trainer.trainer_id}`}><button type="button" class="btn btn-outline-secondary">Wiecej o mnie</button></Link>
                                    </div>
                                </div>
                            </div>

                        )}
                    </div>

                </div>
                ); 
           </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        trainers: filterTrainer(state.trainers)

    };
}


const TrainersList = connect(mapStateToProps)(List);

export default TrainersList;