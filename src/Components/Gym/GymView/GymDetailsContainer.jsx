import React from 'react'
import { connect } from 'react-redux'

import { getGymDetails } from '../../../services/gymService'
import { gymDetailsFetched } from '../../../Actions/index'


class GymDetailsCont extends React.Component {

    componentDidMount() {
        console.log("Pobieram dane ...")
        fetch(`http://localhost:8080/api/gym/${this.props.match.params.gym_id}`)
            .then(response => response.json())
            .then(response => {

                console.log("Odpowiedź z serwera :", response);
                if (response.response == 'success') {
                    console.log("Wysyłam dane do magazynu...", response.data)
                    this.props.gymDetailsFetched(response.data);

                } else {
                    alert("Wystąpił błąd, spróbuj ponownie później !");
                }

            });


    }
    render() {
        const data = this.props.gymDetails.gym.gymData;

        var primaryData = ''
        var offer = ''
        var packages = ''
        var openingHours = ''
        var equipment = ''
        const dowPl = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela']
        const dowEng = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
        var day = 'mon'


        if (this.props.gymDetails.isLoading == false) {
            console.log("Magazyn: ", data);


            console.log("Ładuje dane: ", this.props.gymDetails.isLoading);
            primaryData = <table>
                <tr> <th>Nazwa</th> <th>Miejscowość</th> <th>Ulica</th> <th>Telefon</th> </tr>
                <tr> <td>{data.gym_name}</td> <td>{data.city}</td> <td>{data.street}</td> <td>{data.landline_phone}</td> </tr>
            </table>

            openingHours = <div>
                <h3>Godziny otwarcia</h3>
                <table>
                    {dowEng.map((day, index) => (<tr> <td> {dowPl[index]}: </td> <td> {data[day]} </td> </tr>))}
                </table>
            </div>

            offer = <table>
                <tr>
                    <th>Oferta</th>
                    <th>Opis</th>
                </tr>
                {this.props.gymDetails.gym.offers.map(o => (<tr> <td> {o.offer_name} </td> <td>{o.description}</td> </tr>))}
            </table>


            packages =
                <div>
                    <h3> Cennik </h3>
                    <table>
                        {this.props.gymDetails.gym.packages.map(p => (<tr> <td>{p.package_name}</td> <td>{p.prize}zł</td> <td>{p.description}</td> </tr>))}
                    </table>
                </div>
            equipment = data.equipment.split(',').map( eq => ( <div><i class="fas fa-check"></i> {eq}  </div> ) )

        }
        return (
            <div class="color-cornsilk">
                <h2> Witam, jestem widokiem siłowni <em>{this.props.match.params.gym_name}</em> :D </h2>
                <br />
                <hr />
                <h3>Podstawowe dane</h3>

                {primaryData}

                {openingHours}

                <h3>Oferta</h3>

                {offer}

                {packages}

                <h3>Wyposażenie</h3>

                <h5>
                    {equipment}
                </h5>
            </div>

        );
    }
}

const mapStateToProps = state => {
    return {
        gymDetails: state.gymDetails
    };
}
const mapDispatchToProps = { gymDetailsFetched }
const GymDetailsContainer = connect(mapStateToProps, mapDispatchToProps)(GymDetailsCont);

export default GymDetailsContainer;