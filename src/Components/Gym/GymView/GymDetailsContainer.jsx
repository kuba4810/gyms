import React from 'react'
import { connect } from 'react-redux'

import { getGymDetails } from '../../../services/gymService'
import { gymDetailsFetched,newCommentSent ,evaluation_update} from '../../../Actions/index'


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

    // Wystawianie oceny
    // --------------------------------------------------------------------------------------------
    vote = (star) => {
        let data = {
            gym_id: this.props.match.params.gym_id,
            star: star
        }
        console.log('Dane do oceny: ', data)

        fetch('http://localhost:8080/api/gym/vote', {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",

            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.response === 'success') {
                    this.props.evaluation_update(star)
                } else {
                    alert('Wystąpił błąd, spróbuj ponownie później !')
                }
                console.log(res.response)
            })
            .catch(err => {
                console.log(err);
                alert('Wystąpił błąd, spróbuj ponownie później !')
            })
    }

    sendComment = (e) =>{
        e.preventDefault();
        console.log(e.target.text.value);

        let data = {
            user_id : localStorage.getItem("loggedId"),
            gym_id: this.props.match.params.gym_id,
            text: e.target.text.value
        }

        console.log('Dane komentarza: ', data)
        
        fetch('http://localhost:8080/api/gym/comment', {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",

            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(res => {
                console.log('Odpowiedź z serwera: ',res)
                if (res.response === 'success') {

                    this.props.newCommentSent(res.comment);
                } else {
                    alert('Wystąpił błąd, spróbuj ponownie później !')
                }
              
            })
            .catch(err => {
                console.log(err)
                alert('Wystąpił błąd, spróbuj ponownie później !')
            })
    }
    render() {
        const data = this.props.gymDetails.gym.gymData;

        var primaryData = ''
        var offer = ''
        var packages = ''
        var openingHours = ''
        var equipment = ''
        var photos = ''
        const dowPl = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela']
        const dowEng = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
        var day = 'mon'
        let evaluation = ''
        let comments =''


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
            equipment = data.equipment.split(',').map(eq => (<div><i class="fas fa-check"></i> {eq}  </div>))

            // Opinie
            comments =  
                <table>
                    <tr>
                       <th>Użytkownik</th>
                       <th>Data</th>
                       <th>Treść</th>
                    </tr>
                    {this.props.gymDetails.gym.comments.map(com => 
                        (<tr> <td> {com.login} </td> <td>{com.creation_date}</td> <td> {com.content} </td>  </tr>))}
                 </table>  
        }
        return (
            <div class="color-cornsilk">
                <h2> Witam, jestem widokiem siłowni <em>{this.props.match.params.gym_name}</em> :D </h2>
                <br />
                <hr />

                <h3>Ocena: {!this.props.gymDetails.isLoading ? data.evaluation : ''}</h3>
                <div class="starDiv">
                    <span class="starDivTitle">
                        Oceń:
                   </span>
                    <div class="stars">
                        <i class="fas fa-star rateStar" id="rateStar5" onClick={this.vote.bind(null, 5)}></i>
                        <i class="fas fa-star rateStar" id="rateStar4" onClick={this.vote.bind(null, 4)} ></i>
                        <i class="fas fa-star rateStar" id="rateStar3" onClick={this.vote.bind(null, 3)}></i>
                        <i class="fas fa-star rateStar" id="rateStar2" onClick={this.vote.bind(null, 2)}></i>
                        <i class="fas fa-star rateStar" id="rateStar1" onClick={this.vote.bind(null, 1)}></i>
                    </div>
                </div>

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

                {/* <h3>Zdjęcia</h3> */}
                {/* <img src={require("./images/pakernia/obraz7.jpg")}/> */}


                {(localStorage.getItem('isLoggedIn') === 'true') &&
                    <form onSubmit={this.sendComment} className='gymCommentForm' >
                        <legend><h3>Wystaw opinie</h3></legend>
                        <div className="form-group">
                        <textarea className="form-control" name="text" id="" cols="30" rows="10"></textarea>
                        </div>
                        <button type="submit" className="btn-success">Wyślij</button>
                    </form>
                }

                {comments}
            </div>

        );
    }
}

const mapStateToProps = state => {
    return {
        gymDetails: state.gymDetails
    };
}
const mapDispatchToProps = { gymDetailsFetched ,newCommentSent,evaluation_update}
const GymDetailsContainer = connect(mapStateToProps, mapDispatchToProps)(GymDetailsCont);

export default GymDetailsContainer;