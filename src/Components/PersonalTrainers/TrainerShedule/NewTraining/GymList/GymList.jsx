import React, { Component } from 'react';
import GymItem from './GymItem';
class GymList extends Component {
    state = {}
    constructor() {
        super();
    }

    // Hide component
    hide = () => {
        let div = document.querySelector('.selectedGymsContainer');
        div.classList.add('invisible');
    }
    render() {
        console.log(this.props);

        let gyms = this.props.gyms.map(gym => (
            <GymItem
                    id={gym.gym_id}
                    name={gym.gym_name}
                    city={gym.city}
                    choose={this.props.choose}
                />
        ));
        return (
        <div className="selectedGymsContainer invisible">
            <div className="selectedGymHeader">
                Znalezione siłownie
                <div className="closeList">
                    <i class="fas fa-times" onClick={this.hide}>
                    </i>
                </div>
            </div>
            <ul>
                {gyms}
            </ul>
        </div>
        );
    }
}

export default GymList;