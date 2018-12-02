import React from 'react'
import {Link} from 'react-router-dom'

class GymItem extends React.Component{
    render(){
        var gymData = this.props.gymData;
      return(
        <div>
          <li> <Link to={`silownie/view/${gymData.gym_id}/${gymData.gym_name.split(' ').join('-')}`}> {gymData.gym_name} </Link>,{gymData.city},{gymData.evaluation}</li>
         </div>
      );
    }
}

export default GymItem