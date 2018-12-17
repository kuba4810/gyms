import React, { Component } from 'react';
class DayItem extends Component {
    state = {  }
    render() { 
        return ( 
        <div className="dayItem">
            {this.props.dayNumber}
        </div> );
    }
}
 
export default DayItem;