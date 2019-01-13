import React, { Component } from "react";
import {Link} from 'react-router-dom';
 

class SectionGym extends Component {
  state = {};

  render() {
    return (
      <React.Fragment>
        <div className="jumbotron text-center bg-secondary mt-5" style={{marginBottom:0}}>
          <h3>Znajdź siłownię lub fitness w Twoim rejonie</h3>
          <h5>Pełne oferty siłowni wraz z opiniami i galerią</h5>

          <div className="container  ">
            <div className="row">
              <div className="input-group col-sm-5 mb-3 mx-auto">
                <div className="input-group-prepend ">
                  <span className="input-group-text" id="inputGroup-sizing-default">Wyszukaj</span>
                </div>
                <input type="text" className="form-control" aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-default"
                        onChange={this.props.filter}/>
              </div>
            </div>
            </div>
            <Link to="silownie/new-gym"><button type="button" class="btn btn-warning">Dodaj siłownię</button></Link>
        </div>  
      </React.Fragment>
    );
  }
}

export default SectionGym;
