import React from 'react'
import {connect} from 'react-redux'

import {getGymDetails} from '../../../services/gymService'
import {gymDetailsFetched} from '../../../Actions/index'


class GymDetailsCont extends React.Component{

    componentDidMount(){
        console.log("Pobieram dane ...")
        fetch(`http://localhost:8080/api/gym/${this.props.match.params.gym_id}`)
        .then( response => response.json())
            .then( response => {

                console.log("Odpowiedź z serwera :" ,response);
                if(response.response == 'success'){    
                    console.log("Wysyłam dane do magazynu...",response.data)                
                    this.props.gymDetailsFetched(response.data);
                    
                }else{
                    alert("Wystąpił błąd, spróbuj ponownie później !");
                }                
               
            });

          
    }
    render(){
        const data = this.props.gymDetails.gym.gymData;
        var primaryData=''
        var offer =''
        var packages=''
       
        console.log("Magazyn: ",this.props.gymDetails);
        
        if(this.props.gymDetails.isLoading == false){
            console.log("Ładuje dane: ",this.props.gymDetails.isLoading);    
             primaryData = <table>
                 <tr> <th>Nazwa</th> <th>Miejscowość</th> <th>Ulica</th> <th>Telefon</th> </tr>
                 <tr> <td>{data.gym_name}</td> <td>{data.city}</td> <td>{data.street}</td> <td>{data.landline_phone}</td> </tr>
                </table>      

            offer = <table>
                <tr>
                    <th>Oferta</th>
                    <th>Opis</th>
                </tr>
                {this.props.gymDetails.gym.offers.map( o=>( <tr> <td> {o.offer_name} </td> <td>{o.description}</td> </tr> ) )}
            </table>
           

            packages = 
            <table>
            <tr>
                <th>Pakiet</th>
                <th>Opis</th>
            </tr>
             {this.props.gymDetails.gym.packages.map( p=>( <tr> <td>{p.package_name}</td> <td>{p.description}</td> </tr> ) )}
        </table>

        }
        return(
                <div class="color-cornsilk">
                   <h2> Witam, jestem widokiem siłowni <em>{this.props.match.params.gym_name}</em> :D </h2>
                    <br/>
                    <hr/>
                   <h3>Podstawowe dane</h3>
          
            {primaryData}

            <h3>Oferta</h3>
           
                {offer}
   

            <h3>Pakiety</h3>
            {packages}
                </div>

        );
    }
}

const mapStateToProps = state => {
    return{
        gymDetails: state.gymDetails
    };
}
const mapDispatchToProps = {gymDetailsFetched}
const  GymDetailsContainer = connect(mapStateToProps,mapDispatchToProps)(GymDetailsCont);

export default GymDetailsContainer;