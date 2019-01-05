import React from 'react'
import {Link} from 'react-router-dom'

class GymItem extends React.Component{
    render(){
        var gymData = this.props.gymData;
      return(
        <React.Fragment>
              
                <div class="col-md-6 col-xl-4 p-4">
                    <div class="card text-white bg-dark ">
                            <div class="card-header d-flex justify-content-between">
                                    <div><img src="https://img.icons8.com/color/50/000000/dumbbell.png" class="rounded-circle"/></div>
                                    <div><Link to={`silownie/view/${gymData.gym_id}/${gymData.gym_name.split(' ').join('-')}`}> {gymData.gym_name} </Link>,{gymData.city}</div>
                                    <div>{gymData.evaluation}</div>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">Special title treatment</h5>
                                <p class="card-text">{gymData.description}</p>
                                <p class="card-text">Sauna, siłownia</p>
                            </div>
                            <div class="card-footer d-flex justify-content-between">
                                <p class="card-text">Godziny otwarcia</p>
                            </div>
                    </div>
                </div>

      </React.Fragment>
      );
    }
}

export default GymItem