import React from 'react'

class GymItem extends React.Component{
    render(){
        var gymData = this.props.gymData;
      return(
        <div>
         <li> {gymData.gym_name},{gymData.city},{gymData.evaluation}</li>
         </div>
      );
    }
}

export default GymItem