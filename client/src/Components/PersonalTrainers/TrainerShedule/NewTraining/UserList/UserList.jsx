import React, { Component } from 'react';
import UserItem from './UserItem'
class UserList extends Component {
    state = {}
    constructor() {
        super();
    }

    // Hide component
    hide = () => {
        let div = document.querySelector('.selectedUsersContainer');
        div.classList.add('invisible');
    }
    render() {
        console.log(this.props);

        let users = this.props.users.map(user => (
            <UserItem
                    id={user.user_id}
                    first_name={user.first_name}
                    last_name = {user.last_name}
                    login={user.login}
                    phone_number = {user.phone_number}
                    choose={this.props.choose}
                />
        ));
        return (
        <div className="selectedUsersContainer invisible">
            <div className="selectedGymHeader">
                Znalezieni użytkownicy
                <div className="closeList">
                    <i class="fas fa-times" onClick={this.hide}>
                    </i>
                </div>
            </div>
            <ul>
                {users}
            </ul>
        </div>
        );
    }
}
 
export default UserList;