import React from 'react';
import {connect} from 'react-redux'

import GymItem from './GymItem'
import {gymsFetched,gymSearchChanged} from '../../../Actions/index'
import {filterGym} from '../../../Selectors/filterGym'
import {Link} from 'react-router-dom'
import GymHeader from './GymHeader'
import GymSection from './GymSection'
import GymFooter from './GymFooter';


class GymListC extends React.Component{

    constructor(){
        super();
    }
    componentDidMount(){
        fetch('http://localhost:8080/api/gyms')
        .then( response => response.json())
            .then( response=>{
                if(response.response === 'failed'){
                    Promise.resolve();
                }
                this.props.gymsFetched(response);
            })
              .catch(error=>{
                alert("Wystąpił błąd , spróbuj ponownie później !");
              });
    }

    handleInputChange=(e)=>{
        this.props.gymSearchChanged(e.target.value);
    }

    render(){

        var gyms;
        if(this.props.gym.length > 0){
            gyms = this.props.gym.map( (gym,index) => (<GymItem key={index} gymData = {gym}/>) );
        }
        
        
       return(
        // <div class="gymContainer">
        //    <form>
        //        <div className="form-group">
        //             <label for="city">Miasto</label>
        //             <input class="form-control" name="city" type="text" onChange={this.handleInputChange}/>
        //        </div>
        //    </form>
        //     <Link to={"/silownie/new-gym"} className="btn btn-success" >Dodaj siłownie</Link>

        //     <h3>Lista siłowni</h3>
        //     <ol>
        //     {gyms}
        //     </ol>
        // </div>

        

        <React.Fragment>
        <GymHeader/>
        <GymSection/>
            <h2 className="text-center p-4">Dostępne obiekty:</h2>
            <div class="row container-fluid">
                {gyms}
            </div>
        <GymFooter/>
      </React.Fragment>

       );
    }
     
}

const mapStateToProps = state => {
    return{
        gym: filterGym(state.gym)
    };
}
const mapDispatchToProps = {gymsFetched,gymSearchChanged}
const  GymListContainer = connect(mapStateToProps,mapDispatchToProps)(GymListC);

export default GymListContainer;
