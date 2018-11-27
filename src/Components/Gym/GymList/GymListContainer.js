import React from 'react';
import {connect} from 'react-redux'

import GymItem from './GymItem'
import {gymsFetched} from '../../../Actions/index'
import {filterGym} from '../../../Selectors/filterGym'

class GymListC extends React.Component{

    constructor(){
        super();
    }
    componentDidMount(){
        fetch('http://localhost:8080/api/gyms')
        .then( response => response.json())
            .then( response=>{
                this.props.gymsFetched(response);
            })
              .catch(error=>{
                alert("Wystąpił błąd , spróbuj ponownie później !");
              });
    }

    render(){

        var gyms;
        if(this.props.gym.gymList.length > 0){
            gyms = this.props.gym.gymList.map( (gym,index) => (<GymItem key={index} gymData = {gym}/>) );
        }

       return(
        <div class="gymContainer">
            <h3>Lista siłowni</h3>
            <ol>
            {gyms}
            </ol>
        </div>
       );
    }
     
}

const mapStateToProps = state => {
    return{
        gym: filterGym(state.gym)
    };
}
const mapDispatchToProps = {gymsFetched}
const  GymListContainer = connect(mapStateToProps,mapDispatchToProps)(GymListC);

export default GymListContainer;