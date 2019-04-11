import React from 'react'
import { Link } from 'react-router-dom'


class GymItem extends React.Component {
    render() {
        var gymData = this.props.gymData;
        let description = gymData.description.slice(0, 150);
        


        // Funkcja do wyświetlania gwiazdek 
        const starView = () => {

            if (gymData.evaluation === 0) {
                return (
                    <div>
                        <i style={{color: "grey"}} className="fas fa-star"></i>
                        <i style={{color: "grey"}} className="fas fa-star"></i>
                        <i style={{color: "grey"}} className="fas fa-star"></i>
                        <i style={{color: "grey"}} className="fas fa-star"></i>
                        <i style={{color: "grey"}} className="fas fa-star"></i>
                        {/* <p>!! oceń jako pierwszy</p> */}
                    </div>
                )
            } 
            
            
            if (gymData.evaluation > 0.74 && gymData.evaluation < 1.25) {
                return (
                    <div>
                        <i style={{ color: "yellow" }} className="fas fa-star"></i>
                        <i style={{color: "grey",}} className="fas fa-star"></i>
                        <i style={{color: "grey"}} className="fas fa-star"></i>
                        <i style={{color: "grey"}} className="fas fa-star"></i>
                        <i style={{color: "grey"}} className="fas fa-star"></i>
                    </div>
                )
            } 

            if (gymData.evaluation > 1.24 && gymData.evaluation < 1.75) {
                return (
                    <div>
                        <i style={{ color: "yellow" }} className="fas fa-star"></i>
                        <i style={{color: "yellow",}} className="fas fa-star-half-alt"></i>
                        <i style={{color: "grey"}} className="fas fa-star"></i>
                        <i style={{color: "grey"}} className="fas fa-star"></i>
                        <i style={{color: "grey"}} className="fas fa-star"></i>
                    </div>
                )
            } 
            
            
            if (gymData.evaluation > 1.74 && gymData.evaluation < 2.25) {
                return (
                    <div>
                        <i style={{ color: "yellow"}} className="fas fa-star"></i>
                        <i style={{ color: "yellow" }} className="fas fa-star"></i>
                        <i style={{color: "grey"}} className="fas fa-star"></i>
                        <i style={{color: "grey"}} className="fas fa-star"></i>
                        <i style={{color: "grey"}} className="fas fa-star"></i>
                    </div>
                )
            }

            if (gymData.evaluation > 2.24 && gymData.evaluation < 2.75) {
                return (
                    <div>
                        <i style={{ color: "yellow"}} className="fas fa-star"></i>
                        <i style={{ color: "yellow" }} className="fas fa-star"></i>
                        <i style={{color: "yellow"}} className="fas fa-star-half-alt"></i>
                        <i style={{color: "grey"}} className="fas fa-star"></i>
                        <i style={{color: "grey"}} className="fas fa-star"></i>
                    </div>
                )
            } 
            
            
            if (gymData.evaluation > 2.74 && gymData.evaluation < 3.25) {
                return (
                    <div>
                        <i style={{ color: "yellow"}} className="fas fa-star"></i>
                        <i style={{ color: "yellow" }} className="fas fa-star"></i>
                        <i style={{color: "yellow"}} className="fas fa-star"></i>
                        <i style={{color: "grey"}} className="fas fa-star"></i>
                        <i style={{color: "grey"}} className="fas fa-star"></i>
                    </div>
                )
            }

            if (gymData.evaluation > 3.24 && gymData.evaluation < 3.75) {
                return (
                    <div>
                        <i style={{ color: "yellow"}} className="fas fa-star"></i>
                        <i style={{ color: "yellow" }} className="fas fa-star"></i>
                        <i style={{color: "yellow"}} className="fas fa-star"></i>
                        <i style={{color: "yellow"}} className="fas fa-star-half-alt"></i>
                        <i style={{color: "grey"}} className="fas fa-star"></i>
                    </div>
                )
            } 
            

            if (gymData.evaluation > 3.74 && gymData.evaluation < 4.25) {
                return (
                    <div>
                        <i style={{ color: "yellow" }} className="fas fa-star"></i>
                        <i style={{ color: "yellow" }} className="fas fa-star"></i>
                        <i style={{ color: "yellow" }} className="fas fa-star"></i>
                        <i style={{ color: "yellow" }} className="fas fa-star"></i>
                        <i style={{color: "grey",}} className="fas fa-star"></i>
                    </div>
                )
            }

            if (gymData.evaluation > 4.24 && gymData.evaluation < 4.75) {
                return (
                    <div>
                        <i style={{ color: "yellow"}} className="fas fa-star"></i>
                        <i style={{ color: "yellow" }} className="fas fa-star"></i>
                        <i style={{color: "yellow"}} className="fas fa-star"></i>
                        <i style={{color: "yellow"}} className="fas fa-star"></i>
                        <i style={{color: "yellow"}} className="fas fa-star-half-alt"></i>
                    </div>
                )
            } 
            
            
            if (gymData.evaluation > 4.74 && gymData.evaluation < 5.25) {
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
        
        return (
            <React.Fragment>

                <div class="col-md-6 col-xl-4 p-1 animated fadeIn">
                    <div class="card text-white h-100">
                        <div class="card-header d-flex justify-content-between">
                            <div><img src="https://img.icons8.com/color/50/000000/dumbbell.png" class="rounded-circle" /></div>
                            <div><Link to={`silownie/view/${gymData.gym_id}/${gymData.gym_name.split(' ').join('-')}`}> {gymData.gym_name} </Link>,{gymData.city}</div>
                            <div>{starView()}</div>
                        </div>
                        <div class="card-body p-0" id="gymItemBody">
                          <div className="card-body-content p-2" id="gymItemBodyContent">

                            <p style={{ minHeight: "5vw" }} class="card-text ">{description}...</p>
                            <p class="card-text">Sauna, siłownia</p>

                          </div>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                        <div class="tooltipHours"><i class="far fa-clock mr-2"></i>Godziny otwarcia
                                    <span class="tooltiptextHours">
                                        <table className="tableOpeningHours"> 
                                            <tr>
                                                <td className="tdOpeningHours">Poniedziałek:</td>
                                                <td>{gymData.mon}</td>
                                            </tr>
                                            <tr>
                                                <td className="tdOpeningHours">Wtorek:</td>
                                                <td>{gymData.tue}</td>
                                            </tr>
                                            <tr>
                                                <td className="tdOpeningHours">Środa:</td>
                                                <td>{gymData.wed}</td>
                                            </tr>
                                            <tr>
                                                <td className="tdOpeningHours">Czwartek:</td>
                                                <td>{gymData.thu}</td>
                                            </tr>
                                            <tr>
                                                <td className="tdOpeningHours">Piątek:</td>
                                                <td>{gymData.fri}</td>
                                            </tr>
                                            <tr>
                                                <td className="tdOpeningHours">Sobota:</td>
                                                <td>{gymData.sat}</td>
                                            </tr>
                                            <tr>
                                                <td className="tdOpeningHours">Niedziela:</td>
                                                <td>{gymData.sun}</td>
                                            </tr>
                                        </table>
                                    </span>
                            </div>
                        </div>
                    </div>
                </div>

            </React.Fragment>
        );
    }
}

export default GymItem