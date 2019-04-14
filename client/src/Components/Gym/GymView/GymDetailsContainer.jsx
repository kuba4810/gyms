import React from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom'
import { getGymDetails } from "../../../services/gymService";
import {
  gymDetailsFetched,
  newCommentSent,
  evaluation_update
} from "../../../Actions/index";

import { formatDate } from '../../../services/dateService';




class GymDetailsCont extends React.Component {

  state = {
    processing: true
  }
  componentDidMount() {
    console.log("Pobieram dane ...");
    fetch(`http://localhost:8080/api/gym/${this.props.match.params.gym_id}`)
      .then(response => response.json())
      .then(response => {
        console.log("Odpowiedź z serwera :", response);
        if (response.response == "success") {
          console.log("Wysyłam dane do magazynu...", response.data);
          this.props.gymDetailsFetched(response.data);
          this.setState({
            processing: false
          })
        } else {
          alert("Wystąpił błąd, spróbuj ponownie później !");
        }
      });
  }

  // Wystawianie oceny
  // --------------------------------------------------------------------------------------------
  vote = star => {
    let data = {
      gym_id: this.props.match.params.gym_id,
      star: star
    };
    console.log("Dane do oceny: ", data);

    fetch("http://localhost:8080/api/gym/vote", {
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
        if (res.response === "success") {
          this.props.evaluation_update(star);
        } else {
          alert("Wystąpił błąd, spróbuj ponownie później !");
        }
        console.log(res.response);
      })
      .catch(err => {
        console.log(err);
        alert("Wystąpił błąd, spróbuj ponownie później !");
      });
  };

  sendComment = e => {
    e.preventDefault();
    console.log(e.target.text.value);

    let data = {
      user_id: localStorage.getItem("loggedId"),
      gym_id: this.props.match.params.gym_id,
      text: e.target.text.value
    };

    console.log("Dane komentarza: ", data);

    fetch("http://localhost:8080/api/gym/comment", {
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
        console.log("Odpowiedź z serwera: ", res);
        if (res.response === "success") {
          this.props.newCommentSent(res.comment);
        } else {
          alert("Wystąpił błąd, spróbuj ponownie później !");
        }
      })
      .catch(err => {
        console.log(err);
        alert("Wystąpił błąd, spróbuj ponownie później !");
      });
  };

