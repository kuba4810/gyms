import React, { Component } from "react";
import {Link} from 'react-router-dom';
 

class SectionGym extends Component {
  state = {};

  render() {
    return (
      <React.Fragment>
        <div className="gymSearch text-center text-light" style={{marginBottom:0}}>
          <div className="gymSearchContent">

          <h1>Znajdź siłownię lub fitness w Twoim rejonie</h1>
          <h5>Pełne oferty siłowni wraz z opiniami i galerią</h5>

          <div className="container">
            <div className="row">
              <div className="input-group col-sm-5 mb-3 mx-auto">
                <div className="input-group-prepend ">
                  {/* <span className="input-group-text" id="inputGroup-sizing-default">Wyszukaj</span> */}
                </div>
                <input 
                  type="text" className="form-control" placeholder="Wpisz nazwę miasta"
                  onChange={this.props.filter}
                />
              </div>
            </div>
            </div>
            <Link to="silownie/new-gym"><button type="button" class="btn btn-outline-warning">Dodaj siłownię</button></Link>
          </div>
        </div>  
      </React.Fragment>
    );
  }
}

export default SectionGym;