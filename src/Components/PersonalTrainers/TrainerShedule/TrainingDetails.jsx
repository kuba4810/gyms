import React, { Component } from 'react';

class TrainingDetails extends Component {
    state = {  }

    hide =() =>{
        document.querySelector('.trainingDetails').classList.remove('zoomIn');
        document.querySelector('.trainingDetails').classList.add('zoomOut');

        setTimeout(()=>{
            document.querySelector('.trainingDetails').classList.add('invisible');
        },400)
       
    }
    render() { 
        return ( 
        <div className="trainingDetails invisible animated">
            <div className="trainingContent">
                <div className="hideTrainingDetails"  onClick={this.hide} ><i class="fas fa-times"></i></div>
            </div>
        </div> );
    }
}
 
export default TrainingDetails;