import React, { Component } from 'react';
class DayItem extends Component {

    state = {  }

    showTrainings = ()=>{
        if(this.props.trainings && this.props.trainings.length > 0){
            let table = this.props.trainings.map( training=> (training.id) );
            this.props.showTrainings(table)
        }
    }

    render() { 
        var isEvent=false;
        var dayNumber = this.props.dayNumber;
        if(this.props.dayNumber !== '-')
        {
            if( this.props.trainings.length > 0){
                console.log('Dostałem treningi: ',this.props.trainings)
                isEvent=true;
            }
        }
     
        return ( 
        <div 
           className={`dayItem ${isEvent ? 'dayItemIsEvent' : ''} ${(dayNumber === '-') ? 'dayItemNone' : ''}` }
           onClick={this.showTrainings}
        >
            {this.props.dayNumber}
        </div> );
    }
}
 
export default DayItem;