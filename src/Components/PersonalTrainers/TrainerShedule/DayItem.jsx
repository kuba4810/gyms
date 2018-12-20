import React, { Component } from 'react';
class DayItem extends Component {

    state = {  }

    showTrainings = ()=>{
        if(this.props.trainings ){
            let table = this.props.trainings.map( training=> (training.id) );
            this.props.showTrainings(table,this.props.dayNumber)
        }
    }

    render() { 

        let divStyle;
          
        let dow = this.props.dow;
        if(dow === 6){
            divStyle ={
                backgroundColor: '#003B71'
            }
        }else if(dow === 0){
            divStyle ={
                backgroundColor : '#2B3665'
            }
        }else if(dow === -1){
            divStyle ={
                opacity: '0'
            }
        }
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
           style={divStyle}
        >
            {this.props.dayNumber}
        </div> );
    }
}
 
export default DayItem;