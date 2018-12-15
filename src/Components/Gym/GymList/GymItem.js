import React from 'react'
import {Link} from 'react-router-dom'

class GymItem extends React.Component{
    render(){
        var gymData = this.props.gymData;
      return(
        <React.Fragment>
              <div class="gym-list-box">
                <div class="gym-list-header">
                  <div class="img-holder">
                    <div class="gym-list-img" />
                  </div>
                  <div class="gym-list-name">
                    <Link to={`silownie/view/${gymData.gym_id}/${gymData.gym_name.split(' ').join('-')}`}> {gymData.gym_name} </Link>,{gymData.city}
                  </div>
                  <div class="gym-list-stars">{gymData.evaluation}</div>
                </div>
                <div class="gym-list-body">
                  <div class="gym-list-description">
                    <p>
                      {gymData.description}
                    </p>
                  </div>
                </div>
                <div class="gym-list-footer">
                  <div class="gym-list-offer">sauna, siłownia</div>
                  <div class="gym-list-hours">Godziny otwarcia</div>
                </div>
              </div>
      </React.Fragment>
      );
    }
}

export default GymItem