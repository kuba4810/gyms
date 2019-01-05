import React, { Component } from "react";
import {Link} from 'react-router-dom';

class HeaderGym extends React.Component {
  render() {
    return (
      <React.Fragment>
      <nav className="navbar navbar-expand-md bg-dark navbar-dark fixed-top">
        <div className="justify-content-around collapse navbar-collapse" id="collapsibleNavbar">
            <a className="navbar-brand" href="#"><Link to="/"><img className="gym-header-img" src="https://img.icons8.com/color/50/000000/dumbbell.png" /></Link></a>
        </div>
        
        <div className="justify-content-around collapse navbar-collapse" id="collapsibleNavbar">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" href="#"><Link to="/silownie">Siłownie</Link></a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#"><Link to="/trenerzy">Trenerzy</Link></a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#"><Link to="/forum">Forum</Link></a>
                </li>
            </ul>
        </div>

        <div className="justify-content-around collapse navbar-collapse" id="collapsibleNavbar">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" href="#">Rejestracja</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">Zaloguj się</a>
                </li>
            </ul>
        </div>

        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                <span class="navbar-toggler-icon"></span>
        </button>

    </nav>
      </React.Fragment>
    );
  }
}

export default HeaderGym;
