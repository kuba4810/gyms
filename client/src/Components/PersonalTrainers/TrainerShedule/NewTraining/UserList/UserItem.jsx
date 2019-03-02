import React, { Component } from 'react';
class UserItem extends Component {
    state = {  }
    render() {
        let user_name = `${this.props.first_name} ${this.props.last_name}`
        return (
        <div className="selectedGymItem">
            <li onClick={this.props.choose.bind(null,this.props.id,user_name,this.props.phone_number)}>
                <b>{this.props.first_name} {this.props.last_name}</b>, {this.props.login}
            </li>
        </div>
        );
    }
}
 
export default UserItem;