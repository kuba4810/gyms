import React, { Component } from 'react';
class GymItem extends Component {
    state = {}
    render() {
        return (
        <div className="selectedGymItem">
            <li onClick={this.props.choose.bind(null,this.props.id,this.props.name)}>
                <b>{this.props.name}</b>, {this.props.city}
            </li>
        </div>
        );
    }
}

export default GymItem;