import React from 'react';


import List from './List'


class GymListContainer extends React.Component{

    constructor(){
        super();

        this.state = {
            gymList:[],
            filteredGyms:[]
        }

    }

    render(){

       return(
        <div>
             <List text={"Jakiś napis"}/>
        </div>
       );
    }
     
}

export default GymListContainer;