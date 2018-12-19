import React, { Component } from 'react';

class HeaderGym extends React.Component {
    render() {
      return (
        <React.Fragment>
          <header>
            <nav className="nav-left">
              <img src="https://img.icons8.com/color/50/000000/dumbbell.png" />
            </nav>
  
            <nav className="nav-middle">
              <ul>
                <li>
                  <a className="active">Wyszukaj siłownie</a>
                </li>
                <li>
                  <a href="#">Wyszukaj trenera</a>
                </li>
                <li>
                  <a href="#">Forum</a>
                </li>
              </ul>
            </nav>
  
            <nav className="nav-right">
              <ul>
                <li>
                  <a>Zaloguj się</a>
                </li>
                <li>
                  <a>Zarejestruj się</a>
                </li>
              </ul>
            </nav>
          </header>
        </React.Fragment>
      );
    }
  }
   
  export default HeaderGym;