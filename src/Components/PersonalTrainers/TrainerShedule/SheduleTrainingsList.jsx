import React, { Component } from 'react';

class SheduleTrainingsList extends Component {
    state = {  }
    componentDidMount(){
       
    }
    render() { 
        console.log('Lista dostała takie treningi', this.props.trainingsList)
        let items = this.props.trainingsList.map(tr=>( 
        <div 
        className="sheduleListItem  animated"
        onClick={this.props.showDetails} > 
        {tr.name}, {tr.price}, {tr.duration}
        
        </div>  ));

        return ( 
            <div className="sheduleList">               
                    {items}               
            </div>
         );
    }
}
 
export default SheduleTrainingsList;