  render() {
    const data = this.props.gymDetails.gym.gymData;

    var primaryData = "";
    var offer = "";
    var packages = "";
    var openingHours = "";
    var equipment = "";
    var photos = "";
    const dowPl = [
      "Poniedziałek",
      "Wtorek",
      "Środa",
      "Czwartek",
      "Piątek",
      "Sobota",
      "Niedziela"
    ];
    const dowEng = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    var day = "mon";
    let evaluation = "";
    let comments = "";

    if (this.props.gymDetails.isLoading == false) {
      console.log("Magazyn: ", data);

      console.log("Ładuje dane: ", this.props.gymDetails.isLoading);


      photos = this.props.gymDetails.gym.photos.map(photo =>
        <div className="userAvatar mr-2">
          <div className="overlay">

            <i class="fas fa-eye text-primary"></i>

          </div>
          <img src={`http://localhost:8080/public/images/${photo.url}.jpg`} alt="Zdjęicie siłowni" />

        </div>)

      primaryData = (
        <table>
          <tr>
            {" "}
            <th>Nazwa</th> <th>Miejscowość</th> <th>Ulica</th> <th>Telefon</th>{" "}
          </tr>
          <tr>
            {" "}
            <td>{data.gym_name}</td> <td>{data.city}</td> <td>{data.street}</td>{" "}
            <td>{data.landline_phone}</td>{" "}
          </tr>
        </table>
      );

      openingHours = (
        <div>
          <table className="table  col-5 ">
            {dowEng.map((day, index) => (
              <tr>
                {" "}
                <td> {dowPl[index]}: </td> <td> {data[day]} </td>{" "}
              </tr>
            ))}
          </table>
        </div>
      );

      offer = (
        <table className="table table-hover col-8 ">
          <thead>
            <tr>
              <th scope="col">Oferta</th>
              <th scope="col">Opis</th>
            </tr>
          </thead>
          <tbody>
            {this.props.gymDetails.gym.offers.map(o => (
              <tr>
                {" "}
                <td> {o.offer_name} </td> <td>{o.description}</td>{" "}
              </tr>
            ))}
          </tbody>
        </table>
      );

      packages = (
        <div>
          <table className="table table-hover col-8">
            <thead>
              <tr>
                <th scope="col">Wejście</th>
                <th scope="col">Cena</th>
                <th scope="col">Czas trwania</th>
              </tr>
            </thead>
            {this.props.gymDetails.gym.packages.map(p => (
              <tr>
                {" "}
                <td>{p.package_name}</td>
                <td>{p.prize}zł</td>{" "}
                <td>{p.description}</td>{" "}
              </tr>
            ))}
          </table>
        </div>
      );
      equipment = data.equipment.split(",").map(eq => (
        <div>
          <i class="fas fa-check" /> {eq}{" "}
        </div>
      ));


      comments = (
        <div className="container gymComments ml-5 mt-3 mb-3 text-dark ">
          <h2>Komentarze</h2>
          {this.props.gymDetails.gym.comments.map(com => (
            <div className="mediaComment  p-1">
              <img src="https://img.icons8.com/color/48/c0392b/administrator-male.png" alt="" className="mr-3 mt-1 rounded-circle" style={{ width: 60 + "px" }} />
              <div className="mediaBodyComment">
                <h4>
                  <Link to={`/uzytkownik/profil/${com.login}`}>{com.login}</Link>
                  <small>
                    <i className="ml-2">{formatDate(com.creation_date)}</i>
                  </small>
                </h4>
                <p>{com.content}</p>
              </div>
            </div>))}
        </div>
      );
    }



    let starView = () => {

      if (this.props.gymDetails.gym.gymData.evaluation === 0) {
        return (
          <div>
            <i style={{ color: "grey" }} className="fas fa-star"></i>
            <i style={{ color: "grey" }} className="fas fa-star"></i>
            <i style={{ color: "grey" }} className="fas fa-star"></i>
            <i style={{ color: "grey" }} className="fas fa-star"></i>
            <i style={{ color: "grey" }} className="fas fa-star"></i>
            {/* <p>!! oceń jako pierwszy</p> */}
          </div>
        )
      }


      if (this.props.gymDetails.gym.gymData.evaluation > 0.74 && this.props.gymDetails.gym.gymData.evaluation < 1.25) {
        return (
          <div>
            <i style={{ color: "yellow" }} className="fas fa-star"></i>
            <i style={{ color: "grey", }} className="fas fa-star"></i>
            <i style={{ color: "grey" }} className="fas fa-star"></i>
            <i style={{ color: "grey" }} className="fas fa-star"></i>
            <i style={{ color: "grey" }} className="fas fa-star"></i>
          </div>
        )
      }

      if (this.props.gymDetails.gym.gymData.evaluation > 1.24 && this.props.gymDetails.gym.gymData.evaluation < 1.75) {
        return (
          <div>
            <i style={{ color: "yellow" }} className="fas fa-star"></i>
            <i style={{ color: "yellow", }} className="fas fa-star-half-alt"></i>
            <i style={{ color: "grey" }} className="fas fa-star"></i>
            <i style={{ color: "grey" }} className="fas fa-star"></i>
            <i style={{ color: "grey" }} className="fas fa-star"></i>
          </div>
        )
      }


      if (this.props.gymDetails.gym.gymData.evaluation > 1.74 && this.props.gymDetails.gym.gymData.evaluation < 2.25) {
        return (
          <div>
            <i style={{ color: "yellow" }} className="fas fa-star"></i>
            <i style={{ color: "yellow" }} className="fas fa-star"></i>
            <i style={{ color: "grey" }} className="fas fa-star"></i>
            <i style={{ color: "grey" }} className="fas fa-star"></i>
            <i style={{ color: "grey" }} className="fas fa-star"></i>
          </div>
        )
      }

      if (this.props.gymDetails.gym.gymData.evaluation > 2.24 && this.props.gymDetails.gym.gymData.evaluation < 2.75) {
        return (
          <div>
            <i style={{ color: "yellow" }} className="fas fa-star"></i>
            <i style={{ color: "yellow" }} className="fas fa-star"></i>
            <i style={{ color: "yellow" }} className="fas fa-star-half-alt"></i>
            <i style={{ color: "grey" }} className="fas fa-star"></i>
            <i style={{ color: "grey" }} className="fas fa-star"></i>
          </div>
        )
      }


      if (this.props.gymDetails.gym.gymData.evaluation > 2.74 && this.props.gymDetails.gym.gymData.evaluation < 3.25) {
        return (
          <div>
            <i style={{ color: "yellow" }} className="fas fa-star"></i>
            <i style={{ color: "yellow" }} className="fas fa-star"></i>
            <i style={{ color: "yellow" }} className="fas fa-star"></i>
            <i style={{ color: "grey" }} className="fas fa-star"></i>
            <i style={{ color: "grey" }} className="fas fa-star"></i>
          </div>
        )
      }

      if (this.props.gymDetails.gym.gymData.evaluation > 3.24 && this.props.gymDetails.gym.gymData.evaluation < 3.75) {
        return (
          <div>
            <i style={{ color: "yellow" }} className="fas fa-star"></i>
            <i style={{ color: "yellow" }} className="fas fa-star"></i>
            <i style={{ color: "yellow" }} className="fas fa-star"></i>
            <i style={{ color: "yellow" }} className="fas fa-star-half-alt"></i>
            <i style={{ color: "grey" }} className="fas fa-star"></i>
          </div>
        )
      }


      if (this.props.gymDetails.gym.gymData.evaluation > 3.74 && this.props.gymDetails.gym.gymData.evaluation < 4.25) {
        return (
          <div>
            <i style={{ color: "yellow" }} className="fas fa-star"></i>
            <i style={{ color: "yellow" }} className="fas fa-star"></i>
            <i style={{ color: "yellow" }} className="fas fa-star"></i>
            <i style={{ color: "yellow" }} className="fas fa-star"></i>
            <i style={{ color: "grey", }} className="fas fa-star"></i>
          </div>
        )
      }

      if (this.props.gymDetails.gym.gymData.evaluation > 4.24 && this.props.gymDetails.gym.gymData.evaluation < 4.75) {
        return (
          <div>
            <i style={{ color: "yellow" }} className="fas fa-star"></i>
            <i style={{ color: "yellow" }} className="fas fa-star"></i>
            <i style={{ color: "yellow" }} className="fas fa-star"></i>
            <i style={{ color: "yellow" }} className="fas fa-star"></i>
            <i style={{ color: "yellow" }} className="fas fa-star-half-alt"></i>
          </div>
        )
      }


      if (this.props.gymDetails.gym.gymData.evaluation > 4.74 && this.props.gymDetails.gym.gymData.evaluation < 5.25) {
        return (
          <div>
            <i style={{ color: "yellow" }} className="fas fa-star"></i>
            <i style={{ color: "yellow" }} className="fas fa-star"></i>
            <i style={{ color: "yellow" }} className="fas fa-star"></i>
            <i style={{ color: "yellow" }} className="fas fa-star"></i>
            <i style={{ color: "yellow" }} className="fas fa-star"></i>
          </div>
        )
      }
    }

    if (this.props.gymDetails.isLoading === false && this.state.processing === false) {
      return (

        <React.Fragment>


          <div className="container-fluid gymDetailsContainer">
            <div className="gymContent pt-5">
              <div className="row pt-5 animated fadeIn">
                <div className="col-12 ">

                  <div className="card  gymHeader  ml-5">
                    <div className="card-header">
                      <div className="d-flex flex-row justify-content-around">
                        <div className="gymAvatar">

                          {/* <img src={require('../../../images/findYourGym.jpg')} alt="" style={{width:"8rem", height:"8rem"}}/> */}
                        </div>
                        <div className="text-dark m-5">
                          <h2>{this.props.gymDetails.gym.gymData.gym_name}, {this.props.gymDetails.gym.gymData.city}</h2>
                        </div>
                        <div className="text-dark m-5"><h3>{starView()}</h3></div>
                        <div></div>
                        <div></div>


                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-8">

                      <div className="card content text-white ml-5  m-4">
                        <div className="card-header">
                          <h4 className="card-title">Zdjęcia</h4>
                        </div>
                        <div className="card-body ">
                          <div className="d-flex">
                            {photos}
                          </div>
                        </div>

                      </div>

                      <div className="card content text-white  ml-5  m-4">
                        <div className="card-header">
                          <h4 className="card-title">O siłowni</h4>
                        </div>
                        <div className="card-body">
                          <p className="card-text">{this.props.gymDetails.gym.gymData.description}</p>
                        </div>
                      </div>


                      <div className="card content text-white  ml-5  m-4">
                        <div className="card-header">
                          <h4 className="card-title">Oferta</h4>
                        </div>
                        <div className="card-body">
                          <p className="card-text">{offer}</p>
                        </div>
                      </div>


                      <div className="card content text-white ml-5  m-4">
                        <div className="card-header">
                          <h4 className="card-title">Godziny Otwarcia-zamknięcia</h4>
                        </div>
                        <div className="card-body">
                          <p className="card-text">{openingHours}</p>
                        </div>
                      </div>

                      <div className="card content text-white  ml-5  m-4">
                        <div className="card-header">
                          <h4 className="card-title">Cennik</h4>
                        </div>
                        <div className="card-body">
                          <p className="card-text">{packages}</p>
                        </div>
                      </div>


                      <div>
                        {comments}
                      </div>
                      {(localStorage.getItem('isLoggedIn') === 'true' && localStorage.getItem('type') === 'user') &&
                        <form onSubmit={this.sendComment} className='gymCommentForm shadow-textarea text-dark text-center pt-5 ' >
                          <legend className="pl-5 text-left text-light" id="wystawKomentarz "><h3>Wystaw Komentarz</h3></legend>
                          <div className="form-group">
                            <textarea className="form-control  text-dark ml-5" name="text" id="" cols="30" rows="10"></textarea>
                          </div>
                          <button type="submit" className="btn btn-success">Wyślij</button>
                        </form>
                      }



                    </div>


                    <div className="col-3 ">
                      <div className="card text-dark  px-3 py-3 m-4">
                        <h4>Trenowałeś tu ?</h4>
                        <a href="#wystawKomentarz"><button class="btn btn-warning ml-5">Wystaw komentarz!</button></a>
                      </div>

                      <div className="card text-dark  px-3 py-3 m-4">
                        <div className="card-header">

                          <h3>Adres i dane kontaktowe:</h3>
                        </div>
                        <p><i class="far fa-envelope"> {this.props.gymDetails.gym.gymData.email}</i></p>
                        <p><i class="fas fa-map-marker-alt"> {this.props.gymDetails.gym.gymData.street} {this.props.gymDetails.gym.gymData.city}</i></p>
                        <p><i class="fas fa-phone"> {this.props.gymDetails.gym.gymData.phone_number}</i></p>
                      </div>

                      <div className="card text-dark  px-3 py-3 m-4">
                        <h3>Siłownie w pobliżu:</h3>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>





        </React.Fragment>
      );
    }
    else {
      return <div className="bg-secondary dataLoading gymDetailsContainer">
        <div className="gymContent">
          <div className="dataLoadingMessage">

            <h3>Ładowanie danych</h3>
            <div className="littleSpinner" ></div>

          </div>
        </div>
      </div>;
    }
  }
}

const mapStateToProps = state => {
  return {
    gymDetails: state.gymDetails,

  };
};
const mapDispatchToProps = {
  gymDetailsFetched,
  newCommentSent,
  evaluation_update
};
const GymDetailsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GymDetailsCont);

export default GymDetailsContainer;
